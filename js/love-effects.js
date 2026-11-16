(() => {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = document.createElement("div");
  layer.className = "love-particles";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const symbols = ["♡", "♥", "✦"];
  let active = 0;

  function addParticle() {
    if (active >= 7 || document.hidden) return;
    const particle = document.createElement("span");
    particle.className = "love-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = Math.random() * 96 + 2 + "%";
    particle.style.setProperty("--drift", (Math.random() * 90 - 45) + "px");
    particle.style.animationDuration = (8 + Math.random() * 5) + "s";
    particle.style.fontSize = (12 + Math.random() * 12) + "px";
    layer.appendChild(particle);
    active++;
    particle.addEventListener("animationend", () => {
      particle.remove();
      active = Math.max(0, active - 1);
    }, { once: true });
  }

  const interval = window.setInterval(addParticle, 1800);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) window.clearInterval(interval);
  }, { once: true });
})();