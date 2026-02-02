(() => {
  const cfg = window.BMC5_CONFIG || {};
  const $ = (id) => document.getElementById(id);

  const serverIpText = $("serverIpText");
  const copyIpBtn = $("copyIpBtn");
  const refreshBtn = $("refreshBtn");

  const statusPill = $("statusPill");
  const statusMeta = $("statusMeta");
  const playersText = $("playersText");
  const versionText = $("versionText");
  const motdText = $("motdText");
  const lastUpdate = $("lastUpdate");

  const miniStatus = $("miniStatus");
  const miniPlayers = $("miniPlayers");
  const miniVersion = $("miniVersion");

  const discordBtn = $("discordBtn");
  const youtubeBtn = $("youtubeBtn");
  const discordLink = $("discordLink");
  const youtubeLink = $("youtubeLink");

  const navToggle = $("navToggle");
  const navMobile = $("navMobile");

  const mapEmbed = $("mapEmbed");

  // --- init UI ---
  const addr = (cfg.SERVER_ADDRESS || "play.example.com:25565").trim();
  serverIpText.textContent = addr;

  const setLink = (el, url) => {
    if (!el) return;
    el.href = url || "#";
    if (!url) el.setAttribute("aria-disabled", "true");
  };
  setLink(discordBtn, cfg.DISCORD_URL);
  setLink(youtubeBtn, cfg.YOUTUBE_URL);
  setLink(discordLink, cfg.DISCORD_URL);
  setLink(youtubeLink, cfg.YOUTUBE_URL);

  $("year").textContent = String(new Date().getFullYear());

  // Mobile nav
  const closeMobileNav = () => {
    navMobile.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
  };
  navToggle?.addEventListener("click", () => {
    const isOpen = !navMobile.hidden;
    navMobile.hidden = isOpen;
    navToggle.setAttribute("aria-expanded", String(!isOpen));
  });
  navMobile?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobileNav));

  // Map embed
  const mapUrl = (cfg.MAP_EMBED_URL || "").trim();
  if (mapUrl) {
    mapEmbed.innerHTML = `<iframe src="${escapeAttr(mapUrl)}" loading="lazy" referrerpolicy="no-referrer"></iframe>`;
  }

  // Copy IP
  copyIpBtn?.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(addr);
      toast(copyIpBtn, "Скопировано!");
    }catch(e){
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = addr;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast(copyIpBtn, "Скопировано!");
    }
  });

  refreshBtn?.addEventListener("click", () => refreshStatus(true));

  // --- status ---
  const API_BASE_JAVA = "https://api.mcsrvstat.us/3/";
  const API_BASE_BEDROCK = "https://api.mcsrvstat.us/bedrock/3/";

  async function fetchStatus() {
    const useProxy = (cfg.PROXY_BASE || "").trim();
    if (useProxy) {
      const r = await fetch(useProxy + encodeURIComponent(addr), { cache: "no-store" });
      if (!r.ok) throw new Error("Proxy HTTP " + r.status);
      return await r.json();
    }

    const base = cfg.BEDROCK ? API_BASE_BEDROCK : API_BASE_JAVA;
    const r = await fetch(base + encodeURIComponent(addr), { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  }

  function parseMotd(data) {
    // mcsrvstat.us может возвращать motd.clean как массив строк
    if (data?.motd?.clean) {
      if (Array.isArray(data.motd.clean)) return data.motd.clean.join(" / ");
      return String(data.motd.clean);
    }
    if (data?.motd?.raw) {
      if (Array.isArray(data.motd.raw)) return data.motd.raw.join(" / ");
      return String(data.motd.raw);
    }
    return "—";
  }

  function setOnlineUI(data) {
    statusPill.textContent = "ONLINE";
    statusPill.className = "pill pill--big pill--ok";
    miniStatus.textContent = "ONLINE";
    miniStatus.className = "pill pill--ok";

    const online = data?.players?.online ?? "—";
    const max = data?.players?.max ?? "—";
    playersText.textContent = `${online} / ${max}`;
    miniPlayers.textContent = `${online}/${max}`;

    const v = data?.version || data?.protocol?.name || "—";
    versionText.textContent = String(v);
    miniVersion.textContent = String(v);

    const motd = parseMotd(data);
    motdText.textContent = motd;

    const ip = data?.ip ? `${data.ip}:${data.port ?? ""}` : "";
    statusMeta.textContent = ip ? `IP: ${ip}` : "IP: —";
  }

  function setOfflineUI(reason) {
    statusPill.textContent = "OFFLINE";
    statusPill.className = "pill pill--big pill--bad";
    statusMeta.textContent = reason ? `Причина: ${reason}` : "Сервер недоступен";

    miniStatus.textContent = "OFFLINE";
    miniStatus.className = "pill pill--bad";

    playersText.textContent = "—";
    versionText.textContent = "—";
    motdText.textContent = "—";
    miniPlayers.textContent = "—";
    miniVersion.textContent = "—";
  }

  function setLoadingUI() {
    statusPill.textContent = "Проверяю…";
    statusPill.className = "pill pill--big pill--warn";
    statusMeta.textContent = "Запрос к API статуса…";

    miniStatus.textContent = "…";
    miniStatus.className = "pill pill--warn";
    miniPlayers.textContent = "…";
    miniVersion.textContent = "…";
  }

  let timer = null;

  async function refreshStatus(showToast) {
    setLoadingUI();
    try{
      const data = await fetchStatus();
      if (data?.online) setOnlineUI(data);
      else setOfflineUI("сервер оффлайн");
      lastUpdate.textContent = new Date().toLocaleString();
      if (showToast) toast(refreshBtn, "Обновлено");
    }catch(e){
      setOfflineUI(e?.message || "ошибка запроса");
      lastUpdate.textContent = new Date().toLocaleString();
      if (showToast) toast(refreshBtn, "Ошибка");
      // Also log for debugging
      console.warn("Status fetch failed:", e);
    }
  }

  // initial + auto refresh
  refreshStatus(false);
  timer = setInterval(() => refreshStatus(false), 60_000);

  // --- helpers ---
  function toast(anchorEl, text) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    document.body.appendChild(t);

    const rect = anchorEl?.getBoundingClientRect?.();
    if (rect) {
      t.style.left = Math.max(12, Math.min(window.innerWidth - 12, rect.left + rect.width/2)) + "px";
      t.style.top = Math.max(12, rect.top - 12) + "px";
      t.style.transform = "translate(-50%, -100%)";
    }
    requestAnimationFrame(() => t.classList.add("toast--in"));
    setTimeout(() => {
      t.classList.remove("toast--in");
      setTimeout(() => t.remove(), 220);
    }, 1100);
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
})();

/* toast styles injected (small, keep CSS file clean-ish) */
(function injectToastCSS(){
  const css = `
  .toast{
    position:fixed;
    z-index:9999;
    padding:10px 12px;
    border-radius: 12px;
    border:1px solid rgba(255,255,255,.12);
    background: rgba(0,0,0,.55);
    backdrop-filter: blur(10px);
    color: rgba(232,240,247,.96);
    font-weight:900;
    font-size:12px;
    opacity:0;
    pointer-events:none;
    transition: opacity .18s ease, transform .18s ease;
    box-shadow: 0 12px 30px rgba(0,0,0,.35);
  }
  .toast--in{opacity:1; transform: translate(-50%, -110%)}
  `;
  const s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
})();
