document.addEventListener("DOMContentLoaded", function () {
  /*const startpointSelect = document.getElementById("startpoint");*/
  const arrivalTimeSelect = document.getElementById("arrival-time");
  const durationSelect = document.getElementById("duration");
  const genreSelect = document.getElementById("genre");
  const searchButton = document.getElementById("search-button");
  const errorMessageContainer = document.getElementById("error-message");

  function redirectToPage() {
    /*const startpoint = startpointSelect.value;*/
    const arrivalTime = parseInt(arrivalTimeSelect.value, 10);
    const duration = parseInt(durationSelect.value,10);
    const selectedGenre = genreSelect.value;
    
    // endTimeを計算
    const endTime = arrivalTime + duration;
    let link = ""; // リンクを初期化
    if(endTime > 19) {
      errorMessageContainer.innerHTML = "※これより短い時間を選択してください";
    }
    else if(duration == 1 && selectedGenre == "none"){
      errorMessageContainer.innerHTML = "※2時間以上を選択して下さい";
    }
    else{
      link = "../course/" + selectedGenre + "/" + duration + "and" + arrivalTime + "to" + endTime + "/course1.html";
      /*link = "../course/" + selectedGenre + "/" + startpoint + "/" + duration + "and" + arrivalTime + "to" + endTime + "/course1.html";*/
      window.location.href = link;
        }
  }

  searchButton.addEventListener("click", redirectToPage);
});
//ナビゲーションの設定
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navbarMenu = document.querySelector(".navbar-menu");

  menuToggle.addEventListener("click", function () {
    navbarMenu.classList.toggle("active");
  });
});