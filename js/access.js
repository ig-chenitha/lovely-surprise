(() => {
  "use strict";
  const KEY = "chenithaRaveenaSurpriseUnlockedV2";
  const isUnlocked = () => {
    try { return localStorage.getItem(KEY) === "yes"; }
    catch (error) { return false; }
  };
  const path = location.pathname;
  const isHome = /\/index\.html?$/.test(path) || path.endsWith("/lovely-surprise/") || path.endsWith("/lovely-surprise");

  if (!isHome && !isUnlocked()) {
    location.replace(new URL("../index.html?locked=1", location.href).href);
    return;
  }

  // Warm the next page in the background when a visitor points to a navigation link.
  // This keeps normal page navigation intact while allowing the browser to reuse cached files.
  const prefetched = new Set();
  function warmPage(link) {
    if (!link || !isUnlocked()) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || prefetched.has(url.href)) return;
    prefetched.add(url.href);
    const hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = url.href;
    document.head.appendChild(hint);
  }
  document.addEventListener("pointerover", event => {
    const link = event.target.closest('a[href*="story.html"], a[href*="memories.html"], a[href*="letter.html"]');
    if (link) warmPage(link);
  });
  document.addEventListener("focusin", event => {
    const link = event.target.closest('a[href*="story.html"], a[href*="memories.html"], a[href*="letter.html"]');
    if (link) warmPage(link);
  });

  function refreshLocks() {
    const unlocked = isUnlocked();
    document.querySelectorAll('a[href*="story.html"], a[href*="memories.html"], a[href*="letter.html"]').forEach(link => {
      link.classList.toggle("page-locked", !unlocked);
      link.setAttribute("aria-disabled", String(!unlocked));
      if (unlocked) {
        link.removeAttribute("title");
      } else {
        link.title = "Open the surprise first";
      }
    });
    document.documentElement.classList.toggle("surprise-unlocked", unlocked);
  }

  document.addEventListener("click", event => {
    const link = event.target.closest('a[href*="story.html"], a[href*="memories.html"], a[href*="letter.html"]');
    if (link && !isUnlocked()) {
      event.preventDefault();
      const button = document.getElementById("surpriseBtn");
      if (!isHome) {
        // Send visitors back to the home page and bring the unlock button into view.
        location.href = new URL("../index.html#surpriseBtn", location.href).href;
        return;
      }
      if (button) {
        button.scrollIntoView({ behavior: "smooth", block: "center" });
        button.focus({ preventScroll: true });
      }
    }
  });

  window.addEventListener("surpriseUnlocked", refreshLocks);
  window.addEventListener("storage", refreshLocks);

  if (new URLSearchParams(location.search).has("locked")) {
    history.replaceState({}, "", location.pathname);
    const note = document.createElement("p");
    note.className = "unlock-hint";
    note.textContent = "Open your surprise first to unlock the other pages ♡";
    const main = document.querySelector("main");
    if (main) main.prepend(note);
  }

  refreshLocks();
})();