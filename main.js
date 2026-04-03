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

// --- 동물상 테스트 (사진 업로드 방식) ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/";
let model, labelContainer, maxPredictions;

async function loadModel() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("AI Model Loaded");
}
loadModel();

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadLabel = document.querySelector('.upload-label');
const loadingMsg = document.getElementById('loading-message');
labelContainer = document.getElementById('label-container');

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
                if (!model) await loadModel();
                await predict(imagePreview);
                loadingMsg.style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    });
}

async function predict(imgElement) {
    const prediction = await model.predict(imgElement);
    prediction.sort((a, b) => b.probability - a.probability);

    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-bar-wrapper';
        resultItem.innerHTML = `
            <div class="label-text"><span>${className}</span><span>${probability}%</span></div>
            <div class="bar-bg"><div class="bar-fill" style="width: ${probability}%"></div></div>
        `;
        labelContainer.appendChild(resultItem);
    }
}

// --- 사주팔자 분석 로직 ---
const sajuBtn = document.getElementById('saju-btn');
const sajuResult = document.getElementById('saju-result');

if (sajuBtn) {
    sajuBtn.addEventListener('click', () => {
        const birthDate = document.getElementById('birth-date').value;
        if (!birthDate) { alert('생년월일을 선택해주세요!'); return; }
        sajuBtn.textContent = '운명 분석 중...';
        sajuBtn.disabled = true;

        setTimeout(() => {
            const date = new Date(birthDate);
            const year = date.getFullYear();
            const tianGan = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
            const diZhi = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
            
            const nyeonJu = tianGan[year % 10] + diZhi[year % 12];
            const wolJu = tianGan[(year * 2 + 3) % 10] + diZhi[(date.getMonth() + 2) % 12];
            const ilJu = tianGan[(year + date.getDate()) % 10] + diZhi[(year + date.getDate()) % 12];
            const siJu = tianGan[nyeonJu.length % 10] + diZhi[nyeonJu.length % 12];

            document.getElementById('nyeon-ju').textContent = nyeonJu;
            document.getElementById('wol-ju').textContent = wolJu;
            document.getElementById('il-ju').textContent = ilJu;
            document.getElementById('si-ju').textContent = siJu;

            const comments = [
                "당신은 따뜻한 성품을 지닌 나무와 같은 기운을 타고났습니다. 주변 사람들에게 베푸는 마음이 행운을 부릅니다.",
                "강인한 의지와 추진력을 가진 바위와 같은 사주입니다. 올해는 새로운 도전에 아주 적합한 해입니다.",
                "지혜롭고 유연한 물의 기운이 강합니다. 예술적인 감각이 뛰어나며 창의적인 일에서 큰 성과를 거둘 것입니다.",
                "밝고 열정적인 불의 기운을 가지고 있습니다. 사람들을 이끄는 리더십이 뛰어나며 사회적인 성공운이 높습니다.",
                "포용력 있고 듬직한 대지의 기운입니다. 꾸준한 노력이 결실을 맺어 중년 이후 큰 복이 들어오는 사주입니다."
            ];
            document.getElementById('saju-comment').textContent = comments[year % comments.length];
            sajuResult.style.display = 'block';
            sajuBtn.textContent = '나의 사주 다시 분석하기';
            sajuBtn.disabled = false;
        }, 1500);
    });
}

// --- 로또 번호 추첨기 ---
const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');

if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        generateBtn.disabled = true;
        generateBtn.textContent = '추첨 중...';
        numberCircles.forEach(circle => {
            circle.style.transform = 'scale(0) rotate(-180deg)';
            circle.style.opacity = '0';
            circle.className = 'number-circle';
        });
        const lottoNumbers = Array.from({length: 45}, (_, i) => i + 1).sort(() => Math.random() - 0.5).slice(0, 6).sort((a,b) => a-b);
        setTimeout(() => {
            numbersContainer(lottoNumbers);
            generateBtn.disabled = false;
            generateBtn.textContent = '번호 다시 추첨하기';
        }, 300);
    });
}

function numbersContainer(numbers) {
    numbers.forEach((number, index) => {
        setTimeout(() => {
            const circle = numberCircles[index];
            circle.textContent = number;
            circle.className = `number-circle ball-${Math.floor((number-1)/10)*10+1}`;
            circle.style.transform = 'scale(1) rotate(0deg)';
            circle.style.opacity = '1';
        }, index * 250);
    });
}
