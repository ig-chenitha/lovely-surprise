(() => {
    "use strict";

    const surpriseButton = document.getElementById("surpriseBtn");
    const messageCard = document.getElementById("message");
    const heartContainer = document.getElementById("heartContainer");
    const UNLOCK_KEY = "chenithaRaveenaSurpriseUnlocked";

    if (surpriseButton && messageCard) {
        surpriseButton.addEventListener("click", () => {
            const isHidden = messageCard.classList.contains("hidden");
            messageCard.classList.toggle("hidden");
            surpriseButton.setAttribute("aria-expanded", String(isHidden));
            surpriseButton.innerHTML = isHidden
                ? 'Close Your Surprise <span>♡</span>'
                : 'Open Your Surprise <span>♡</span>';

            if (isHidden) {
                // Unlock every protected page immediately on the first opening.
                try { localStorage.setItem(UNLOCK_KEY, "yes"); } catch (error) {}
                window.dispatchEvent(new Event("surpriseUnlocked"));
                messageCard.scrollIntoView({ behavior: "smooth", block: "center" });
                createHearts(heartContainer, 12);
            }
        });
    }

    function createHearts(container, amount) {
        if (!container) return;
        for (let i = 0; i < amount; i += 1) {
            const heart = document.createElement("span");
            heart.className = "floating-heart";
            heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDelay = `${Math.random() * 1.8}s`;
            heart.style.fontSize = `${14 + Math.random() * 18}px`;
            container.appendChild(heart);
            heart.addEventListener("animationend", () => heart.remove(), { once: true });
        }
    }
})();