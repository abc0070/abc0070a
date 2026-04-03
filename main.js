// --- 공통: 테마 설정 ---
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
htmlTag.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.style.backgroundColor = '#2d2d2d';
        themeToggle.style.color = '#ffffff';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.style.backgroundColor = '#ffffff';
        themeToggle.style.color = '#2c3e50';
    }
}

// --- 오늘의 알트코인 추천 로직 ---
const coinList = document.getElementById('coin-list');
const coins = [
    { name: '비트코인', symbol: 'BTC', icon: '₿' },
    { name: '이더리움', symbol: 'ETH', icon: '💎' },
    { name: '솔라나', symbol: 'SOL', icon: '☀️' },
    { name: '리플', symbol: 'XRP', icon: '💧' },
    { name: '도지코인', symbol: 'DOGE', icon: '🐕' },
    { name: '에이다', symbol: 'ADA', icon: '🃏' },
    { name: '아발란체', symbol: 'AVAX', icon: '🏔️' },
    { name: '폴카닷', symbol: 'DOT', icon: '🔴' },
    { name: '트론', symbol: 'TRX', icon: '💎' },
    { name: '체인링크', symbol: 'LINK', icon: '🔗' }
];

function displayDailyCoins() {
    if (!coinList) return;
    const today = new Date();
    const dateSeed = today.getFullYear() + today.getMonth() + today.getDate();
    
    // 날짜 기반으로 셔플하여 매일 다른 3개 선택
    const shuffled = [...coins].sort((a, b) => {
        const hashA = (a.name.length + dateSeed) % 10;
        const hashB = (b.name.length + dateSeed) % 10;
        return hashA - hashB;
    });

    const selectedCoins = shuffled.slice(0, 3);
    coinList.innerHTML = '';

    selectedCoins.forEach(coin => {
        const randomPercent = (Math.random() * 15 + 5).toFixed(1);
        const card = document.createElement('div');
        card.className = 'coin-card';
        card.innerHTML = `
            <div class="coin-icon">${coin.icon}</div>
            <div class="coin-name">${coin.name}</div>
            <div class="coin-symbol">${coin.symbol}</div>
            <div class="coin-stat">+${randomPercent}% 기대</div>
        `;
        coinList.appendChild(card);
    });
}
displayDailyCoins();

// --- 오늘의 운세 로직 ---
const fortuneBtn = document.getElementById('fortune-btn');
const fortuneResult = document.getElementById('fortune-result');
if (fortuneBtn) {
    fortuneBtn.addEventListener('click', () => {
        const name = document.getElementById('user-name').value;
        const birth = document.getElementById('fortune-birth').value;
        if (!name || !birth) { alert('이름과 생년월일을 입력해주세요!'); return; }
        fortuneBtn.disabled = true;
        setTimeout(() => {
            const today = new Date();
            const seed = name + birth + today.toDateString();
            const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
            document.getElementById('money-bar').style.width = ((hash * 7) % 41 + 60) + '%';
            document.getElementById('money-text').textContent = ((hash * 7) % 41 + 60) + '%';
            document.getElementById('love-bar').style.width = ((hash * 13) % 41 + 60) + '%';
            document.getElementById('love-text').textContent = ((hash * 13) % 41 + 60) + '%';
            document.getElementById('health-bar').style.width = ((hash * 19) % 41 + 60) + '%';
            document.getElementById('health-text').textContent = ((hash * 19) % 41 + 60) + '%';
            const titles = ["대길(大吉)", "소길(小吉)", "평범(平安)", "보통(普通)"];
            document.getElementById('luck-title').textContent = titles[hash % 4];
            fortuneResult.style.display = 'block';
            fortuneBtn.disabled = false;
        }, 1000);
    });
}

// --- 동물상 테스트 로직 ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/";
let model, maxPredictions;
async function loadModel() {
    try {
        model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
    } catch(e) { console.log("Model loading..."); }
}
loadModel();
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result; imagePreview.style.display = 'block';
            document.querySelector('.upload-label').style.display = 'none';
            imagePreview.onload = async () => {
                document.getElementById('loading-message').style.display = 'block';
                document.getElementById('label-container').innerHTML = '';
                if(!model) await loadModel();
                const prediction = await model.predict(imagePreview);
                prediction.sort((a, b) => b.probability - a.probability);
                document.getElementById('label-container').innerHTML = '';
                prediction.forEach(p => {
                    const prob = (p.probability * 100).toFixed(0);
                    const res = document.createElement('div');
                    res.className = 'result-bar-wrapper';
                    res.innerHTML = `<div class="label-text"><span>${p.className}</span><span>${prob}%</span></div><div class="bar-bg"><div class="bar-fill" style="width: ${prob}%"></div></div>`;
                    document.getElementById('label-container').appendChild(res);
                });
                document.getElementById('loading-message').style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    });
}

// --- 사주팔자 및 로또 로직 ---
const sajuBtn = document.getElementById('saju-btn');
if (sajuBtn) {
    sajuBtn.addEventListener('click', () => {
        document.getElementById('saju-result').style.display = 'block';
        document.getElementById('nyeon-ju').textContent = "경자"; document.getElementById('wol-ju').textContent = "무인";
        document.getElementById('il-ju').textContent = "임진"; document.getElementById('si-ju').textContent = "기사";
        document.getElementById('saju-comment').textContent = "기운이 조화로운 사주입니다. 올해는 꾸준한 노력이 결실을 맺을 것입니다.";
    });
}

const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const nums = Array.from({length: 45}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        const main = nums.slice(0, 6).sort((a,b) => a-b);
        const final = [...main, nums[6]];
        final.forEach((n, i) => {
            setTimeout(() => {
                numberCircles[i].textContent = n;
                numberCircles[i].className = `number-circle ball-${Math.floor((n-1)/10)*10+1}${i===6?' bonus-circle':''}`;
            }, i * 200);
        });
    });
}
