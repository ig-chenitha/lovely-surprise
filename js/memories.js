(() => {
    "use strict";

    const cards = document.querySelectorAll(".photo-card");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const photoCount = document.getElementById("photoCount");
    const closeBtn = document.getElementById("closeBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (!lightbox || !lightboxImage || !photoCount || !closeBtn || !nextBtn || !prevBtn) return;

    const photos = [
        "../images/memory1.jpeg",
        "../images/memory2.jpeg",
        "../images/memory3.jpeg",
        "../images/memory4.jpeg"
    ];
    let currentIndex = 0;
    let previousFocus = null;

    function showPhoto(index) {
        currentIndex = (index + photos.length) % photos.length;
        lightboxImage.src = photos[currentIndex];
        photoCount.textContent = `${currentIndex + 1} / ${photos.length}`;
        lightboxImage.alt = `Memory ${currentIndex + 1} of ${photos.length}`;
    }

    function openGallery(index) {
        previousFocus = document.activeElement;
        showPhoto(index);
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    }

    function closeGallery() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    }

    cards.forEach(card => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.addEventListener("click", () => openGallery(Number(card.dataset.index)));
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGallery(Number(card.dataset.index));
            }
        });
    });

    nextBtn.addEventListener("click", () => showPhoto(currentIndex + 1));
    prevBtn.addEventListener("click", () => showPhoto(currentIndex - 1));
    closeBtn.addEventListener("click", closeGallery);

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeGallery();
    });

    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("active")) return;
        if (event.key === "Escape") closeGallery();
        if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
        if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
    });
})();
