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
    const imageUrl = `url(${backgroundImages[currentIndex]})`;
    backgroundImage.style.backgroundImage = imageUrl;
    currentIndex = (currentIndex + 1) % backgroundImages.length;
}

// 最初の実行
changeBackgroundImage();

// 最初の3秒待ってから切り替えを開始
setTimeout(() => {
    setInterval(changeBackgroundImage, 5000);
}, 3000);
