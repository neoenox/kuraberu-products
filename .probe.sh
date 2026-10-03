U=https://item.rakuten.co.jp/babybjorn/baby-carrier-harmony/
CH="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
F='  code=%{http_code} t=%{time_total} ip=%{remote_ip}\n'
for ua in "node" "curl/8.5.0" "$CH"; do
  for m in "-I" "-X GET"; do
    echo "UA=[$ua] mode=[$m]"
    curl -sS $m -o /dev/null -m 15 -A "$ua" -w "$F" "$U" || echo "  curl exit $?"
  done
done
echo "chrome UA + ja headers"
curl -sS -o /dev/null -m 15 -A "$CH" -H "Accept-Language: ja-JP,ja;q=0.9" -H "Accept: text/html,application/xhtml+xml" -w "$F" "$U" || echo "  curl exit $?"
echo "affiliate hop"
curl -sS -I -o /dev/null -m 15 -w "$F" "https://hb.afl.rakuten.co.jp/ichiba/56e37453.8885bd8a.56e37454.e8853422/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbabybjorn%2Fbaby-carrier-harmony%2F&link_type=text" || echo "  curl exit $?"
echo "rakuten top"
curl -sS -I -o /dev/null -m 15 -w "$F" https://www.rakuten.co.jp/ || echo "  curl exit $?"
