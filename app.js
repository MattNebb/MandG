(function () {
  const cfg = window.ADVENT_CONFIG || {};
  const total = Math.min(15, Number(cfg.totalWindows) || 15);
  const folder = (cfg.prizesFolder || "prizes").replace(/\/$/, "");
  const files = Array.isArray(cfg.prizeFiles) ? cfg.prizeFiles : [];

  const startStr = cfg.adventStart || "2026-12-01";
  const start = parseLocalDate(startStr);
  if (Number.isNaN(start.getTime())) {
    console.warn("Invalid adventStart in config.js — using today.");
  }

  const titleEl = document.getElementById("pageTitle");
  const subEl = document.getElementById("pageSubtitle");
  const board = document.getElementById("board");
  const hint = document.getElementById("hint");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  if (cfg.title) titleEl.textContent = cfg.title;
  if (cfg.subtitle) subEl.textContent = cfg.subtitle;
  document.title = cfg.title || document.title;

  const STORAGE_KEY = "advent_opened_v1";

  function parseLocalDate(yyyyMmDd) {
    const [y, m, d] = String(yyyyMmDd).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function dayIndexToday() {
    const today = startOfDay(new Date());
    const s = startOfDay(Number.isNaN(start.getTime()) ? new Date() : start);
    const diff = today.getTime() - s.getTime();
    return Math.floor(diff / 86400000) + 1;
  }

  function loadOpened() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return new Set();
      return new Set(arr.map(Number).filter((n) => n >= 1 && n <= total));
    } catch {
      return new Set();
    }
  }

  function saveOpened(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set].sort((a, b) => a - b)));
  }

  let opened = loadOpened();

  function isUnlocked(day) {
    if (cfg.devUnlockAll) return true;
    return dayIndexToday() >= day;
  }

  function prizePath(day) {
    const idx = day - 1;
    const name = files[idx] || String(day).padStart(2, "0") + ".jpg";
    return `${folder}/${name}`;
  }

  function renderHint() {
    if (cfg.devUnlockAll) {
      hint.textContent = "Dev mode: every window is unlocked.";
      return;
    }
    const todayNum = dayIndexToday();
    if (todayNum < 1) {
      const s = Number.isNaN(start.getTime()) ? startStr : formatNice(start);
      hint.textContent = `The first window unlocks on ${s}.`;
      return;
    }
    if (todayNum > total) {
      hint.textContent = "Every window has had its day — hope you loved them all.";
      return;
    }
    hint.textContent = `Today you can open up to window ${Math.min(todayNum, total)}.`;
  }

  function formatNice(d) {
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function openLightbox(day) {
    const src = prizePath(day);
    lightboxImg.src = src;
    lightboxImg.alt = `Surprise for day ${day}`;
    lightboxCaption.textContent = `Day ${day}`;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  function renderBoard() {
    board.innerHTML = "";
    for (let day = 1; day <= total; day++) {
      const unlocked = isUnlocked(day);
      const wasOpen = opened.has(day);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "door";
      btn.dataset.day = String(day);

      if (!unlocked) {
        btn.classList.add("door--locked");
        btn.disabled = true;
        btn.setAttribute("aria-label", `Window ${day}, locked until its day`);
      } else {
        btn.setAttribute("aria-label", wasOpen ? `Window ${day}, opened — tap to see again` : `Open window ${day}`);
        if (wasOpen) btn.classList.add("door--open");
      }

      const ribbon = document.createElement("span");
      ribbon.className = "door__ribbon";
      ribbon.setAttribute("aria-hidden", "true");

      const bow = document.createElement("span");
      bow.className = "door__bow";
      bow.setAttribute("aria-hidden", "true");

      const num = document.createElement("span");
      num.className = "door__num";
      num.textContent = String(day);

      btn.appendChild(ribbon);
      btn.appendChild(bow);
      btn.appendChild(num);

      if (!unlocked) {
        const badge = document.createElement("span");
        badge.className = "door__badge";
        badge.textContent = "Soon";
        btn.appendChild(badge);
      } else if (wasOpen) {
        const badge = document.createElement("span");
        badge.className = "door__badge";
        badge.textContent = "Opened";
        btn.appendChild(badge);
      }

      btn.addEventListener("click", () => {
        if (!isUnlocked(day)) return;
        opened.add(day);
        saveOpened(opened);
        btn.classList.add("door--open");
        const b = btn.querySelector(".door__badge");
        if (b) b.textContent = "Opened";
        openLightbox(day);
        renderHint();
      });

      board.appendChild(btn);
    }
  }

  renderBoard();
  renderHint();
})();
