const stampData = [
    { id: '1', image: 'https://ao700.github.io/project/stamp-01-05.png', points: 10, lat: 32.808665436811026, lon: 129.87430175156737 },
    { id: '2', image: 'https://ao700.github.io/project/stamp-01-06.png', points: 15, lat: 32.808665436811026, lon: 129.87430175156737 },
    { id: '3', image: 'https://ao700.github.io/project/stamp-01-07.png', points: 10, lat: 32.808665436811026, lon: 129.87430175156737 },
    { id: '4', image: 'https://ao700.github.io/project/stamp-01-04.png', points: 15, lat: 32.808665436811026, lon: 129.87430175156737 },
    { id: '5', image: 'https://ao700.github.io/project/stamp-01-09.png', points: 10, lat: 32.808665436811026, lon: 129.87430175156737 },
    { id: '6', image: 'https://ao700.github.io/project/stamp-01-10.png', points: 15, lat: 32.808665436811026, lon: 129.87430175156737 },
    // 他の店舗のデータを追加...
];

let stamps = {};
let sumPoints = 0;
const usePoints = 5;

function initializeStamps() {
    const savedStamps = localStorage.getItem('stamps');
    const savedPoints = localStorage.getItem('sumPoints');

    if (savedStamps) {
        stamps = JSON.parse(savedStamps);
    } else {
        stampData.forEach(stamp => {
            stamps[stamp.id] = {
                ...stamp,
                read: 0,
                accessCount: 0
            };
        });
    }

    if (savedPoints) {
        sumPoints = parseInt(savedPoints);
    }
}

function saveData() {
    localStorage.setItem('stamps', JSON.stringify(stamps));
    localStorage.setItem('sumPoints', sumPoints.toString());
}

function renderStamps() {
    const container = document.getElementById('stampContainer');
    container.innerHTML = '';
    
    Object.values(stamps).forEach(stamp => {
        if (stamp.read > 0) {
            const stampElement = document.createElement('div');
            stampElement.className = 'stamp';
            stampElement.style.backgroundImage = `url(${stamp.image})`;
            
            const readCount = document.createElement('div');
            readCount.className = 'read-count';
            readCount.textContent = stamp.read;
            
            stampElement.appendChild(readCount);
            container.appendChild(stampElement);
        }
    });
}

function updatePointsDisplay() {
    document.getElementById('totalPoints').textContent = `合計ポイント: ${sumPoints}`;
}

function checkLocation(latitude, longitude, stampLat, stampLon) {
    const distance = calculateDistance(latitude, longitude, stampLat, stampLon);
    console.log(`Distance to stamp: ${distance} meters`); // デバッグ情報
    return distance <= 50; // 100メートル以内に変更
}
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function handleStampAcquisition(id) {
    if (!stamps[id]) return;

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        console.log(`User position: ${latitude}, ${longitude}`); // デバッグ情報
        console.log(`Stamp position: ${stamps[id].lat}, ${stamps[id].lon}`); // デバッグ情報
        if (checkLocation(latitude, longitude, stamps[id].lat, stamps[id].lon)) {
            stamps[id].accessCount++;
            if (stamps[id].accessCount === 1) {
                stamps[id].read++;
                sumPoints += stamps[id].points;
            }
            renderStamps();
            updatePointsDisplay();
            saveData();
            document.getElementById('message').textContent = 'スタンプを獲得しました！';
        } else {
            document.getElementById('message').textContent = '指定された範囲内にいません。';
        }
    }, error => {
        console.error('Geolocation error:', error); // エラー情報
        document.getElementById('message').textContent = '位置情報の取得に失敗しました。';
    }, {
        enableHighAccuracy: true, // 高精度の位置情報を要求
        timeout: 5000, // タイムアウトを5秒に設定
        maximumAge: 0 // キャッシュされた位置情報を使用しない
    });
}

function usePointsWithPassword() {
    const password = prompt('パスワードを入力してください：');
    if (password === '08') {
        const use = Math.floor(sumPoints / usePoints);
        sumPoints = sumPoints % usePoints;
        Object.values(stamps).forEach(stamp => stamp.accessCount = 0);
        saveData();
        
        // 現在のURLからベースURLを取得
        const currentUrl = new URL(window.location.href);
        const baseUrl = `${currentUrl.protocol}//${currentUrl.host}${currentUrl.pathname}`;
        
        // リダイレクト先のURLにパラメータを追加
        const redirectUrl = `${baseUrl}?reset=true&use=${use}`;
        window.location.href = redirectUrl;
    } else {
        document.getElementById('message').textContent = 'パスワードが間違っています。';
    }
}

document.getElementById('usePointsButton').addEventListener('click', usePointsWithPassword);

document.getElementById('locationButton').addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(() => {
            document.getElementById('message').textContent = '位置情報の使用が許可されています。';
        }, () => {
            document.getElementById('message').textContent = '位置情報の使用を許可してください。';
        });
    } else {
        document.getElementById('message').textContent = 'お使いのブラウザは位置情報をサポートしていません。';
    }
});

document.getElementById('mapButton').addEventListener('click', () => {
    window.location.href = 'https://map.example.com';
});

document.getElementById('exchangeButton').addEventListener('click', () => {
    window.location.href = 'https://exchange.example.com';
});

initializeStamps();
renderStamps();
updatePointsDisplay();

// URLからIDを取得してスタンプ獲得処理を行う
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const reset = urlParams.get('reset');
const use = urlParams.get('use');

if (reset === 'true' && use) {
    document.getElementById('message').textContent = `ポイントが消費され、スタンプが再度獲得可能になりました。${use}回抽選を行えます！`;
} else if (id) {
    handleStampAcquisition(id);
}


//スライダー
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
        const walk = (x - startX) * 2; // スクロール速度
        container.scrollLeft = scrollLeft - walk;
    }
});

container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
});

container.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // スクロール速度
    container.scrollLeft = scrollLeft - walk;
});