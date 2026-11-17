(() => {
    "use strict";
    const button = document.getElementById("surpriseBtn");
    const message = document.getElementById("message");
    const hearts = document.getElementById("heartContainer");
    const loader = document.getElementById("surpriseLoader");
    const KEY = "chenithaRaveenaSurpriseUnlockedV2";
    let busy = false;

    if (!button || !message) return;

    button.addEventListener("click", () => {
        if (busy) return;

        if (message.classList.contains("hidden")) {
            busy = true;
            button.disabled = true;
            button.setAttribute("aria-expanded", "true");

            if (loader) {
                loader.classList.add("is-visible");
                loader.setAttribute("aria-hidden", "false");
            }

            // Keep the loading screen visible briefly, then reveal the surprise.
            window.setTimeout(() => {
                try { localStorage.setItem(KEY, "yes"); } catch (error) {}
                window.dispatchEvent(new Event("surpriseUnlocked"));
                if (loader) {
                    loader.classList.remove("is-visible");
                    loader.setAttribute("aria-hidden", "true");
                }
                message.classList.remove("hidden");
                button.innerHTML = 'Close Your Surprise <span>♡</span>';
                button.disabled = false;
                busy = false;
                message.scrollIntoView({ behavior: "smooth", block: "center" });
                createHearts(hearts, 12);
            }, 2600);
        } else {
            message.classList.add("hidden");
            button.setAttribute("aria-expanded", "false");
            button.innerHTML = 'Open Your Surprise <span>♡</span>';
        }
    });

    function createHearts(container, amount) {
        if (!container) return;
        for (let i = 0; i < amount; i += 1) {
            const heart = document.createElement("span");
            heart.className = "floating-heart";
            heart.textContent = Math.random() > .5 ? "♡" : "♥";
            heart.style.left = Math.random() * 100 + "%";
            heart.style.animationDelay = Math.random() * 1.8 + "s";
            container.appendChild(heart);
            heart.addEventListener("animationend", () => heart.remove(), { once: true });
        }
    }
})();