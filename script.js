let score = 0;
let timer;
let currentTime;
let gameDuration;

const themeColors = ['#00ced1', '#32cd32', '#db7093', '#ffb347'];
const cases = ["omastav", "osastav", "seestütlev", "sisseütlev"];
const caseHints = {
    "omastav": "(kelle? mille?)",
    "osastav": "(keda? mida?)",
    "seestütlev": "(kest? millest?)",
    "sisseütlev": "(kuhu? kellesse? millesse?)"
};

function setupRandomHover() {
    const buttons = document.querySelectorAll('#start-buttons button, #gameOver button');
    buttons.forEach(btn => {
        btn.onmouseenter = () => {
            const randomColor = themeColors[Math.floor(Math.random() * themeColors.length)];
            btn.style.backgroundColor = randomColor;
            btn.style.borderColor = "#000";
            btn.style.color = "#000";
            const icon = btn.querySelector('.material-icons');
            if (icon) icon.style.color = "#000";
        };
            btn.onmouseleave = () => {
                btn.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                btn.style.borderColor = "white";
                btn.style.color = "white";
                const icon = btn.querySelector('.material-icons');
                if (icon) icon.style.color = "white";
            };
    });
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
    let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function initCookies() {
    let plays = parseInt(getCookie("total_plays") || "0");
    console.log(plays.toString().padStart(2, '0'));
    setCookie("total_plays", plays + 1, 365);
}

window.onload = () => {
    setRandomBackground();
    setupRandomHover();
    initCookies();
};

function showTimeSelection() {
    const menu = document.getElementById("main-menu");
    const timeSelection = document.getElementById("time-selection");
    // Play animation
    timeSelection.classList.remove("swipe-right");
    void timeSelection.offsetWidth;
    timeSelection.classList.add("swipe-right");
    menu.style.display = "none";
    timeSelection.style.display = "block";
}

function backToMenu() {
    // Animation disabled
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("time-selection").style.display = "none";
}

function startGame(duration) {
    score = 0;
    gameDuration = duration;
    currentTime = duration;

    const container = document.querySelector('.container');
    container.classList.remove("swipe-up", "swipe-right");
    void container.offsetWidth;
    container.classList.add("swipe-up");

    document.getElementById("score").innerText = "Punktid: 0";
    document.getElementById("start-buttons").style.display = "none";
    document.getElementById("game-hud").style.display = "block";
    document.getElementById("gameOver").classList.remove("active");

    clearInterval(timer);
    timer = setInterval(() => {
        currentTime--;
        document.getElementById("timer").innerText = "Aeg: " + currentTime;
        if (currentTime <= 0) endGame();
    }, 1000);

        generateQuestion();
}

function generateQuestion() {
    const wordsContainer = document.getElementById("words");
    wordsContainer.innerHTML = "";
    const wordObj = dictionary[Math.floor(Math.random() * dictionary.length)];
    const targetCase = cases[Math.floor(Math.random() * cases.length)];
    const correctAnswer = wordObj[targetCase];

    document.getElementById("target-word").innerText = wordObj.nimetav;
    document.getElementById("target-case").innerText = `${targetCase} ${caseHints[targetCase]}`;

    let options = cases.map(c => wordObj[c]);
    options.sort(() => Math.random() - 0.5);

    options.forEach(optionText => {
        const wordElement = document.createElement("div");
        wordElement.classList.add("word");
        wordElement.innerHTML = `<span>${optionText}</span>`;
        wordElement.onclick = () => {
            const allButtons = document.querySelectorAll('.word');
            allButtons.forEach(btn => btn.style.pointerEvents = "none");
            if (optionText === correctAnswer) {
                score += 100;
                wordElement.classList.add("green");
            } else {
                score = Math.max(0, score - 50);
                wordElement.classList.add("red");
                allButtons.forEach(btn => {
                    if(btn.querySelector('span').innerText === correctAnswer) btn.classList.add("green");
                });
            }
            document.getElementById("score").innerText = "Punktid: " + score;
            setTimeout(generateQuestion, 1000);
        };
        wordsContainer.appendChild(wordElement);
    });
}

function endGame() {
    clearInterval(timer);
    let totalPoints = parseInt(getCookie("total_points") || "0");
    setCookie("total_points", totalPoints + score, 365);
    document.getElementById("gameOver").classList.add("active");
    document.getElementById("finalScore").innerText = "Sa said " + score + " punkti!";
}

function retry() {
    startGame(gameDuration);
}

function goToMenu() {
    // Animation disabled, just reload
    location.reload();
}
