(() => {
  "use strict";
  const KEY = "chenithaRaveenaSurpriseUnlocked";
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
      const message = document.getElementById("message");
      const button = document.getElementById("surpriseBtn");
      if (message) {
        message.classList.remove("hidden");
        message.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (button) button.focus();
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