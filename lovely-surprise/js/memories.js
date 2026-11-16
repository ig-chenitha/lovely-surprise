
const cards = document.querySelectorAll(".photo-card");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const photoCount = document.getElementById("photoCount");

const closeBtn = document.getElementById("closeBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const photos = [
    "../images/memory1.jpeg",
    "../images/memory2.jpeg",
    "../images/memory3.jpeg",
    "../images/memory4.jpeg"
];

let currentIndex = 0;

function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;

    lightboxImage.src = photos[currentIndex];
    photoCount.textContent =
        `${currentIndex + 1} / ${photos.length}`;
}

function openGallery(index) {
    showPhoto(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeGallery() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

cards.forEach(card => {
    card.addEventListener("click", () => {
        openGallery(Number(card.dataset.index));
    });
});

nextBtn.addEventListener("click", () => {
    showPhoto(currentIndex + 1);
});

prevBtn.addEventListener("click", () => {
    showPhoto(currentIndex - 1);
});

closeBtn.addEventListener("click", closeGallery);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeGallery();
    }
});

document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
    if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
});
