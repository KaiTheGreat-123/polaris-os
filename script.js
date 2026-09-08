const startupSound = new Audio('./startup.mp3');
const clickSound = new Audio('./click.mp3');
const calendarSound = new Audio('./calendar.mp3');

window.onload = function() {
  let progress = 0;
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingElements = document.getElementById("loadingElements");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const starFill = document.getElementById("starFill");
  const loadingText = document.getElementById("loadingText");

  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1; 

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      setTimeout(() => {
        loadingElements.style.display = "none";
        
        welcomeMessage.innerHTML = `
          <div style="font-size: 28px; margin-bottom: 10px;">Welcome to Polaris-OS</div>
          <div style="font-size: 15px; opacity: 0.75; letter-spacing: 1px;">[ Click anywhere to start. ]</div>
        `;
        welcomeMessage.style.display = "block";
        
        setTimeout(() => {
          welcomeMessage.style.opacity = "1";
        }, 50);

        loadingScreen.style.cursor = "pointer";

        loadingScreen.addEventListener("click", function launchDesktop() {
          startupSound.currentTime = 0;
          startupSound.play().catch(e => console.log(e));

          loadingScreen.style.opacity = "0";
          loadingScreen.style.transform = "scale(1.1)"; 

          setTimeout(() => {
            loadingScreen.style.display = "none";
          }, 800);
        }, { once: true });

      }, 400);
    }

    starFill.style.height = progress + "%";
    loadingText.innerText = progress + "%";
  }, 40); 
};

setInterval(function () {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}, 1000);

const timeEl = document.getElementById("timeElement");
const calWindow = document.getElementById("calendarWindow");
timeEl.style.cursor = "pointer";

calWindow.style.display = "block"; 
calWindow.style.top = "auto";
calWindow.style.left = "auto";
calWindow.style.right = "30px";
calWindow.style.bottom = "-400px";
calWindow.style.opacity = "0";
calWindow.style.transition = "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";
calWindow.style.pointerEvents = "none";
calWindow.style.zIndex = "1000";

let isCalOpen = false;

timeEl.onclick = function() {
  if (!isCalOpen) {
    calendarSound.currentTime = 0;
    calendarSound.play().catch(e => {});

    calWindow.style.bottom = "90px"; 
    calWindow.style.opacity = "1";
    calWindow.style.pointerEvents = "auto";
    isCalOpen = true;
  } else {
    calWindow.style.bottom = "-400px"; 
    calWindow.style.opacity = "0";
    calWindow.style.pointerEvents = "none";
    isCalOpen = false;
  }
};

function toggleWindow(windowId) {
  const element = document.getElementById(windowId);
  if (element.style.display === "none" || element.style.opacity === "0") {
    openWindow(windowId);
  } else {
    closeWindow(windowId);
  }
}

function openWindow(windowId) {
  if(windowId === 'calendarWindow') {
      timeEl.click();
      return;
  }
  
  const element = document.getElementById(windowId);
  element.style.opacity = "0";
  element.style.display = "block";
  element.style.transition = "opacity 0.3s ease-in-out";
  bringToFront(element);

  setTimeout(() => {
    element.style.opacity = "1";
  }, 10);
}

function closeWindow(windowId) {
  if(windowId === 'calendarWindow') {
      timeEl.click();
      return;
  }
  
  const element = document.getElementById(windowId);
  element.style.opacity = "0";
  setTimeout(() => {
    element.style.display = "none";
  }, 300);
}

function triggerStarConfetti() {
  const numStars = 40; 
  const emojis = ['⭐', '✨', '🌟'];
  
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    star.classList.add('star-confetti');
    
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = '-20px';
    star.style.animationDuration = (Math.random() * 2 + 2) + 's'; 
    star.style.animationDelay = Math.random() * 0.5 + 's';
    
    document.body.appendChild(star);
    
    setTimeout(() => {
      star.remove();
    }, 5000);
  }
}

dragElement(document.getElementById("infoWindow"));
dragElement(document.getElementById("weatherWindow"));
dragElement(document.getElementById("calcWindow"));
dragElement(document.getElementById("notesWindow"));
dragElement(document.getElementById("musicWindow"));
dragElement(document.getElementById("TimerWindow"));
dragElement(document.getElementById("tictactoeWindow"));

function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header");

  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag; 
  }

  function elementDrag(e) { 
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

let zIndexCounter = 1;

function bringToFront(element) {
  zIndexCounter++;
  element.style.zIndex = zIndexCounter;
}

document.addEventListener('DOMContentLoaded', () => {
  const weatherInput = document.getElementById("weatherInput");
  if(weatherInput) {
    weatherInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        fetchWeather();
      }
    });
  }
});

async function fetchWeather() {
  const city = document.getElementById("weatherInput").value;
  const resultDiv = document.getElementById("weatherResult");
  if (!city) return;

  resultDiv.innerHTML = "<p>Loading...</p>";

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultDiv.innerHTML = "<p>City not found.</p>";
      return;
    }

    const lat = geoData.results[0].latitude;
    const lon = geoData.results[0].longitude;
    const cityName = geoData.results[0].name;

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    const weatherCode = current.weathercode;
    let emoji = "☁️";
    let condition = "Cloudy";
    
    if (weatherCode === 0) { emoji = "☀️"; condition = "Clear"; }
    else if (weatherCode > 0 && weatherCode <= 3) { emoji = "⛅"; condition = "Partly Cloudy"; }
    else if (weatherCode >= 51 && weatherCode <= 67) { emoji = "🌧️"; condition = "Rain"; }
    else if (weatherCode >= 71 && weatherCode <= 77) { emoji = "❄️"; condition = "Snow"; }
    else if (weatherCode >= 95 && weatherCode <= 99) { emoji = "⛈️"; condition = "Thunderstorm"; }

    resultDiv.innerHTML = `
      <h3 style="margin: 5px 0 0 0; color: #ffb3d9;">${cityName}</h3>
      <div style="font-size: 55px; margin: 10px 0; text-shadow: 0px 0px 10px rgba(255,255,255,0.2);">${emoji}</div>
      <p style="margin: 0; font-size: 26px; font-weight: bold;">${current.temperature}°C</p>
      <p style="margin: 5px 0 0 0; color: #7cbeff;">${condition}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = "<p>Error fetching weather.</p>";
  }
}

let display = document.getElementById('calcDisplay');

function calcInput(value) {
  display.value += value;
}

function calcClear() {
  display.value = "";
}

function calcCalculate() {
  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = "error";
  } 
}

let timerInterval = null;
let timerTime = 0; 

function updateTimerDisplay() {
  const hrs = String(Math.floor(timerTime / 3600000)).padStart(2, '0');
  const mins = String(Math.floor((timerTime % 3600000) / 60000)).padStart(2, '0');
  const secs = String(Math.floor((timerTime % 60000) / 1000)).padStart(2, '0');
  const ms = String(timerTime % 1000).padStart(3, '0');
  document.getElementById("timerDisplay").innerText = `${hrs}:${mins}:${secs}.${ms}`;
}

function startTimer() {
  if (timerInterval !== null) return;
  timerInterval = setInterval(() => {
    timerTime += 10;
    updateTimerDisplay();
  }, 10); 
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerTime = 0;
  updateTimerDisplay();
}

let tttBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "🌎";
let gameActive = true;
let isBotMode = false;
let isBotThinking = false;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
];

function setTTTMode(botMode) {
  isBotMode = botMode;
  document.getElementById('modePlayerBtn').style.background = botMode ? 'rgba(255,255,255,0.1)' : 'rgba(242,12,242,0.3)';
  document.getElementById('modeBotBtn').style.background = botMode ? 'rgba(124,190,255,0.3)' : 'rgba(255,255,255,0.1)';
  resetTicTacToe();
}

function initTicTacToe() {
  const boardElement = document.getElementById("tttBoard");
  boardElement.innerHTML = "";
  tttBoard.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.style.cssText = "height: 60px; background: rgba(0,0,0,0.5); border: 1px solid violet; border-radius: 5px; display: flex; justify-content: center; align-items: center; font-size: 30px; cursor: pointer;";
    cellElement.onclick = () => handleCellClick(index, cellElement);
    boardElement.appendChild(cellElement);
  });
}

function handleCellClick(index, cellElement) {
  if (tttBoard[index] !== "" || !gameActive || isBotThinking) return;
  
  tttBoard[index] = currentPlayer;
  cellElement.innerText = currentPlayer;
  checkWin();

  if (isBotMode && gameActive && currentPlayer === "🌕") {
    isBotThinking = true;
    document.getElementById("tttStatus").innerText = "Bot is thinking...";
    setTimeout(makeBotMove, 600);
  }
}

function makeBotMove() {
  if (!gameActive) return;
  let bestMove = -1;
  function findWinningMove(playerSymbol) {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (tttBoard[a] === playerSymbol && tttBoard[b] === playerSymbol && tttBoard[c] === "") return c;
      if (tttBoard[a] === playerSymbol && tttBoard[c] === playerSymbol && tttBoard[b] === "") return b;
      if (tttBoard[b] === playerSymbol && tttBoard[c] === playerSymbol && tttBoard[a] === "") return a;
    }
    return -1;
  }
  bestMove = findWinningMove("🌕");
  if (bestMove === -1) bestMove = findWinningMove("🌎");
  if (bestMove === -1 && tttBoard[4] === "") bestMove = 4;
  if (bestMove === -1) {
    let emptyCells = [];
    tttBoard.forEach((cell, i) => { if (cell === "") emptyCells.push(i); });
    if (emptyCells.length > 0) {
      bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }

  if (bestMove !== -1) {
    tttBoard[bestMove] = currentPlayer;
    const cells = document.getElementById("tttBoard").children;
    cells[bestMove].innerText = currentPlayer;
    isBotThinking = false;
    
    if(typeof clickSound !== 'undefined') {
      clickSound.currentTime = 0;
      clickSound.play().catch(e=>{});
    }

    checkWin();
  }
}

function checkWin() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) roundWon = true;
  }
  
  if (roundWon) {
    document.getElementById("tttStatus").innerText = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }
  if (!tttBoard.includes("")) {
    document.getElementById("tttStatus").innerText = "It's a Draw!";
    gameActive = false;
    return;
  }
  
  currentPlayer = currentPlayer === "🌎" ? "🌕" : "🌎";
  document.getElementById("tttStatus").innerText = `Player ${currentPlayer}'s Turn`;
}

function resetTicTacToe() {
  tttBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "🌎";
  gameActive = true;
  isBotThinking = false;
  document.getElementById("tttStatus").innerText = `Player 🌎's Turn`;
  initTicTacToe();
}
initTicTacToe();

let currentCalendarDate = new Date();

function buildCalendar() {
  const month = currentCalendarDate.getMonth();
  const year = currentCalendarDate.getFullYear();
  const today = new Date();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.getElementById("monthYearDisplay").innerText = `${monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = document.getElementById("calendarDays");
  calendarDays.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    calendarDays.appendChild(document.createElement("div"));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayCell = document.createElement("div");
    dayCell.innerText = i;
    dayCell.style.padding = "5px";

    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayCell.style.background = "rgba(242, 12, 242, 0.5)";
      dayCell.style.borderRadius = "5px";
    }
    calendarDays.appendChild(dayCell);
  }
}

function prevMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  buildCalendar();
}

function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  buildCalendar();
}

buildCalendar();

document.addEventListener('click', function(event) {
  const isClickable = event.target.closest('button') || event.target.closest('[onclick]');
  
  if (isClickable) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => {});
  }
});

const polarisAudio = document.getElementById("polarisAudio");
const playPauseBtn = document.getElementById("playPauseBtn");
const audioSlider = document.getElementById("audioSlider");
const audioTimeDisplay = document.getElementById("audioTimeDisplay");
const recordArt = document.getElementById("recordArt");
const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");

let recordRotation = 0;
let recordInterval;
let currentSongIndex = 0;

const playlist = [
  { title: "Never gonna give you up", artist: "Rick Astley", src: "./songs/Never gonna give you up.mp3" },
  { title: "Island in the sun", artist: "Weezer", src: "./songs/island in the sun.mp3" },
  { title: "sure thing", artist: "Miguel", src: "./songs/sure thing.mp3" },
  { title: "Wonderwall", artist: "Oasis", src: "./songs/wonderwall.mp3" },
  { title: "chicago", artist: "Michael Jackson", src: "./songs/chicago.mp3" }
];

function loadSong(index) {
  polarisAudio.src = playlist[index].src;
  musicTitle.innerText = playlist[index].title;
  musicArtist.innerText = playlist[index].artist;
  audioSlider.value = 0;
  audioTimeDisplay.innerText = "0:00";
}

loadSong(currentSongIndex);

function togglePlayPause() {
  if (polarisAudio.paused) {
    polarisAudio.play();
    playPauseBtn.innerText = "⏸";
    
    recordInterval = setInterval(() => {
      recordRotation += 1;
      recordArt.style.transform = `rotate(${recordRotation}deg)`;
    }, 20);
  } else {
    polarisAudio.pause();
    playPauseBtn.innerText = "▶";
    clearInterval(recordInterval);
  }
}

function prevSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) currentSongIndex = playlist.length - 1;
  
  loadSong(currentSongIndex);
  if (playPauseBtn.innerText === "⏸") polarisAudio.play(); 
}

function nextSong() {
  currentSongIndex++;
  if (currentSongIndex > playlist.length - 1) currentSongIndex = 0;
  
  loadSong(currentSongIndex);
  if (playPauseBtn.innerText === "⏸") polarisAudio.play();
}

polarisAudio.addEventListener("ended", nextSong);

polarisAudio.addEventListener("timeupdate", () => {
  const current = polarisAudio.currentTime;
  const duration = polarisAudio.duration;
  
  if (!isNaN(duration)) {
    audioSlider.value = (current / duration) * 100;
    
    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60).toString().padStart(2, '0');
    audioTimeDisplay.innerText = `${mins}:${secs}`;
  }
});

audioSlider.addEventListener("input", () => {
  const duration = polarisAudio.duration;
  if (!isNaN(duration)) {
    polarisAudio.currentTime = (audioSlider.value / 100) * duration;
  }
});