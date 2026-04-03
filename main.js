const generateBtn = document.getElementById('generate-btn');
const numberCircles = document.querySelectorAll('.number-circle');
const themeToggle = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;

// 테마 초기 설정
const savedTheme = localStorage.getItem('theme') || 'light';
htmlTag.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// 테마 토글 이벤트
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    console.log(`Theme changed to: ${newTheme}`);
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

// 로또 번호 추첨 로직
generateBtn.addEventListener('click', () => {
    generateBtn.disabled = true;
    generateBtn.textContent = '추첨 중...';

    numberCircles.forEach(circle => {
        circle.style.transform = 'scale(0) rotate(-180deg)';
        circle.style.opacity = '0';
        circle.className = 'number-circle';
    });

    const lottoNumbers = generateLottoNumbers();

    setTimeout(() => {
        displayNumbers(lottoNumbers);
    }, 300);
});

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
            
            const colorClass = getBallColorClass(number);
            circle.classList.add(colorClass);

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
