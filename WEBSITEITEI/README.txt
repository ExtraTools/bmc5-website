BMC5 SERVER — сайт (статик)

1) Быстрый старт
- Открой assets/js/config.js
- Поставь:
  SERVER_ADDRESS  (IP:порт или домен:порт)
  DISCORD_URL     (ссылка-инвайт)
  YOUTUBE_URL     (канал/плейлист)
  MAP_EMBED_URL   (Dynmap/BlueMap URL, если есть)

2) Статус сервера
Сайт дергает публичный API mcsrvstat.us:
- Java:    https://api.mcsrvstat.us/3/<address>
- Bedrock: https://api.mcsrvstat.us/bedrock/3/<address>

Если браузер ругается на CORS (ошибка типа "No 'Access-Control-Allow-Origin'..."),
самый простой вариант — сделать маленький прокси.

Вариант A — Cloudflare Worker (пример):
------------------------------------------------------------
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const addr = url.searchParams.get("addr");
    if (!addr) return new Response("Missing addr", { status: 400 });

    const target = "https://api.mcsrvstat.us/3/" + encodeURIComponent(addr);
    const res = await fetch(target, {
      headers: { "User-Agent": "BMC5-SITE/1.0 (status-proxy)" }
    });

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
------------------------------------------------------------

Публикуешь воркер, получаешь URL вида:
https://your-worker.example.workers.dev/?addr=

В assets/js/config.js ставишь:
PROXY_BASE: "https://your-worker.example.workers.dev/?addr="

Готово.

3) Карта мира
- Dynmap/BlueMap обычно встраиваются через iframe.
- Лучше проксировать на тот же домен (Nginx/Caddy), чтобы избежать ограничений/кук/смешанного контента.

4) Деплой
Это статический сайт — можно залить на:
- GitHub Pages
- Cloudflare Pages
- любой VPS + Nginx
