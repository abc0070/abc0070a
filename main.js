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
        themeToggle.style.color = '#ffffff';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.style.color = '#2c3e50';
    }
}

// --- 오늘의 운세 & 행운 리포트 ---
const fortuneBtn = document.getElementById('fortune-btn');
const fortuneResult = document.getElementById('fortune-result');

if (fortuneBtn) {
    fortuneBtn.addEventListener('click', () => {
        const name = document.getElementById('user-name').value;
        const birth = document.getElementById('fortune-birth').value;
        if (!name || !birth) { alert('이름과 생년월일을 정확히 입력해주세요!'); return; }

        fortuneBtn.textContent = '데이터 매칭 중...';
        fortuneBtn.disabled = true;

        setTimeout(() => {
            const today = new Date();
            const seed = name + birth + today.toDateString();
            const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

            const m = (hash * 7) % 41 + 60;
            const l = (hash * 13) % 41 + 60;
            
            document.getElementById('money-bar').style.width = m + '%';
            document.getElementById('money-text').textContent = m + '%';
            document.getElementById('love-bar').style.width = l + '%';
            document.getElementById('love-text').textContent = l + '%';

            const titles = ["대길(大吉)", "소길(小吉)", "평범(平安)", "보통(普通)"];
            const comments = [
                "에너지가 넘치는 날입니다. 새로운 프로젝트를 시작하기에 완벽한 시기입니다.",
                "작은 기쁨이 따르는 날입니다. 주변의 의견을 경청하면 뜻밖의 수확이 있습니다.",
                "평온한 하루입니다. 내실을 다지고 건강을 챙기는 시간을 가지세요.",
                "신중함이 필요한 날입니다. 큰 결정보다는 일상을 유지하는 데 집중하세요."
            ];

            const idx = hash % titles.length;
            document.getElementById('luck-title').textContent = titles[idx];
            document.getElementById('total-comment').textContent = comments[idx];

            fortuneResult.style.display = 'block';
            fortuneBtn.textContent = '리포트 다시 생성';
            fortuneBtn.disabled = false;
            window.scrollTo({ top: fortuneResult.offsetTop - 100, behavior: 'smooth' });
        }, 1200);
    });
}

// --- AI 동물상 분석 (TensorFlow.js) ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/";
let model, maxPredictions;

async function loadAIModel() {
    try {
        model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
        console.log("Neural Network Model Ready.");
    } catch(e) { console.log("AI Model Loading..."); }
}
loadAIModel();

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadLabel = document.querySelector('.upload-label');
const loadingMsg = document.getElementById('loading-message');
const labelContainer = document.getElementById('label-container');

if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            uploadLabel.style.display = 'none';
            imagePreview.onload = async () => {
                loadingMsg.style.display = 'block';
                labelContainer.innerHTML = '';
                if(!model) await loadAIModel();
                const prediction = await model.predict(imagePreview);
                prediction.sort((a, b) => b.probability - a.probability);
                labelContainer.innerHTML = '<h3>분석 결과 (일치 확률)</h3>';
                prediction.forEach(p => {
                    const prob = (p.probability * 100).toFixed(0);
                    const res = document.createElement('div');
                    res.className = 'result-bar-wrapper';
                    res.innerHTML = `<div class="label-text"><span>${p.className}</span><span>${prob}%</span></div><div class="bar-bg"><div class="bar-fill" style="width: ${prob}%"></div></div>`;
                    labelContainer.appendChild(res);
                });
                loadingMsg.style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    });
}

// --- 전통 명리학 (사주) & 로또 추첨 ---
const sajuBtn = document.getElementById('saju-btn');
if (sajuBtn) {
    sajuBtn.addEventListener('click', () => {
        const b = document.getElementById('birth-date').value;
        if(!b) return;
        document.getElementById('saju-result').style.display = 'block';
        const year = new Date(b).getFullYear();
        const t = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
        const d = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
        document.getElementById('nyeon-ju').textContent = t[year % 10] + d[year % 12];
        document.getElementById('wol-ju').textContent = t[(year*2)%10] + d[(year+5)%12];
        document.getElementById('il-ju').textContent = t[(year+1)%10] + d[(year+1)%12];
        document.getElementById('saju-comment').textContent = "균형 잡힌 오행의 기운이 느껴지는 명식입니다. 학구적인 재능과 끈기가 돋보입니다.";
    });
}

const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const nums = Array.from({length: 45}, (_, i) => i + 1).sort(() => Math.random() - 0.5).slice(0, 6).sort((a,b) => a-b);
        nums.forEach((n, i) => {
            setTimeout(() => {
                numberCircles[i].textContent = n;
                numberCircles[i].className = `number-circle ball-${Math.floor((n-1)/10)*10+1}`;
            }, i * 150);
        });
    });
}

// --- 코인 리스트 로드 ---
function loadDailyCoins() {
    const coinGrid = document.getElementById('coin-list');
    if (!coinGrid) return;
    const items = [
        { n: '비트코인', s: 'BTC', i: '₿' },
        { n: '이더리움', s: 'ETH', i: '💎' },
        { n: '솔라나', s: 'SOL', i: '☀️' }
    ];
    coinGrid.innerHTML = '';
    items.forEach(c => {
        const div = document.createElement('div');
        div.className = 'coin-card';
        div.innerHTML = `<div style="font-size:2rem;">${c.i}</div><div style="font-weight:700;">${c.n}</div><div style="color:var(--text-sub); font-size:0.8rem;">${c.s}</div>`;
        coinGrid.appendChild(div);
    });
}
loadDailyCoins();
