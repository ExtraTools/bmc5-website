// BMC5 SERVER — конфиг сайта
// Поменяй значения под себя и просто перезалей сайт.

window.BMC5_CONFIG = {
  // IP / домен сервера. Можно с портом: "play.example.com:25565"
  SERVER_ADDRESS: "faq-sodium.gl.joinmc.link:25565",

  // Если у тебя Bedrock — поставь true (и укажи порт Bedrock).
  BEDROCK: false,

  // Если API блокируется CORS-ом — укажи сюда URL прокси (см. README.txt)
  // Пример: "https://your-proxy.example.com/status?addr="
  // Тогда запрос будет: PROXY_BASE + encodeURIComponent(SERVER_ADDRESS)
  PROXY_BASE: "",

  // Встроенная карта (Dynmap/BlueMap) — вставь URL, если есть.
  // Можно и прямую ссылку на dynmap/bluemap. В идеале — через тот же домен (реверс‑прокси).
  MAP_EMBED_URL: "",

  // Ссылки на комьюнити
  DISCORD_URL: "https://discord.gg/yourinvite",
  YOUTUBE_URL: "https://youtube.com/@yourchannel"
};

