(() => {
  "use strict";
  const KEY = "chenithaRaveenaSurpriseUnlocked";
  const isUnlocked = () => localStorage.getItem(KEY) === "yes";
  const isHome = /(?:^|\/)index\.html?$/.test(location.pathname) || location.pathname.endsWith("/lovely-surprise/");

  if (!isHome && !isUnlocked()) {
    location.replace(new URL("../index.html?locked=1", location.href).href);
    return;
  }

  const pageLinks = document.querySelectorAll('a[href*="story.html"], a[href*="memories.html"], a[href*="letter.html"]');

  function refreshLocks() {
    const unlocked = isUnlocked();
    pageLinks.forEach(link => {
      link.classList.toggle("page-locked", !unlocked);
      link.setAttribute("aria-disabled", String(!unlocked));
      if (!unlocked) link.title = "Open the surprise first";
      else link.removeAttribute("title");
    });
  }

  pageLinks.forEach(link => {
    link.addEventListener("click", event => {
      if (!isUnlocked()) {
        event.preventDefault();
        const message = document.getElementById("message");
        if (message) {
          message.classList.remove("hidden");
          message.scrollIntoView({behavior:"smooth", block:"center"});
        }
        const button = document.getElementById("surpriseBtn");
        if (button) button.focus();
      }
    });
  });

  const surpriseButton = document.getElementById("surpriseBtn");
  if (surpriseButton) {
    surpriseButton.addEventListener("click", () => {
      const message = document.getElementById("message");
      if (message && !message.classList.contains("hidden")) {
        localStorage.setItem(KEY, "yes");
        refreshLocks();
        surpriseButton.setAttribute("aria-label", "Surprise opened. All pages unlocked.");
      }
    });
  }

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