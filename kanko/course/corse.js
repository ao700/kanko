const backgroundImages = [];

// HTML内のすべてのimg要素を取得
const imgElements = document.querySelectorAll('.section img');

// img要素からsrc属性を取得して配列に追加
imgElements.forEach(img => {
    backgroundImages.push(img.src);
});

let currentIndex = 0;

function changeBackgroundImage() {
    const backgroundImage = document.getElementById('background-image');
    currentIndex = (currentIndex + 1) % backgroundImages.length;
    const imageUrl = `url(${backgroundImages[currentIndex]})`;
    backgroundImage.style.backgroundImage = imageUrl;
}

// 最初の実行
changeBackgroundImage();

// 5秒ごとに背景画像を切り替える
setInterval(changeBackgroundImage, 5000);

//ナビゲーションの設定
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbarMenu = document.querySelector(".navbar-menu");

    menuToggle.addEventListener("click", function() {
        navbarMenu.classList.toggle("active");
    });
});