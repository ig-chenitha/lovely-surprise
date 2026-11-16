(() => {
    "use strict";

    const envelope = document.getElementById("envelope");
    const openButton = document.getElementById("openButton");
    const closeButton = document.getElementById("closeButton");
    const letterOverlay = document.getElementById("letterOverlay");
    const letterBody = document.getElementById("letterBody");
    const instruction = document.getElementById("instruction");

    if (!envelope || !openButton || !closeButton || !letterOverlay || !letterBody) return;

    let isOpening = false;
    let timers = [];

    function clearTimers() {
        timers.forEach(timer => window.clearTimeout(timer));
        timers = [];
    }

    function openLetter() {
        if (isOpening) return;

        isOpening = true;
        openButton.disabled = true;
        openButton.textContent = "Opening Your Letter…";
        instruction.textContent = "Opening something special for you…";
        envelope.classList.add("open");

        const revealTimer = window.setTimeout(() => {
            letterOverlay.classList.add("show");
            letterOverlay.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            instruction.textContent = "A little piece of my heart ♡";

            const paragraphs = letterBody.querySelectorAll("p");
            paragraphs.forEach((paragraph, index) => {
                const timer = window.setTimeout(() => {
                    paragraph.classList.add("visible");
                }, 450 + index * 500);
                timers.push(timer);
            });

            closeButton.focus({ preventScroll: true });
        }, 950);

        timers.push(revealTimer);
    }

    function closeLetter() {
        clearTimers();
        letterOverlay.classList.remove("show");
        letterOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        letterBody.querySelectorAll("p").forEach(paragraph => {
            paragraph.classList.remove("visible");
        });

        const resetTimer = window.setTimeout(() => {
            envelope.classList.remove("open");
            instruction.textContent = "A little surprise is waiting for you";
            openButton.textContent = "Open Your Letter ♡";
            openButton.disabled = false;
            isOpening = false;
            openButton.focus({ preventScroll: true });
        }, 550);

        timers.push(resetTimer);
    }

    openButton.addEventListener("click", openLetter);
    envelope.addEventListener("click", openLetter);
    closeButton.addEventListener("click", closeLetter);

    letterOverlay.addEventListener("click", event => {
        if (event.target === letterOverlay) closeLetter();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && letterOverlay.classList.contains("show")) {
            closeLetter();
        }
    });
})();
