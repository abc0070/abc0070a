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
        const lottoNumbers = generateLottoNumbers();
        setTimeout(() => displayNumbers(lottoNumbers), 300);
    });
}

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    numbers.forEach((number, index) => {
        setTimeout(() => {
            const circle = numberCircles[index];
            circle.textContent = number;
            circle.classList.add(getBallColorClass(number));
            circle.style.transform = 'scale(1) rotate(0deg)';
            circle.style.opacity = '1';
            if (index === numbers.length - 1) {
                setTimeout(() => {
                    generateBtn.disabled = false;
                    generateBtn.textContent = '번호 다시 추첨하기';
                }, 500);
            }
        }, index * 250);
    });
}

function getBallColorClass(number) {
    if (number <= 10) return 'ball-1';
    if (number <= 20) return 'ball-11';
    if (number <= 30) return 'ball-21';
    if (number <= 40) return 'ball-31';
    return 'ball-41';
}

// --- 동물상 테스트 (이미지 업로드 버전) ---
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/";
let model, labelContainer, maxPredictions;

// 페이지 로드 시 모델 미리 불러오기
async function loadModel() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log("Model loaded");
}
loadModel();

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const loadingMsg = document.getElementById('loading-message');
labelContainer = document.getElementById('label-container');

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 미리보기 표시
    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        
        // AI 분석 시작
        loadingMsg.style.display = 'block';
        labelContainer.innerHTML = ''; // 기존 결과 제거
        
        // 모델 로딩 대기 (이미 로드되었겠지만 안전하게)
        if (!model) await loadModel();
        
        await predict(imagePreview);
        loadingMsg.style.display = 'none';
    };
    reader.readAsDataURL(file);
});

async function predict(imgElement) {
    const prediction = await model.predict(imgElement);
    
    // 확률이 높은 순으로 정렬
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        // 결과 바 HTML 생성
        const resultItem = document.createElement('div');
        resultItem.className = 'result-bar-wrapper';
        resultItem.innerHTML = `
            <div class="label-text">
                <span>${className}</span>
                <span>${probability}%</span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: ${probability}%"></div>
            </div>
        `;
        labelContainer.appendChild(resultItem);
    }
}
