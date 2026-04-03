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

// --- 동물상 테스트 (Teachable Machine) ---
// Teachable Machine 모델 주소 (온라인 주소로 변경 가능)
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Hscx2n06o/"; 
// 위 주소는 예시입니다. 본인의 모델 주소를 사용하려면 수정하세요.

let model, webcam, labelContainer, maxPredictions;

async function initAnimalTest() {
    const startBtn = document.getElementById("start-btn");
    const loadingMsg = document.getElementById("loading-message");
    
    startBtn.style.display = "none";
    loadingMsg.style.display = "block";

    try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loopAnimalTest);

        loadingMsg.style.display = "none";
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    } catch (e) {
        console.error(e);
        loadingMsg.textContent = "모델을 불러오는데 실패했습니다. 주소를 확인해주세요.";
    }
}

async function loopAnimalTest() {
    webcam.update(); 
    await predictAnimalTest();
    window.requestAnimationFrame(loopAnimalTest);
}

async function predictAnimalTest() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        // 결과 표시 (이름: 퍼센트)
        labelContainer.childNodes[i].innerHTML = `
            <span>${className}</span>
            <span>${probability}%</span>
        `;
    }
}
