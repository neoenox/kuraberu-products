export function shortIntroduction(text: string): string {
  return text.match(/^.*?[。！？]/u)?.[0] ?? text;
}

export function priceAgeDays(
  checkedAt: string,
  now = new Date(),
): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)) return null;
  const checked = new Date(`${checkedAt}T00:00:00Z`);
  if (
    !Number.isFinite(checked.getTime()) ||
    checked.toISOString().slice(0, 10) !== checkedAt
  )
    return null;
  const today = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const days =
    (Date.parse(`${today}T00:00:00Z`) - checked.getTime()) / 86400000;
  return days < 0 ? null : days;
}
