const customStampIDs = [11501, 21802, 36903, 45804, 50085];
const stampData = [
    { id: '11501', image: 'https://ryu342jp.github.io/kanko/project/stamp-01-05.png', points: 10 },
    { id: '21802', image: 'https://ryu342jp.github.io/kanko/project/stamp-01-06.png', points: 15 },
    { id: '36903', image: 'st3.png', points: 20 },
    { id: '45804', image: 'st4.png', points: 25 },
    { id: '50085', image: 'st5.png', points: 30 },
];

let sumPoints = 0;

function collectStamp(id) {
    const stamps = JSON.parse(localStorage.getItem('stamps') || '[]');
    const stampInfo = stampData.find(stamp => stamp.id === id);
    
    if (!stamps.includes(id)) {
        let accessCount = 1; // 初回読み込み
        let read = 1; // 初回読み込みでread増加
        sumPoints += stampInfo.points; // ポイント加算

        stamps.push({ id: id, read: read, accessCount: accessCount });
        localStorage.setItem('stamps', JSON.stringify(stamps));
        updateStamps();

        alert(`スタンプ${id}を獲得しました！`);
    } else {
        const stamp = stamps.find(s => s.id === id);
        stamp.accessCount += 1;
        if (stamp.accessCount === 1) {
            stamp.read += 1;
            sumPoints += stampInfo.points;
        }
        localStorage.setItem('stamps', JSON.stringify(stamps));
        updateStamps();
    }
}

function resetPoints() {
    const password = prompt("パスワードを入力してください:");
    if (password === "yourPassword") {
        const usePoints = parseInt(prompt("使用するポイント数を入力してください:"));
        if (sumPoints >= usePoints) {
            sumPoints -= usePoints;
            alert(`ポイントを消費しました。残りポイント: ${sumPoints}`);
        } else {
            alert("ポイントが不足しています。");
        }
        const stamps = JSON.parse(localStorage.getItem('stamps') || '[]');
        stamps.forEach(stamp => stamp.accessCount = 0); // スタンプのリセット
        localStorage.setItem('stamps', JSON.stringify(stamps));
        updateStamps();
    } else {
        alert("パスワードが間違っています。");
    }
}

// スライダー機能
let startX;
let scrollLeft;
const container = document.querySelector('#container');

container.addEventListener('mousedown', (e) => {
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
});

container.addEventListener('mouseleave', () => {
    container.style.cursor = 'auto';
    container.style.userSelect = 'auto';
});

container.addEventListener('mouseup', () => {
    container.style.cursor = 'auto';
    container.style.userSelect = 'auto';
});

container.addEventListener('mousemove', (e) => {
    if (startX !== undefined) {
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    }
});

container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
});

container.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
});
