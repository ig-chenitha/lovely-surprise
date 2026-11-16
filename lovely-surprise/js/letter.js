
const envelope = document.getElementById('envelope');
const openButton = document.getElementById('openButton');
const closeButton = document.getElementById('closeButton');
const letterOverlay = document.getElementById('letterOverlay');
const letterBody = document.getElementById('letterBody');
const instruction = document.getElementById('instruction');

let isOpening = false;
let animationTimers = [];

function clearLetterTimers() {
    animationTimers.forEach(timer => clearTimeout(timer));
    animationTimers = [];
}

function openLetter() {

    if (isOpening) return;

    isOpening = true;
    openButton.disabled = true;

    instruction.textContent = 'Opening something special for you...';
    openButton.querySelector('span:first-child').textContent = 'Opening Your Letter...';

    // Open the 3D envelope
    envelope.classList.add('open');

    // Show the actual letter
    const openTimer = setTimeout(() => {

        letterOverlay.classList.add('show');

        instruction.textContent = 'A little piece of my heart ♡';

        // Reveal paragraphs one by one
        const paragraphs = letterBody.querySelectorAll('p');

        paragraphs.forEach((paragraph, index) => {

            const timer = setTimeout(() => {
                paragraph.classList.add('visible');
            }, 700 + index * 650);

            animationTimers.push(timer);
        });

    }, 1100);

    animationTimers.push(openTimer);
}

function closeLetter() {

    clearLetterTimers();

    // Hide the letter
    letterOverlay.classList.remove('show');

    // Reset paragraph animations
    const paragraphs = letterBody.querySelectorAll('p');

    paragraphs.forEach(paragraph => {
        paragraph.classList.remove('visible');
    });

    // Close envelope
    const closeTimer = setTimeout(() => {

        envelope.classList.remove('open');

        instruction.textContent =
            'A little surprise is waiting for you';

        openButton.querySelector('span:first-child').textContent =
            'Open Your Letter';

        openButton.disabled = false;

        isOpening = false;

    }, 700);

    animationTimers.push(closeTimer);
}

// Open actions
openButton.addEventListener('click', openLetter);
envelope.addEventListener('click', openLetter);

// Close action
closeButton.addEventListener('click', closeLetter);

// Close when clicking outside the paper
letterOverlay.addEventListener('click', (event) => {

    if (event.target === letterOverlay) {
        closeLetter();
    }

});

// Keyboard support
document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape' &&
        letterOverlay.classList.contains('show')) {

        closeLetter();
    }

});
