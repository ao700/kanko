const customStampIDs = [11501, 21802, 36903, 45804, 50085];

const stampData = [
    { id: '11501', image: 'https://ryu342jp.github.io/kanko/project/stamp-01-05.png', points: 10 },
    { id: '21802', image: 'https://ryu342jp.github.io/kanko/project/stamp-01-06.png', points: 15 },
    { id: '36903', image: 'st3.png', points: 20 },
    { id: '45804', image: 'st4.png', points: 25 },
    { id: '50085', image: 'st5.png', points: 30 },
];

const targetLocations = [
    { lat: 32.74940020598272, lon: 129.87958316982198 },
    { lat: 32.80864261545204, lon: 129.87437337696068 },
    { lat: 32.74274063579224, lon: 129.87767150491538 }
];

const maxDistance = 200;

function initializeStamps() {
    updateStamps();
    updatePoints();
}

function updateStamps() {
    const stampCounts = JSON.parse(localStorage.getItem('stampCounts') || '{}');
    const stampContainer = document.getElementById('stamp-container');
    stampContainer.innerHTML = '';
    
    customStampIDs.forEach(id => {
        const stampInfo = stampData.find(stamp => stamp.id === id.toString());
        if (stampInfo) {
            const newStamp = document.createElement('div');
            newStamp.className = 'stamp';
            if (stampCounts[id] && stampCounts[id] > 0) {
                newStamp.classList.add('collected');
                newStamp.style.backgroundImage = `url(${stampInfo.image})`;
                newStamp.innerHTML = `<div class="stamp-count">${stampCounts[id]}</div>`;
            }
            newStamp.setAttribute('data-id', id);
            stampContainer.appendChild(newStamp);
        }
    });
}

function updatePoints() {
    const stampCounts = JSON.parse(localStorage.getItem('stampCounts') || '{}');
    let totalPoints = 0;
    Object.entries(stampCounts).forEach(([id, count]) => {
        const stamp = stampData.find(s => s.id === id);
        if (stamp && count > 0) {
            totalPoints += stamp.points;
        }
    });
    localStorage.setItem('points', totalPoints);
    document.getElementById('point-display').textContent = totalPoints;
}

function collectStamp(id) {
    const stampCounts = JSON.parse(localStorage.getItem('stampCounts') || '{}');
    if (!stampCounts[id]) {
        stampCounts[id] = 0;
    }
    stampCounts[id]++;
    localStorage.setItem('stampCounts', JSON.stringify(stampCounts));
    updateStamps();
    updatePoints();
    alert(`スタンプを獲得しました！獲得回数: ${stampCounts[id]}`);
}

function checkLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            let isInRange = false;
            for (const target of targetLocations) {
                const distance = calculateDistance(userLat, userLon, target.lat, target.lon);
                if (distance <= maxDistance) {
                    isInRange = true;
                    break;
                }
            }
            if (isInRange) {
                const urlParams = new URLSearchParams(window.location.search);
                const stampId = urlParams.get('id');
                if (stampId && customStampIDs.includes(parseInt(stampId))) {
                    collectStamp(stampId);
                } else {
                    alert("有効な範囲内にいますが、スタンプIDが指定されていないか無効です。");
                }
            } else {
                alert("指定された範囲内にいません。スタンプを収集するには、指定された場所に移動してください。");
            }
        }, function(error) {
            alert("位置情報の取得に失敗しました: " + error.message + "\n位置情報の許可を確認し、ページをリロードしてください。");
        });
    } else {
        alert("お使いのブラウザは位置情報をサポートしていません。");
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function openMap() {
    window.open('https://ryu342jp.github.io/kanko/project/map.html', '_blank');
}

function goToExchange() {
    window.open('https://maps.app.goo.gl/4fb9KNVRu3p2RAap9', '_blank');
}

function usePoints() {
    const password = prompt('パスワードを入力してください：');
    if (password === '0808') {
        resetStamps();
    } else {
        alert('パスワードが正しくありません。');
    }
}

function resetStamps() {
    const stampCounts = JSON.parse(localStorage.getItem('stampCounts') || '{}');
    Object.keys(stampCounts).forEach(id => {
        if (stampCounts[id] > 0) {
            stampCounts[id] = 0;
        }
    });
    localStorage.setItem('stampCounts', JSON.stringify(stampCounts));
    localStorage.setItem('points', '0');
    updateStamps();
    updatePoints();
    alert('ポイントがリセットされ、スタンプが再度獲得可能になりました。スタンプの表示と獲得履歴は保持されています。');
}

document.addEventListener('DOMContentLoaded', function() {
    initializeStamps();
    const urlParams = new URLSearchParams(window.location.search);
    const stampId = urlParams.get('id');
    if (stampId) {
        checkLocation();
    }
});

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