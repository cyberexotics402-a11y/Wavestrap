const { ipcRenderer } = require("electron");
let lastId = null, selectedGame = null, selectedReg = "all", presetsDirty = false;
let customCursorPath = "", selectedCursorMode = "default", customFontPath = "", mcFontUrl = "", customFontUrl = "";
const panels = { home: document.getElementById("homePanel"), servers: document.getElementById("serversPanel"), mods: document.getElementById("modsPanel"), flags: document.getElementById("flagsPanel") };
const tabs = { home: document.getElementById("tabHome"), servers: document.getElementById("tabServers"), mods: document.getElementById("tabMods"), flags: document.getElementById("tabFlags") };
function showTab(k) { Object.keys(panels).forEach(x => { if (x === k) { panels[x].classList.remove("hidden"); panels[x].classList.add("tab-enter"); requestAnimationFrame(() => requestAnimationFrame(() => panels[x].classList.remove("tab-enter"))); } else panels[x].classList.add("hidden"); tabs[x].classList.toggle("active", x === k); }); }
const sViews = { search: document.getElementById("srvSearchView"), detail: document.getElementById("srvDetailView"), region: document.getElementById("srvRegionView") };
function showSrvView(v) { Object.keys(sViews).forEach(k => sViews[k].classList.toggle("hidden", k !== v)); }
tabs.home.onclick = () => showTab("home");
tabs.servers.onclick = () => { showTab("servers"); showSrvView("search"); };
document.getElementById("backToSearchBtn").onclick = () => showSrvView("search");
document.getElementById("backToDetailBtn").onclick = () => showSrvView("detail");
document.getElementById("openRegionBtn").onclick = () => { document.getElementById("regGameTitle").textContent = selectedGame.name; document.getElementById("srvList").innerHTML = `<div style="color:#94a3b8;font-size:13px;">Pick a region above and click Find Servers.</div>`; showSrvView("region"); };
document.querySelectorAll("#regPills .reg-btn").forEach(b => { b.onclick = () => { document.querySelectorAll("#regPills .reg-btn").forEach(x => x.classList.remove("active")); b.classList.add("active"); selectedReg = b.dataset.reg; }; });
async function doGameSearch() {
  const q = document.getElementById("gameSearchInput").value.trim(); if (!q) return;
  const grid = document.getElementById("gameSearchResults"); grid.innerHTML = `<div style="color:#93c5fd;font-size:13px;grid-column:1/-1;">Searching Roblox...</div>`;
  const res = await ipcRenderer.invoke("search-games", q);
  if (!res.ok || !res.games.length) { grid.innerHTML = `<div style="color:#f87171;font-size:13px;grid-column:1/-1;">No games found.</div>`; return; }
  grid.innerHTML = res.games.map((g, i) => `<div class="game-card" data-idx="${i}"><img src="${g.icon || ""}" alt="" /><strong style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.name}</strong><span style="font-size:11px;color:#93c5fd;">${Intl.NumberFormat("en", { notation: "compact" }).format(g.playing || 0)} CCU • ${Intl.NumberFormat("en", { notation: "compact" }).format(g.visits || 0)} Visits</span><span style="font-size:10.5px;color:#38bdf8;">ID: ${g.placeId}</span></div>`).join("");
  document.querySelectorAll(".game-card").forEach(card => { card.onclick = async () => { selectedGame = res.games[Number(card.dataset.idx)]; document.getElementById("detIcon").src = selectedGame.icon || ""; document.getElementById("detTitle").textContent = selectedGame.name; document.getElementById("detMeta").textContent = `By ${selectedGame.creator || "Roblox"} • Place ID: ${selectedGame.placeId}`; document.getElementById("detPlaying").textContent = `Active: ${(selectedGame.playing || 0).toLocaleString()}`; document.getElementById("detCreated").textContent = `Released: ${selectedGame.created || "--"}`; document.getElementById("detUpdated").textContent = `Updated: ${selectedGame.updated || "--"}`; document.getElementById("detDesc").textContent = selectedGame.description || "Loading..."; showSrvView("detail"); }; });
}
document.querySelectorAll(".chip-btn").forEach(c => { c.onclick = () => { document.getElementById("gameSearchInput").value = c.dataset.q; doGameSearch(); }; });
document.getElementById("gameSearchBtn").onclick = doGameSearch;
document.getElementById("gameSearchInput").onkeydown = e => { if (e.key === "Enter") doGameSearch(); };
document.getElementById("runFindSrvBtn").onclick = async () => {
  if (!selectedGame) return;
  const list = document.getElementById("srvList"); list.innerHTML = `<div style="color:#93c5fd;font-size:13px;">Loading live servers...</div>`;
  const res = await ipcRenderer.invoke("fetch-servers", selectedGame.placeId);
  if (!res.ok || !res.servers.length) { list.innerHTML = `<div style="color:#f87171;font-size:13px;">No public servers found.</div>`; return; }
  const filtered = res.servers.filter(s => selectedReg === "all" || (selectedReg === "na" && s.ping < 85) || (selectedReg === "eu" && s.ping >= 85 && s.ping <= 150) || (selectedReg === "as" && s.ping > 150));
  const shown = filtered.length ? filtered : res.servers;
  list.innerHTML = shown.map(s => `<div class="srv-item"><div><strong style="font-size:13.5px;">${s.label}</strong> <span style="color:#93c5fd;font-size:12px;margin-left:8px;">${s.playing}/${s.maxPlayers} Players</span><div style="font-size:11.5px;color:#94a3b8;margin-top:2px;">Ping: ${s.ping} ms • Server FPS: ${s.fps}</div></div><button class="btn-primary join-srv-btn" data-job="${s.id}" style="padding:7px 15px;font-size:12px;">Join</button></div>`).join("");
  document.querySelectorAll(".join-srv-btn").forEach(btn => { btn.onclick = () => ipcRenderer.invoke("join-server", { placeId: selectedGame.placeId, jobId: btn.dataset.job }); });
};
function setCursorCard(mode) { selectedCursorMode = mode; document.querySelectorAll("#cursorGrid .cursor-card").forEach(c => c.classList.toggle("active", c.dataset.mode === mode)); }
document.querySelectorAll("#cursorGrid .cursor-card").forEach(c => { c.onclick = () => { if (c.dataset.mode === "custom" && !customCursorPath) document.getElementById("pickCursorBtn").click(); else setCursorCard(c.dataset.mode); }; });
function applyFontPreview(mode) {
  const box = document.getElementById("fontPreviewText");
  const st = document.getElementById("dynamicFontStyle") || Object.assign(document.head.appendChild(document.createElement("style")), { id: "dynamicFontStyle" });
  if (mode === "minecraft" && mcFontUrl) { st.textContent = `@font-face { font-family: "WaveMC"; src: url("${mcFontUrl}"); }`; box.style.fontFamily = '"WaveMC", monospace'; box.style.fontSize = "13px"; }
  else if (mode === "minecraft") box.style.fontFamily = "ui-monospace, Menlo, monospace";
  else if (mode === "custom" && customFontUrl) { st.textContent = `@font-face { font-family: "WaveCustom"; src: url("${customFontUrl}"); }`; box.style.fontFamily = '"WaveCustom", sans-serif'; }
  else if (mode === "impact") box.style.fontFamily = "Impact, sans-serif";
  else if (mode === "trebuchet") box.style.fontFamily = '"Trebuchet MS", sans-serif';
  else if (mode === "comic") box.style.fontFamily = '"Comic Sans MS", cursive';
  else if (mode === "mono") box.style.fontFamily = '"Courier New", monospace';
  else if (mode === "serif") box.style.fontFamily = "Georgia, serif";
  else box.style.fontFamily = "-apple-system, BlinkMacSystemFont, sans-serif";
}
document.getElementById("modFont").onchange = e => applyFontPreview(e.target.value);
tabs.mods.onclick = async () => { showTab("mods"); const m = await ipcRenderer.invoke("get-mods"); document.getElementById("modOof").checked = !!m.oofSound; customCursorPath = m.customCursorPath || ""; customFontPath = m.customFontPath || ""; mcFontUrl = m.previews?.mcFont || ""; customFontUrl = m.previews?.customFont || ""; if (m.previews?.c2006) document.getElementById("prev2006").src = m.previews.c2006; if (m.previews?.c2015) document.getElementById("prev2015").src = m.previews.c2015; if (m.previews?.custom) { document.getElementById("prevCustom").src = m.previews.custom; document.getElementById("prevCustom").style.display = "block"; document.getElementById("prevCustomEmpty").style.display = "none"; } setCursorCard(m.cursorMode || "default"); const fm = m.fontMode || "default"; document.getElementById("modFont").value = fm; if (customFontPath) document.getElementById("fontStatus").textContent = "Custom font loaded"; applyFontPreview(fm); };
document.getElementById("pickFontBtn").onclick = async () => { const p = await ipcRenderer.invoke("pick-font"); if (p) { customFontPath = p; document.getElementById("modFont").value = "custom"; document.getElementById("fontStatus").textContent = "Custom font loaded"; customFontUrl = "file://" + p; applyFontPreview("custom"); } };
document.getElementById("pickCursorBtn").onclick = async () => { const p = await ipcRenderer.invoke("pick-cursor"); if (p) { customCursorPath = p; document.getElementById("prevCustom").src = "file://" + p + "?t=" + Date.now(); document.getElementById("prevCustom").style.display = "block"; document.getElementById("prevCustomEmpty").style.display = "none"; setCursorCard("custom"); } };
document.getElementById("openModsBtn").onclick = () => ipcRenderer.invoke("open-mods-folder");
document.getElementById("saveModsBtn").onclick = async () => { await ipcRenderer.invoke("save-mods", { oofSound: document.getElementById("modOof").checked, cursorMode: selectedCursorMode, customCursorPath, fontMode: document.getElementById("modFont").value, customFontPath }); const b = document.getElementById("saveModsBtn"); b.textContent = "Saved"; setTimeout(() => b.textContent = "Save Mods", 1500); };
tabs.flags.onclick = async () => { showTab("flags"); const f = await ipcRenderer.invoke("get-flags"); document.getElementById("flagFps").value = f.fps; document.getElementById("flagMetal").checked = f.metal; document.getElementById("flagShadows").checked = f.noShadows; document.getElementById("flagGrass").checked = f.noGrass; document.getElementById("flagLow").checked = f.lowRender; document.getElementById("rawJson").value = f.raw; presetsDirty = false; };
["flagFps", "flagMetal", "flagShadows", "flagGrass", "flagLow"].forEach(id => { document.getElementById(id).onchange = () => { presetsDirty = true; }; });
document.getElementById("rawJson").oninput = () => { presetsDirty = false; };
document.getElementById("importBtn").onclick = () => document.getElementById("jsonFile").click();
document.getElementById("jsonFile").onchange = e => { const file = e.target.files.at(0); if (!file) return; const r = new FileReader(); r.onload = ev => { document.getElementById("rawJson").value = ev.target.result; presetsDirty = false; }; r.readAsText(file); };
document.getElementById("saveFlagsBtn").onclick = async () => { const res = await ipcRenderer.invoke("save-flags", { applyPresets: presetsDirty, rawJson: document.getElementById("rawJson").value, fps: document.getElementById("flagFps").value, metal: document.getElementById("flagMetal").checked, noShadows: document.getElementById("flagShadows").checked, noGrass: document.getElementById("flagGrass").checked, lowRender: document.getElementById("flagLow").checked }); const btn = document.getElementById("saveFlagsBtn"); if (res.ok) { document.getElementById("rawJson").value = res.raw; presetsDirty = false; btn.textContent = `Saved (${res.count} flags)`; update(); } else btn.textContent = "Invalid JSON"; setTimeout(() => btn.textContent = "Apply & Stage", 1800); };
async function update() { const d = await ipcRenderer.invoke("get-stats"); document.getElementById("username").textContent = d.username; document.getElementById("ping").textContent = d.ping; if (d.serverCity) document.getElementById("serverCity").textContent = d.serverCity; document.getElementById("fps").textContent = d.fps; if (d.mosaicIcons?.length) document.querySelectorAll("#mosaicGrid .tile").forEach((t, i) => { const u = d.mosaicIcons.at(i % d.mosaicIcons.length); if (u) t.style.backgroundImage = `url("${u}")`; }); if (d.lastGame) { lastId = d.lastGame.placeId; document.getElementById("lastGameTitle").textContent = d.lastGame.name; document.getElementById("lastGameId").textContent = "Place ID: " + d.lastGame.placeId; if (d.lastGame.icon) document.getElementById("lastGameIcon").src = d.lastGame.icon; document.getElementById("lastGameCard").classList.remove("hidden"); } }
async function triggerLaunch(id) { document.getElementById("statusHead").textContent = "Injecting Mods..."; const msg = await ipcRenderer.invoke("launch-roblox", id); document.getElementById("statusHead").textContent = msg; setTimeout(() => document.getElementById("statusHead").textContent = "Wavestrap Ready", 3000); }
document.getElementById("launchBtn").onclick = () => triggerLaunch(null); document.getElementById("rejoinBtn").onclick = () => lastId && triggerLaunch(lastId); document.getElementById("refreshBtn").onclick = update; update(); setInterval(update, 5000);
