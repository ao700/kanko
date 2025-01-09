// ハンバーガーメニューのクリック時の処理
$(".menu-toggle").click(function() {
    $(".menu").toggleClass("active");
});

const background = document.querySelector('.background');
let position = 0;

setInterval(() => {
    position += 1;
    background.style.backgroundPosition = `${position}% 50%`;
}, 70); // 100ミリ秒ごとに位置を変更

//logoの表示
$(window).on('load',function(){
  $("#splash").delay(800).fadeOut('slow');//ローディング画面を1秒 (1000ms)待機してからフェードアウト
  $("#splash_logo").delay(500).fadeOut('slow');//ロゴを0,8秒（800ms）待機してからフェードアウト
});