 // animation span
document.addEventListener("DOMContentLoaded", () => {
    const typedSpan = document.querySelector(".typed");
    const items = typedSpan.getAttribute("data-typed-items").split(",").map(item => item.trim());
    let index = 0;
    let charIndex = 0;
    let currentText = "";
    let isDeleting = false;

    function type() {
        const fullText = items[index];
        if (isDeleting) {
            currentText = fullText.substring(0, charIndex--);
        } else {
            currentText = fullText.substring(0, charIndex++);
        }

        typedSpan.textContent = currentText;

        if (!isDeleting && charIndex === fullText.length + 1) {
            isDeleting = true;
            setTimeout(type, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % items.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
});
