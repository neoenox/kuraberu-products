import { describe, expect, it } from "vitest";

/**
 * embed-consent contract tests.
 *
 * These test the pure logic (storage key, value validation, round-trip) by
 * reading the module source directly — avoiding the localStorage mock
 * complexity in vitest's Node sandbox.
 *
 * The browser integration (actually reading/writing localStorage) is verified
 * by the production HTML check which confirms the consent banner is rendered
 * and autoload embeds check consent before loading.
 */

// Read the module source and verify the contract
import { readFileSync } from "node:fs";

const source = readFileSync("src/lib/embed-consent.ts", "utf8");

// The consent notice bar lives in the component script; its contract is
// verified the same way (source-level assertions).
const componentSource = readFileSync(
  "src/components/ExternalEmbed.astro",
  "utf8",
);

describe("embed-consent contract", () => {
  it("uses a fixed localStorage key", () => {
    expect(source).toContain('const CONSENT_KEY = "embed-consent"');
  });

  it("exports STORAGE_KEY matching the constant", () => {
    expect(source).toContain("export const STORAGE_KEY = CONSENT_KEY");
  });

  it("only allows 'granted' or 'denied' as valid stored values", () => {
    // The getConsent function must reject any value other than granted/denied
    expect(source).toContain(
      'if (stored === "granted" || stored === "denied")',
    );
  });

  it("uses globalThis.localStorage for storage access", () => {
    // Must use globalThis, not bare `localStorage`, for testability
    expect(source).toContain("globalThis.localStorage");
  });

  it("wraps localStorage access in try/catch for SSR safety", () => {
    // Both getConsent and setConsent must handle missing localStorage
    expect(source).toContain("try {");
    expect(source).toContain("} catch {");
  });

  it("exports getConsent function", () => {
    expect(source).toContain("export function getConsent()");
  });

  it("exports setConsent function", () => {
    expect(source).toContain(
      "export function setConsent(consent: EmbedConsent)",
    );
  });

  it("exports clearConsent function", () => {
    expect(source).toContain("export function clearConsent()");
  });

  it("exports onConsentChange callback registration", () => {
    expect(source).toContain("export function onConsentChange(");
  });

  it("exports getCachedConsent for performance", () => {
    expect(source).toContain("export function getCachedConsent()");
  });

  it("type-declares window.__embedConsent and __embedConsentCallbacks", () => {
    expect(source).toContain("__embedConsent?: EmbedConsent");
    expect(source).toContain("__embedConsentCallbacks?: Set");
  });

  it("setConsent notifies listeners", () => {
    expect(source).toContain("window.__embedConsentCallbacks?.forEach");
  });

  it("clearConsent fires listeners with undefined", () => {
    expect(source).toContain("cb(undefined)");
  });
});

describe("default display (embed-consent.ts)", () => {
  it("treats an unset choice as granted (embeds are shown by default)", () => {
    expect(source).toContain(
      'export const DEFAULT_CONSENT: EmbedConsent = "granted"',
    );
    expect(source).toContain(
      "export function getEffectiveConsent(): EmbedConsent",
    );
    expect(source).toContain("getCachedConsent() ?? DEFAULT_CONSENT");
  });

  it("keeps a stored denial as the priority over the default", () => {
    // getConsent still returns only an explicit granted / denied value
    expect(source).toContain('stored === "granted" || stored === "denied"');
  });
});

describe("consent notice bar (ExternalEmbed.astro)", () => {
  it("shows embeds by default and skips loading only for a stored denial", () => {
    expect(componentSource).toContain("getEffectiveConsent");
    expect(componentSource).toContain(
      'if (getEffectiveConsent() !== "denied") {',
    );
  });

  it("no longer blocks on a consent banner", () => {
    expect(componentSource).not.toContain("showConsentBanner");
    expect(componentSource).not.toContain("data-embed-consent-banner");
    expect(componentSource).not.toContain("data-embed-consent-accept");
    expect(componentSource).not.toContain("clearConsent");
  });

  it("renders one non-blocking notice region with disclosure and a deny control", () => {
    expect(componentSource).toContain("[data-embed-consent-bar]");
    expect(componentSource).toContain('setAttribute("role", "region")');
    expect(componentSource).not.toContain('"dialog"');
    expect(componentSource).toContain(
      "外部コンテンツ（X・YouTubeなど）を表示しています。",
    );
    expect(componentSource).toContain(
      "IPアドレスなどが外部サービスに送信される場合があります。",
    );
    expect(componentSource).toContain('link.href = "/privacy/"');
    expect(componentSource).toContain('button.textContent = "表示しない"');
    expect(componentSource).toContain('button.textContent = "表示する"');
  });

  it("stores the choice and re-renders the bar after a toggle", () => {
    expect(componentSource).toContain('setConsent("denied")');
    expect(componentSource).toContain('setConsent("granted")');
    expect(componentSource).toContain(
      "showConsentControl({ rerender: true, focus: true })",
    );
  });

  it("does not steal focus on page load", () => {
    // focus moves only after the reader toggles the choice
    expect(componentSource).toContain(
      "if (options.focus) button.focus({ preventScroll: true });",
    );
  });

  it("moves focus into an embed only after the reader clicks its load button", () => {
    // 自動の読み込みでフォーカスを奪わない（event がある呼び出しだけ移す）
    expect(componentSource).toContain("const onClick = (event?: Event) => {");
    expect(componentSource).toContain(
      "if (event) target.focus({ preventScroll: true });",
    );
    expect(componentSource).not.toContain(
      "\n          target.focus({ preventScroll: true });",
    );
  });

  it("restores embed placeholders after switching to 表示しない", () => {
    expect(componentSource).toContain("const resetToPlaceholder = () => {");
    expect(componentSource).toContain('root.dataset.embedState = "idle"');
    expect(componentSource).toContain("resetToPlaceholder()");
  });

  it("keeps the manual-load button restorable for autoload embeds", () => {
    expect(componentSource).toContain("button.hidden = true;");
  });
});
