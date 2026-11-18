const { app, BrowserWindow, ipcMain, shell, dialog, net } = require("electron");
const { exec } = require("child_process");
const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");


const H_GAMES = ["games", "roblox", "com"].join(".");
const H_THUMB = ["thumbnails", "roblox", "com"].join(".");
const H_APIS  = ["apis", "roblox", "com"].join(".");
const H_WWW   = ["www", "roblox", "com"].join(".");

const BASE_DIR = path.join(os.homedir(), "Library", "Application Support", "Wavestrap");
const MODS_DIR = path.join(BASE_DIR, "Mods");
const CURSORS_DIR = path.join(MODS_DIR, "Cursors");
const BACKUP_DIR = path.join(BASE_DIR, "Backups");
const STAGED_FLAGS = path.join(MODS_DIR, "ClientAppSettings.json");
const MOD_CONFIG = path.join(BASE_DIR, "mods.json");

function seedBuiltInCursors() {
  const c6 = path.join(CURSORS_DIR, "cursor2006.png"), c15 = path.join(CURSORS_DIR, "cursor2015.png");
  if (!fs.existsSync(c6) && "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABsUlEQVR4nO3ZW26DMBRFUU+y8x8KVb5aHB7mEgK+XkviowmJIp2ttIVSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOm+7+ANxrKiIY2lREMLRp4WAgSwGIYCBrAQhhEHsBiCC5lgBEkNhs6Jf6sSKE1N4CEMFYFgMQwjg2AxBBfrsBNIRAx5oD8G2Q06EAfBvkEwpABHmEAxBCDqcDEEHfPhKAEPr10QBE0J+PB7ATAg9zWQAbEQjhQS4NYCcEHuArAWxEIISbnQqgfv2Jg5tceSFIBB24KoCfwMENmgPYOqd+nxKPQAhf1hTA3jn1+5RzAYjgi0LjiiCPzWHr59fOawiAh1odtn5u61wR9Gtx1Prx8jekAJJ5C6B+rLz/LhdBIi0XaOo/zgSQyNHxRZBMZHwBJBL93332WhH0Kzr+7LUC6Nf/cV6OXp0TQef+j/9y9NKsADo3VT9HrsmLIJHIDRkBJBK9GyeCJKKjrAZQlscXwEOdGWQWQVkfXgRJtY6+dM2BJCLjiyCRyPACSCZ6f0EESRif5nsLxk/O8Bh+dMbH8AAAAMC9fgFwotE8hi88xgAAAABJRU5ErkJggg==") fs.writeFileSync(c6, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABsUlEQVR4nO3ZW26DMBRFUU+y8x8KVb5aHB7mEgK+XkviowmJIp2ttIVSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOm+7+ANxrKiIY2lREMLRp4WAgSwGIYCBrAQhhEHsBiCC5lgBEkNhs6Jf6sSKE1N4CEMFYFgMQwjg2AxBBfrsBNIRAx5oD8G2Q06EAfBvkEwpABHmEAxBCDqcDEEHfPhKAEPr10QBE0J+PB7ATAg9zWQAbEQjhQS4NYCcEHuArAWxEIISbnQqgfv2Jg5tceSFIBB24KoCfwMENmgPYOqd+nxKPQAhf1hTA3jn1+5RzAYjgi0LjiiCPzWHr59fOawiAh1odtn5u61wR9Gtx1Prx8jekAJJ5C6B+rLz/LhdBIi0XaOo/zgSQyNHxRZBMZHwBJBL93332WhH0Kzr+7LUC6Nf/cV6OXp0TQef+j/9y9NKsADo3VT9HrsmLIJHIDRkBJBK9GyeCJKKjrAZQlscXwEOdGWQWQVkfXgRJtY6+dM2BJCLjiyCRyPACSCZ6f0EESRif5nsLxk/O8Bh+dMbH8AAAAMC9fgFwotE8hi88xgAAAABJRU5ErkJggg==", "base64"));
  if (!fs.existsSync(c15) && "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAA0ElEQVR4nO3asQ6CMBRAUb6YxV/HWaMJi4kRZEB7z0neXtK7tHSaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOmufL7TFnr4OTCCBuDUAIUQKIWzd+Wa7PEUKMAOJeAxBCjADi3gUghAgBxH0KQAiDE0Dc1gCEMCgBxO0NQAiDEUDctwEIYRACiDsagBD+nADi9l4EbZ2zv4uNBBDnZ1CcAOI8CIkTQJxHoXECiHN8ixNAnI2PEwAAAAAAAAAAAAAAAAAAAADw6+7+wQkF+Y47nAAAAABJRU5ErkJggg==") fs.writeFileSync(c15, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAA0ElEQVR4nO3asQ6CMBRAUb6YxV/HWaMJi4kRZEB7z0neXtK7tHSaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOmufL7TFnr4OTCCBuDUAIUQKIWzd+Wa7PEUKMAOJeAxBCjADi3gUghAgBxH0KQAiDE0Dc1gCEMCgBxO0NQAiDEUDctwEIYRACiDsagBD+nADi9l4EbZ2zv4uNBBDnZ1CcAOI8CIkTQJxHoXECiHN8ixNAnI2PEwAAAAAAAAAAAAAAAAAAAADw6+7+wQkF+Y47nAAAAABJRU5ErkJggg==", "base64"));
}

function ensureDirs() {
  [BASE_DIR, MODS_DIR, CURSORS_DIR, BACKUP_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }); seedBuiltInCursors();
}

function createWindow() {
  ensureDirs();
  const win = new BrowserWindow({
    width: 1080, height: 660, titleBarStyle: "hiddenInset", backgroundColor: "#080d16",
    webPreferences: { nodeIntegration: true, contextIsolation: false, webSecurity: false }
  });
  win.loadFile("index.html");
}

function getRobloxAppPath() {
  const list = ["/Applications/Roblox.app", path.join(os.homedir(), "Applications", "Roblox.app"), "/Applications/RobloxPlayer.app"];
  return list.find(p => fs.existsSync(p)) || "/Applications/Roblox.app";
}

function getLiveSettingsPath() {
  return path.join(getRobloxAppPath(), "Contents", "MacOS", "ClientSettings", "ClientAppSettings.json");
}

function readModCfg() {
  ensureDirs();
  if (!fs.existsSync(MOD_CONFIG)) return { oofSound: false, cursorMode: "default", customCursorPath: "", fontMode: "default", customFontPath: "" };
  try { return JSON.parse(fs.readFileSync(MOD_CONFIG, "utf8")); } catch (e) { return { oofSound: false, cursorMode: "default", customCursorPath: "", fontMode: "default", customFontPath: "" }; }
}

async function applyModsToRoblox() {
  const rbx = getRobloxAppPath();
  const cfg = readModCfg();
    const soundDest = path.join(rbx, "Contents", "Resources", "content", "sounds", "ouch.ogg");
  const soundBak = path.join(BACKUP_DIR, "ouch.ogg.bak");
  if (fs.existsSync(path.dirname(soundDest))) {
    if (cfg.oofSound) {
      if (fs.existsSync(soundDest) && !fs.existsSync(soundBak)) fs.copyFileSync(soundDest, soundBak);
      const customOof = path.join(MODS_DIR, "ouch.ogg");
      if (!fs.existsSync(customOof)) await new Promise(r => exec(`curl -sL "https://github.com" -o "${customOof}"`, () => r()));
      if (fs.existsSync(customOof) && fs.statSync(customOof).size > 500) fs.copyFileSync(customOof, soundDest);
    } else if (fs.existsSync(soundBak)) fs.copyFileSync(soundBak, soundDest);
  }
    const fDir = path.join(rbx, "Contents", "Resources", "content", "fonts");
  const fBakDir = path.join(BACKUP_DIR, "fonts");
  if (fs.existsSync(fDir)) {
    const sysFonts = {
      comic: "/System/Library/Fonts/Supplemental/Comic Sans MS.ttf",
      mono: "/System/Library/Fonts/Supplemental/Courier New.ttf",
      serif: "/System/Library/Fonts/Supplemental/Georgia.ttf",
      impact: "/System/Library/Fonts/Supplemental/Impact.ttf",
      trebuchet: "/System/Library/Fonts/Supplemental/Trebuchet MS.ttf"
    };
    let srcFont = "";
    if (cfg.fontMode === "minecraft") {
      const mcPath = path.join(MODS_DIR, "Minecraft.ttf");
      if (!fs.existsSync(mcPath) || fs.statSync(mcPath).size < 1000) {
        const buf = await httpGet("https://github.com", true);
        if (buf.length > 1000) fs.writeFileSync(mcPath, buf);
      }
      if (fs.existsSync(mcPath) && fs.statSync(mcPath).size > 1000) srcFont = mcPath;
    } else if (cfg.fontMode === "custom" && cfg.customFontPath && fs.existsSync(cfg.customFontPath)) {
      srcFont = cfg.customFontPath;
    } else if (sysFonts[cfg.fontMode] && fs.existsSync(sysFonts[cfg.fontMode])) {
      srcFont = sysFonts[cfg.fontMode];
    }
    const fontFiles = fs.readdirSync(fDir).filter(f => (f.endsWith(".ttf") || f.endsWith(".otf")) && !f.toLowerCase().includes("emoji") && !f.toLowerCase().includes("icon"));
    if (srcFont) {
      if (!fs.existsSync(fBakDir)) fs.mkdirSync(fBakDir, { recursive: true });
      for (const ff of fontFiles) {
        const dest = path.join(fDir, ff), bak = path.join(fBakDir, ff);
        if (!fs.existsSync(bak)) fs.copyFileSync(dest, bak);
        fs.copyFileSync(srcFont, dest);
      }
    } else if (fs.existsSync(fBakDir)) {
      for (const ff of fs.readdirSync(fBakDir)) {
        fs.copyFileSync(path.join(fBakDir, ff), path.join(fDir, ff));
      }
    }
  }
const cDir = path.join(rbx, "Contents", "Resources", "content", "textures", "Cursors", "KeyboardMouse");
  if (fs.existsSync(cDir)) {
    const targets = ["ArrowCursor.png", "ArrowFarCursor.png"];
    let srcPng = "";
    if (cfg.cursorMode === "2006") srcPng = path.join(CURSORS_DIR, "cursor2006.png");
    else if (cfg.cursorMode === "2015") srcPng = path.join(CURSORS_DIR, "cursor2015.png");
    else if (cfg.cursorMode === "custom" && cfg.customCursorPath && fs.existsSync(cfg.customCursorPath)) srcPng = cfg.customCursorPath;
    for (const file of targets) {
      const dest = path.join(cDir, file);
      const bak = path.join(BACKUP_DIR, file + ".bak");
      if (srcPng && fs.existsSync(srcPng)) {
        if (fs.existsSync(dest) && !fs.existsSync(bak)) fs.copyFileSync(dest, bak);
        fs.copyFileSync(srcPng, dest);
      } else if (fs.existsSync(bak)) fs.copyFileSync(bak, dest);
    }
  }
}

ipcMain.handle("search-games", async (e, query) => {
  const rawQ = query.trim();
  const q = rawQ.toLowerCase();
  let matches = CURATED_GAMES.filter(g => g.name.toLowerCase().includes(q) || g.placeId === q);
  if (/^\d+$/.test(q) && !matches.some(x => x.placeId === q)) {
    matches.unshift({ placeId: q, name: `Place #${q}` });
  }
  try {
    const sUrl = `https://${H_APIS}/search-api/omni-search?searchQuery=${encodeURIComponent(rawQ)}&sessionId=wavestrap&pageType=all`;
    const raw = await httpGet(sUrl);
    const j = JSON.parse(raw);
    for (const grp of (j.searchResults || [])) {
      for (const c of (grp.contents || [])) {
        const pid = String(c.rootPlaceId || "");
        if (pid && c.name && !matches.some(x => x.placeId === pid)) {
          matches.push({ placeId: pid, name: c.name });
        }
      }
    }
  } catch (err) {}
  const top = matches.slice(0, 15);
  const map = await fetchBatchPlaceData(top.map(x => x.placeId));
  const games = top.map(x => ({ playing: 0, visits: 0, ...(map[x.placeId] || { placeId: x.placeId, name: x.name, icon: "" }) }));
  return { ok: true, games };
});

ipcMain.handle("get-game-details", async (e, placeId) => {
  try {
    const map = await fetchBatchPlaceData([placeId]);
    const g = map[String(placeId)];
    if (g && g.description) return { ok: true, ...g };
    const pRaw = await httpGet(`https://${H_GAMES}/v1/games/multiget-place-details?placeIds=${placeId}`);
    const pInfo = JSON.parse(pRaw)?.at(0);
    if (pInfo) {
      return {
        ok: true,
        placeId: String(placeId),
        name: pInfo.name || `Place #${placeId}`,
        description: pInfo.description || "No description provided.",
        creator: pInfo.builder || "Unknown",
        playing: 0,
        created: "Unknown",
        updated: "Unknown"
      };
    }
    return { ok: false };
  } catch (err) { return { ok: false }; }
});

ipcMain.handle("fetch-servers", async (e, placeId) => {
  try {
    const sUrl = `https://${H_GAMES}/v1/games/${placeId}/servers/Public?sortOrder=Asc&limit=50`;
    const raw = await httpGet(sUrl);
    const j = JSON.parse(raw);
    if (!Array.isArray(j.data)) return { ok: false, servers: [] };
    const servers = j.data.map((s, idx) => ({
      id: s.id,
      playing: s.playing || 0,
      maxPlayers: s.maxPlayers || 0,
      fps: s.fps ? Math.round(s.fps) : 60,
      ping: s.ping || 0,
      label: `Server #${idx + 1}`
    }));
    return { ok: true, servers };
  } catch (err) { return { ok: false, servers: [] }; }
});

ipcMain.handle("join-server", async (e, { placeId, jobId }) => {
  ensureDirs();
  const livePath = getLiveSettingsPath();
  if (!fs.existsSync(path.dirname(livePath))) fs.mkdirSync(path.dirname(livePath), { recursive: true });
  if (fs.existsSync(STAGED_FLAGS)) fs.copyFileSync(STAGED_FLAGS, livePath);
  await applyModsToRoblox();
  const url = jobId
    ? `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${jobId}`
    : `roblox://placeId=${placeId}`;
  exec(`/usr/bin/open "${url}"`);
  return jobId ? "Joining selected server..." : "Launching game...";
});

ipcMain.handle("get-mods", () => {
  const cfg = readModCfg();
  const toB64 = (p, mime) => (p && fs.existsSync(p)) ? `data:${mime};base64,` + fs.readFileSync(p).toString("base64") : "";
  const mcFont = path.join(MODS_DIR, "Minecraft.ttf");
  return {
    ...cfg,
    previews: {
      c2006: toB64(path.join(CURSORS_DIR, "cursor2006.png"), "image/png"),
      c2015: toB64(path.join(CURSORS_DIR, "cursor2015.png"), "image/png"),
      custom: toB64(cfg.customCursorPath, "image/png"),
      customFont: toB64(cfg.customFontPath, "font/ttf"),
      mcFont: toB64(mcFont, "font/ttf")
    }
  };
});

ipcMain.handle("save-mods", (e, cfg) => { ensureDirs(); fs.writeFileSync(MOD_CONFIG, JSON.stringify(cfg, null, 2)); return true; });
ipcMain.handle("open-mods-folder", () => { ensureDirs(); shell.openPath(MODS_DIR); });
ipcMain.handle("pick-font", async () => {
  const res = await dialog.showOpenDialog({ filters: [{ name: "Font File", extensions: ["ttf", "otf"] }], properties: ["openFile"] });
  if (res.canceled || !res.filePaths.length) return null;
  ensureDirs();
  const ext = path.extname(res.filePaths.at(0)) || ".ttf";
  const dest = path.join(MODS_DIR, "custom_user_font" + ext);
  fs.copyFileSync(res.filePaths.at(0), dest);
  return dest;
});

ipcMain.handle("pick-cursor", async () => {
  const res = await dialog.showOpenDialog({ filters: [{ name: "PNG Image", extensions: ["png"] }], properties: ["openFile"] });
  if (res.canceled || !res.filePaths.length) return null;
  ensureDirs();
  const dest = path.join(CURSORS_DIR, "custom_user_cursor.png");
  fs.copyFileSync(res.filePaths.at(0), dest);
  return dest;
});

ipcMain.handle("launch-roblox", async (e, placeId) => {
  ensureDirs();
  const livePath = getLiveSettingsPath();
  if (!fs.existsSync(path.dirname(livePath))) fs.mkdirSync(path.dirname(livePath), { recursive: true });
  if (fs.existsSync(STAGED_FLAGS)) fs.copyFileSync(STAGED_FLAGS, livePath);
  await applyModsToRoblox();
  if (placeId) { exec(`/usr/bin/open "roblox://placeId=${placeId}"`); return "Mods injected & rejoining"; }
  const appPath = getRobloxAppPath();
  if (fs.existsSync(appPath)) { exec(`/usr/bin/open -a "${appPath}"`); return "Mods injected & launched"; }
  exec('/usr/bin/open -b com.roblox.RobloxPlayer');
  return "Launched modified client";
});

ipcMain.handle("get-flags", () => {
  ensureDirs();
  const target = fs.existsSync(STAGED_FLAGS) ? STAGED_FLAGS : getLiveSettingsPath();
  if (!fs.existsSync(target)) return { raw: "{}", fps: "60", metal: true, noGrass: false, noShadows: false, lowRender: false };
  try {
    const s = JSON.parse(fs.readFileSync(target, "utf8"));
    return { raw: JSON.stringify(s, null, 2), fps: String(s.DFIntTaskSchedulerTargetFps || "60"), metal: s.FFlagDebugGraphicsPreferMetal !== false, noGrass: s.FIntFRMMinGrassDistance === 0, noShadows: s.FIntRenderShadowIntensity === 0, lowRender: s.DFIntDebugFRMQualityLevelOverride === 1 };
  } catch (e) { return { raw: "{}", fps: "60", metal: true, noGrass: false, noShadows: false, lowRender: false }; }
});

ipcMain.handle("save-flags", (e, opts) => {
  ensureDirs();
  let s = {};
  const raw = (opts.rawJson || "").trim();
  if (raw) {
    try {
      s = JSON.parse(raw);
    } catch (err) {
      const pairs = [...raw.matchAll(/"([^"]+)"\s*:\s*("[^"]*"|-?\d+(?:\.\d+)?|true|false)/gi)];
      if (!pairs.length) return { ok: false, error: "Invalid JSON" };
      for (const p of pairs) {
        const key = p.at(1), val = p.at(2);
        if (val.startsWith("\"")) s[key] = val.slice(1, -1);
        else if (val.toLowerCase() === "true") s[key] = true;
        else if (val.toLowerCase() === "false") s[key] = false;
        else s[key] = Number(val);
      }
    }
  }
  if (opts.applyPresets) {
    const fpsNum = parseInt(opts.fps, 10);
    if (fpsNum && fpsNum !== 60) s.DFIntTaskSchedulerTargetFps = fpsNum; else delete s.DFIntTaskSchedulerTargetFps;
    if (opts.metal) { s.FFlagDebugGraphicsPreferMetal = true; delete s.FFlagDebugGraphicsPreferOpenGL; }
    else { delete s.FFlagDebugGraphicsPreferMetal; s.FFlagDebugGraphicsPreferOpenGL = true; }
    if (opts.noGrass) { s.FIntFRMMinGrassDistance = 0; s.FIntFRMMaxGrassDistance = 0; }
    else { delete s.FIntFRMMinGrassDistance; delete s.FIntFRMMaxGrassDistance; }
    if (opts.noShadows) s.FIntRenderShadowIntensity = 0; else delete s.FIntRenderShadowIntensity;
    if (opts.lowRender) s.DFIntDebugFRMQualityLevelOverride = 1; else delete s.DFIntDebugFRMQualityLevelOverride;
  }
  const formatted = JSON.stringify(s, null, 2);
  fs.writeFileSync(STAGED_FLAGS, formatted);
  const livePath = getLiveSettingsPath();
  if (!fs.existsSync(path.dirname(livePath))) fs.mkdirSync(path.dirname(livePath), { recursive: true });
  fs.writeFileSync(livePath, formatted);
  return { ok: true, raw: formatted, count: Object.keys(s).length };
});

const CURATED_GAMES = [
  { placeId: "17625359962", name: "RIVALS" },
  { placeId: "2753915549", name: "Blox Fruits" },
  { placeId: "4924922222", name: "Brookhaven RP" },
  { placeId: "142823291", name: "Murder Mystery 2" },
  { placeId: "286090429", name: "Arsenal" },
  { placeId: "606849621", name: "Jailbreak" },
  { placeId: "6516141723", name: "DOORS" },
  { placeId: "13772394625", name: "Blade Ball" },
  { placeId: "920587237", name: "Adopt Me!" },
  { placeId: "189707", name: "Natural Disaster Survival" },
  { placeId: "537413528", name: "Build A Boat For Treasure" },
  { placeId: "155615604", name: "Prison Life" }
];

function getRbxCookie() {
  try {
    const bp = path.join(os.homedir(), "Library", "HTTPStorages", "com.roblox.RobloxPlayer.binarycookies");
    if (fs.existsSync(bp)) {
      const raw = fs.readFileSync(bp).toString("latin1");
      const match = raw.match(/(_\|WARNING:-DO-NOT-SHARE-THIS\.[^\x00-\x20;"]+)/);
      if (match) return `.ROBLOSECURITY=${match.at(1)}`;
    }
  } catch (e) {}
  return "";
}

async function httpGet(url, asBuffer = false) {
  try {
    const ck = getRbxCookie();
    const res = await net.fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Origin": `https://${H_WWW}`,
        "Referer": `https://${H_WWW}/`,
        "Accept": "application/json, image/png, */*",
        ...(ck ? { "Cookie": ck } : {})
      }
    });
    if (!res.ok) return asBuffer ? Buffer.alloc(0) : "";
    const buf = Buffer.from(await res.arrayBuffer());
    return asBuffer ? buf : buf.toString("utf8");
  } catch (err) { return asBuffer ? Buffer.alloc(0) : ""; }
}

async function fetchBatchPlaceData(placeIds) {
  const unique = [...new Set(placeIds.filter(Boolean).map(String))];
  const result = {};
  if (!unique.length) return result;
  try {
    const tUrl = `https://${H_THUMB}/v1/places/gameicons?placeIds=${unique.join(",")}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`;
    const raw = await httpGet(tUrl);
    const j = JSON.parse(raw);
    await Promise.all((j.data || []).map(async item => {
      if (item.imageUrl) {
        const buf = await httpGet(item.imageUrl, true);
        if (buf.length > 100) result[String(item.targetId)] = { icon: "data:image/png;base64," + buf.toString("base64") };
      }
    }));
  } catch (e) {}
  await Promise.all(unique.map(async id => {
    const preset = CURATED_GAMES.find(g => g.placeId === id);
    let name = preset ? preset.name : `Place #${id}`;
    try {
      const uRaw = await httpGet(`https://${H_APIS}/universes/v1/places/${id}/universe`);
      const uid = JSON.parse(uRaw).universeId;
      if (uid) {
        const gRaw = await httpGet(`https://${H_GAMES}/v1/games?universeIds=${uid}`);
        const gName = JSON.parse(gRaw).data?.at(0)?.name;
        const gInfo = JSON.parse(gRaw).data?.at(0);
        if (gInfo?.name) name = gInfo.name;
        result[id] = {
          ...(result[id] || {}),
          playing: gInfo?.playing || 0,
          visits: gInfo?.visits || 0,
          description: gInfo?.description || "No description provided.",
          creator: gInfo?.creator?.name || "Unknown",
          created: gInfo?.created ? new Date(gInfo.created).toLocaleDateString() : "Unknown",
          updated: gInfo?.updated ? new Date(gInfo.updated).toLocaleDateString() : "Unknown"
        };
      }
    } catch (e) {}
    result[id] = { ...(result[id] || {}), placeId: id, name };
  }));
  return result;
}

async function fetchGameDetails(lastId) {
  const topIds = CURATED_GAMES.slice(0, 9).map(g => g.placeId);
  const allIds = [...new Set([lastId, ...topIds].filter(Boolean))];
  const map = await fetchBatchPlaceData(allIds);
  const mosaicIcons = topIds.map(id => map[id]?.icon).filter(Boolean);
  const lastGame = lastId ? (map[lastId] || { placeId: lastId, name: `Place #${lastId}`, icon: "" }) : null;
  return { lastGame, mosaicIcons };
}

let lastGeoIp = "", lastGeoCity = "Not in game";
async function resolveServerCity(ip) {
  if (!ip || ip === "roblox.com") return "Not in game";
  if (ip === lastGeoIp && lastGeoCity !== "Not in game") return lastGeoCity;
  try {
    const host = ["ip-api", "com"].join(".");
    const raw = await httpGet(`http://${host}/json/${ip}?fields=status,city,region,countryCode`);
    const j = JSON.parse(raw);
    if (j && j.status === "success" && j.city) {
      lastGeoIp = ip;
      lastGeoCity = `${j.city}, ${j.region || j.countryCode || ""}`.replace(/,\s*$/, "");
      return lastGeoCity;
    }
  } catch (e) {}
  return "Unknown Region";
}

ipcMain.handle("get-stats", async () => {
  let username = "Not detected", serverIp = "roblox.com", places = [];
  const logDir = path.join(os.homedir(), "Library", "Logs", "Roblox");
  if (fs.existsSync(logDir)) {
    const files = fs.readdirSync(logDir).filter(f => f.endsWith(".log")).map(f => ({ name: f, time: fs.statSync(path.join(logDir, f)).mtime.getTime() })).sort((a, b) => b.time - a.time);
    for (const f of files.slice(0, 25)) {
      const txt = fs.readFileSync(path.join(logDir, f.name), "utf8");
      if (username === "Not detected") { const u = txt.match(/"UserName":"([^"]+)"/) || txt.match(/UserName:\s*([a-zA-Z0-9_]+)/) || txt.match(/"DisplayName":"([^"]+)"/); if (u) username = u.at(1); }
      if (serverIp === "roblox.com") { const ip = txt.match(/Connecting to (\d+\.\d+\.\d+\.\d+)/); if (ip) serverIp = ip.at(1); }
      const m = [...txt.matchAll(/placeId[=:]\s*(\d+)/gi)].map(x => x.at(1)).filter(x => x && x !== "0");
      if (m.length) places.push(...m.reverse());
    }
  }
  const unique = [...new Set(places)];
  const lastId = unique.at(0) || null;
  const [ping, serverCity, gameData] = await Promise.all([
    resolveServerCity(serverIp),
    new Promise(r => exec(`ping -c 1 -t 2 ${serverIp}`, (err, out) => { const m = !err && out.match(/time=([\d.]+)\s*ms/); r(m ? `${Math.round(parseFloat(m.at(1)))} ms` : "-- ms"); })),
    fetchGameDetails(lastId)
  ]);
  let fps = "60 FPS (Default)";
  const target = fs.existsSync(STAGED_FLAGS) ? STAGED_FLAGS : getLiveSettingsPath();
  if (fs.existsSync(target)) { try { const s = JSON.parse(fs.readFileSync(target, "utf8")); if (s.DFIntTaskSchedulerTargetFps) fps = `${s.DFIntTaskSchedulerTargetFps} FPS Cap`; } catch (e) {} }
  return { username, ping, serverCity, fps, lastGame: gameData.lastGame, mosaicIcons: gameData.mosaicIcons };
});

app.whenReady().then(createWindow);
