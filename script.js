// script.js

document.addEventListener('DOMContentLoaded', function() {
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');

    setInterval(() => {
        text1.style.left = `${Math.random() * 90}%`;
        text1.style.top = `${Math.random() * 90}%`;
        text2.style.left = `${Math.random() * 90}%`;
        text2.style.top = `${Math.random() * 90}%`;
    }, 1000);
});
