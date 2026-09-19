// GLOBAL AUDIO & INITIALIZATION
const startupSound = new Audio('sfx/startup.mp3');
const clickSound = new Audio('sfx/click.mp3');
const calendarSound = new Audio('sfx/calendar.mp3');

document.addEventListener("DOMContentLoaded", function() {
  let progress = 0;
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingElements = document.getElementById("loadingElements");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const hudFill = document.getElementById("hudFill");
  const loadingText = document.getElementById("loadingText");

  setTimeout(() => {
    loadingScreen.classList.add("active");
  }, 50);

  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1; 

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      setTimeout(() => {
        loadingElements.style.display = "none";
        welcomeMessage.style.display = "flex";
        
        setTimeout(() => welcomeMessage.style.opacity = "1", 50);
        loadingScreen.style.cursor = "pointer";

        loadingScreen.addEventListener("click", function launchDesktop() {
          startupSound.currentTime = 0;
          startupSound.play().catch(e => console.log(e));

          loadingScreen.classList.add("exiting");
          
          welcomeMessage.style.opacity = "0";

          setTimeout(() => {
            loadingScreen.style.opacity = "0";
            loadingScreen.style.transform = "scale(1.1)"; 

            setTimeout(() => {
              loadingScreen.style.display = "none";
            }, 800);
          }, 600);
          
        }, { once: true });

      }, 400);
    }
    
    hudFill.style.width = progress + "%";
    loadingText.innerText = progress + "%";
  }, 40); 
});

function triggerStarConfetti() {
  unlockAchievement('confetti');
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
    setTimeout(() => star.remove(), 5000);
  }
}

// WINDOW MANAGEMENT & DRAGGING LOGIC
let zIndexCounter = 20;

function bringToFront(element) {
  zIndexCounter++;
  element.style.zIndex = zIndexCounter;
}

function toggleWindow(windowId) {
  const element = document.getElementById(windowId);
  const isHidden = window.getComputedStyle(element).display === "none" || element.style.opacity === "0";
  if (isHidden) {
    openWindow(windowId);
  } else {
    closeWindow(windowId);
  }
}

function openWindow(windowId) {
  if(windowId === 'calendarWindow') { document.getElementById('timeElement').click(); return; }
  const element = document.getElementById(windowId);
  element.style.opacity = "0";
  element.style.display = "block";
  element.style.transition = "opacity 0.3s ease-in-out";
  bringToFront(element);

  openedApps.add(windowId);
  saveAchievementState();
  if (allAppIds.every(id => openedApps.has(id))) unlockAchievement('explorer');

  setTimeout(() => {
    element.style.opacity = "1";
    if (windowId === 'terminalWindow') {
      const input = document.getElementById('terminalInput');
      if (input) input.focus();
    }
  }, 10);
}

function closeWindow(windowId) {
  if(windowId === 'calendarWindow') { document.getElementById('timeElement').click(); return; }
  const element = document.getElementById(windowId);
  element.style.opacity = "0";
  setTimeout(() => element.style.display = "none", 300);
}

function dragElement(element) {
  if (!element) return;
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header");

  if (header) header.onmousedown = startDragging;
  else element.onmousedown = startDragging;

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

// drag logic to all windows
['infoWindow', 'weatherWindow', 'calcWindow', 'notesWindow', 'musicWindow', 'TimerWindow', 'tictactoeWindow', 'galleryWindow', 'terminalWindow', 'settingsWindow', 'dictWindow','achievementsWindow'].forEach(id => {
  dragElement(document.getElementById(id));
});

//SYSTEM SETTINGS
const sysSettings = {
  clock24: false,
  termUser: "admin",
  particleSpeed: 1,
  particleDist: 120,
  particleCount: 200
};

function hexToRgb(hex) {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

document.getElementById('themeColorPicker')?.addEventListener('input', (e) => {
  document.documentElement.style.setProperty('--theme-rgb', hexToRgb(e.target.value));
  unlockAchievement('painter');
});

document.getElementById('resetColorBtn')?.addEventListener('click', () => {
  document.documentElement.style.setProperty('--theme-rgb', '181, 126, 220');
  document.getElementById('themeColorPicker').value = '#b57edc';
});

document.getElementById('particleCount')?.addEventListener('input', (e) => {
  sysSettings.particleCount = parseInt(e.target.value);
  document.getElementById('particleCountVal').innerText = sysSettings.particleCount;
  initParticles(); 
});

document.getElementById('particleSpeed')?.addEventListener('input', (e) => {
  sysSettings.particleSpeed = parseFloat(e.target.value);
  document.getElementById('particleSpeedVal').innerText = sysSettings.particleSpeed + 'x';
});

document.getElementById('particleDist')?.addEventListener('input', (e) => {
  sysSettings.particleDist = parseInt(e.target.value);
  document.getElementById('particleDistVal').innerText = sysSettings.particleDist;
});

document.getElementById('showDesktopTitle')?.addEventListener('change', (e) => {
  const titleEl = document.querySelector('.desktop-title');
  if (titleEl) {
    titleEl.style.display = e.target.checked ? 'block' : 'none';
  }
});

document.getElementById('clockFormat')?.addEventListener('change', (e) => {
  sysSettings.clock24 = e.target.value === "24";
});

document.getElementById('termUser')?.addEventListener('input', (e) => {
  sysSettings.termUser = e.target.value.trim() || "admin";
  document.getElementById('terminalPrompt').innerText = `${sysSettings.termUser}@polaris:~$`;
});


// BACKGROUND CANVAS (SPACE PARTICLES)
const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
let width, height;
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("mouseout", () => { mouse.x = -1000; mouse.y = -1000; });

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.density = (Math.random() * 30) + 1;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }
  draw() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.closePath(); ctx.fill();
  }
  
  update() {
    this.x += this.vx * sysSettings.particleSpeed; 
    this.y += this.vy * sysSettings.particleSpeed;
    
    if (this.x > width) this.x = 0; if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0; if (this.y < 0) this.y = height;

    let dx = mouse.x - this.x; let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;
    let forceDirectionX = dx / distance; let forceDirectionY = dy / distance;
    
    let maxDistance = sysSettings.particleDist;
    let force = (maxDistance - distance) / maxDistance;

    if (distance < maxDistance) {
      this.x -= forceDirectionX * force * this.density;
      this.y -= forceDirectionY * force * this.density;
    }
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < sysSettings.particleCount; i++) particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

//DESKTOP WIDGETS (CLOCK, TIME, CALENDAR, APOD)

// Digital Time on Taskbar
setInterval(() => {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString([], { 
    hour12: !sysSettings.clock24 
  });
}, 1000);

// Calendar Widget logic
const timeEl = document.getElementById("timeElement");
const calWindow = document.getElementById("calendarWindow");
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

  for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement("div"));

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
function prevMonth() { currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1); buildCalendar(); }
function nextMonth() { currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1); buildCalendar(); }
buildCalendar();

// Analog Clock Widget
let isClockOpen = true;
const clockWidget = document.getElementById('clockWidget');
const clockToggleBtn = document.getElementById('clockToggleBtn');

function toggleClock() {
  if (isClockOpen) {
    clockWidget.style.left = "-220px"; clockWidget.style.boxShadow = "none"; clockToggleBtn.style.transform = "rotate(0deg)";
  } else {
    clockWidget.style.left = "0px"; clockWidget.style.boxShadow = "5px 0 25px rgba(var(--theme-rgb), 0.4)"; clockToggleBtn.style.transform = "rotate(180deg)";
  }
  isClockOpen = !isClockOpen;
  if(typeof clickSound !== 'undefined') { clickSound.currentTime = 0; clickSound.play().catch(e=>{}); }
}

function updateAnalogClock() {
  const now = new Date();
  const seconds = now.getSeconds(); const minutes = now.getMinutes(); const hours = now.getHours();
  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;
  
  const secHand = document.getElementById('secondHand'); const minHand = document.getElementById('minuteHand'); const hrHand = document.getElementById('hourHand');
  if(secHand) secHand.style.transform = `translateX(-50%) rotate(${secondDegrees}deg)`;
  if(minHand) minHand.style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;
  if(hrHand) hrHand.style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
}
setInterval(updateAnalogClock, 1000);
updateAnalogClock();

// APOD Widget
let isApodOpen = true;
const apodWidget = document.getElementById('apodWidget');
const apodToggleBtn = document.getElementById('apodToggleBtn');

function toggleApod() {
  if (isApodOpen) {
    apodWidget.style.left = "-300px"; apodWidget.style.boxShadow = "none"; apodToggleBtn.style.transform = "rotate(0deg)";
  } else {
    apodWidget.style.left = "0px"; apodWidget.style.boxShadow = "5px 0 25px rgba(var(--theme-rgb), 0.4)"; apodToggleBtn.style.transform = "rotate(180deg)";
  }
  isApodOpen = !isApodOpen;
  if(typeof clickSound !== 'undefined') { clickSound.currentTime = 0; clickSound.play().catch(e=>{}); }
}

async function fetchApod() {
  const apiKey = "8NXdIUKNYlFNvAPOkaFBpyuUQKgFgJnnMKDGaLdz";
  try {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateStr}`);
    const data = await response.json();

    if (!response.ok || data.error) throw new Error(data.error?.message || `HTTP ${response.status}`);

    const [y, m, d] = data.date.split("-");
    const apodPageUrl = `https://apod.nasa.gov/apod/ap${y.slice(2)}${m}${d}.html`;

    document.getElementById('apodTitle').innerHTML = `<a href="${apodPageUrl}" target="_blank" style="color:white; text-decoration:none;">${data.title}</a>`;
    document.getElementById('apodDate').innerText = data.date;

    const imgElement = document.getElementById('apodImg');
    const videoBtn = document.getElementById('apodVideoBtn');
    const videoFrame = document.getElementById('apodVideoFrame');
    
    if (data.media_type === "image") {
     imgElement.src = data.url;
     imgElement.loading = "lazy";
     imgElement.style.display = "block";
     imgElement.style.cursor = "pointer";
     imgElement.onclick = () => window.open(data.hdurl || apodPageUrl, "_blank");
     videoFrame.style.display = "none"; videoBtn.style.display = "none";
    } else {
      imgElement.style.display = "none";
      if (data.url && (data.url.includes("youtube.com") || data.url.includes("vimeo.com"))) {
        videoFrame.src = data.url; videoFrame.style.display = "block";
      } else {
        videoFrame.style.display = "none";
      }
      videoBtn.style.display = "block"; videoBtn.href = apodPageUrl;
    }
  } catch (error) {
    const titleObj = document.getElementById('apodTitle');
    if (titleObj) titleObj.innerText = `Failed to load APOD: ${error.message}`;
  }
}
fetchApod();

// APPLICATIONS LOGIC

// Dictionary App
document.getElementById("dictInput")?.addEventListener("keypress", function(event) {
  if (event.key === "Enter") { event.preventDefault(); fetchDictionary(); }
});

async function fetchDictionary(customWord) {
  dictLookupCount++;
  saveAchievementState();
  if (dictLookupCount >= 5) unlockAchievement('curious');
  const word = (typeof customWord === "string") ? customWord : document.getElementById("dictInput").value.trim();
  const resultDiv = document.getElementById("dictResult");
  if (!word) return;
  
  if (typeof customWord !== "string") resultDiv.innerHTML = "<p class='text-center'>Searching...</p>";

  try {
    const res = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=d&max=1`);
    if (!res.ok) {
      resultDiv.innerHTML = "<p class='text-center'>Network error.</p>";
      return;
    }
    
    const data = await res.json();
    
    if (data.length === 0 || !data[0].defs) {
      resultDiv.innerHTML = "<p class='text-center'>Word not found.</p>";
      return;
    }
    
    const entry = data[0];
    let html = `<h3 class="dict-word">${entry.word}</h3><ul>`;

    entry.defs.slice(0, 3).forEach(def => {
      const parts = def.split('\t');
      const pos = parts.length > 1 ? `<span class="dict-pos">[${parts[0]}]</span> ` : '';
      const definition = parts.length > 1 ? parts[1] : parts[0];
      html += `<li class="dict-def">${pos}${definition}</li>`;
    });

    html += `</ul>`;
    resultDiv.innerHTML = html;
    document.getElementById("dictInput").value = word;
  } catch (err) {
    resultDiv.innerHTML = "<p class='text-center'>Error fetching definition.</p>";
  }
}

// Weather App
document.getElementById("weatherInput")?.addEventListener("keypress", function(event) {
  if (event.key === "Enter") { event.preventDefault(); fetchWeather(); }
});

async function fetchWeather() {
  const city = document.getElementById("weatherInput").value;
  const resultDiv = document.getElementById("weatherResult");
  if (!city) return;
  resultDiv.innerHTML = "<p>Loading...</p>";

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) { resultDiv.innerHTML = "<p>City not found.</p>"; return; }

    const lat = geoData.results[0].latitude; const lon = geoData.results[0].longitude; const cityName = geoData.results[0].name;
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    const weatherCode = current.weathercode;
    let emoji = "☁️", condition = "Cloudy";
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

// Calculator
let display = document.getElementById('calcDisplay');
function calcInput(value) { display.value += value; }
function calcClear() { display.value = ""; }
function calcCalculate() {
  try { display.value = eval(display.value); } catch (error) { display.value = "error"; }
}

// Timer App
let timerInterval = null, timerTime = 0; 
function updateTimerDisplay() {
  const hrs = String(Math.floor(timerTime / 3600000)).padStart(2, '0');
  const mins = String(Math.floor((timerTime % 3600000) / 60000)).padStart(2, '0');
  const secs = String(Math.floor((timerTime % 60000) / 1000)).padStart(2, '0');
  const ms = String(timerTime % 1000).padStart(3, '0');
  document.getElementById("timerDisplay").innerText = `${hrs}:${mins}:${secs}.${ms}`;
}
function startTimer() {
  if (timerInterval !== null) return;
  timerInterval = setInterval(() => { timerTime += 10; updateTimerDisplay(); }, 10); 
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
function resetTimer() { stopTimer(); timerTime = 0; updateTimerDisplay(); }

// Tic Tac Toe
let tttBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "🌎", gameActive = true, isBotMode = false, isBotThinking = false;
const winningConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function setTTTMode(botMode) {
  isBotMode = botMode;
  document.getElementById('modePlayerBtn').className = `os-btn flex-1 ${botMode ? 'bg-transparent' : 'bg-pink-light'}`;
  document.getElementById('modeBotBtn').className = `os-btn flex-1 ${botMode ? 'bg-blue-light' : 'bg-transparent'}`;
  resetTicTacToe();
}

function initTicTacToe() {
  const boardElement = document.getElementById("tttBoard");
  boardElement.innerHTML = "";
  tttBoard.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.className = "ttt-cell";
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
    if (emptyCells.length > 0) bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  if (bestMove !== -1) {
    tttBoard[bestMove] = currentPlayer;
    const cells = document.getElementById("tttBoard").children;
    cells[bestMove].innerText = currentPlayer;
    isBotThinking = false;
    if(typeof clickSound !== 'undefined') { clickSound.currentTime = 0; clickSound.play().catch(e=>{}); }
    checkWin();
  }
}

function checkWin() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) roundWon = true;
  }
  if (roundWon && isBotMode && currentPlayer === "🌎") unlockAchievement('champion');
  if (roundWon) { document.getElementById("tttStatus").innerText = `Player ${currentPlayer} Wins!`; gameActive = false; return; }
  if (!tttBoard.includes("")) { document.getElementById("tttStatus").innerText = "It's a Draw!"; gameActive = false; return; }
  currentPlayer = currentPlayer === "🌎" ? "🌕" : "🌎";
  document.getElementById("tttStatus").innerText = `Player ${currentPlayer}'s Turn`;
}

function resetTicTacToe() {
  tttBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "🌎"; gameActive = true; isBotThinking = false;
  document.getElementById("tttStatus").innerText = `Player 🌎's Turn`;
  initTicTacToe();
}
initTicTacToe();

// Music Player
const polarisAudio = document.getElementById("polarisAudio");
const playPauseBtn = document.getElementById("playPauseBtn");
const audioSlider = document.getElementById("audioSlider");
const audioTimeDisplay = document.getElementById("audioTimeDisplay");
const recordArt = document.getElementById("recordArt");
const playlistContainer = document.getElementById("playlistContainer");

let recordRotation = 0, recordInterval, currentSongIndex = 0;
const playlist = [
  { title: "Never gonna give you up", artist: "Rick Astley", src: "./songs/Never gonna give you up.mp3" },
  { title: "Island in the sun", artist: "Weezer", src: "./songs/island in the sun.mp3" },
  { title: "sure thing", artist: "Miguel", src: "./songs/sure thing.mp3" },
  { title: "Wonderwall", artist: "Oasis", src: "./songs/wonderwall.mp3" },
  { title: "chicago", artist: "Michael Jackson", src: "./songs/chicago.mp3" },
  { title: "Shape of You", artist: "Ed Sheeran", src: "./songs/shape of you.mp3" },
  { title: "Blinding Lights", artist: "The Weeknd", src: "./songs/blinding lights.mp3" },
  { title: "Levitating", artist: "Dua Lipa", src: "./songs/levitating.mp3" },
  { title: "like a tattoo", artist: "Sade", src: "./songs/like a tattoo.mp3" }
];

function renderPlaylist() {
  if(!playlistContainer) return;
  playlistContainer.innerHTML = "";
  playlist.forEach((song, index) => {
    const item = document.createElement("div");
    item.innerText = `${song.title} - ${song.artist}`;
    item.style.cssText = "padding:8px; color:white; font-family:'Courier New', monospace; font-size:12px; cursor:pointer; border-bottom:1px solid rgba(var(--theme-rgb), 0.3); border-radius:4px; transition:background 0.2s;";
    item.onmouseenter = () => { if (currentSongIndex !== index) item.style.background = "rgba(var(--theme-rgb), 0.2)"; };
    item.onmouseleave = () => { if (currentSongIndex !== index) item.style.background = "transparent"; };

    item.onclick = () => {
      currentSongIndex = index; loadSong(index); polarisAudio.play(); playPauseBtn.innerText = "⏸";
      clearInterval(recordInterval);
      recordInterval = setInterval(() => { recordRotation += 1; recordArt.style.transform = `rotate(${recordRotation}deg)`; }, 20);
    };
    playlistContainer.appendChild(item);
  });
}

function loadSong(index) {
  if(!polarisAudio) return;
  polarisAudio.src = playlist[index].src;
  document.getElementById("musicTitle").innerText = playlist[index].title;
  document.getElementById("musicArtist").innerText = playlist[index].artist;
  audioSlider.value = 0; audioTimeDisplay.innerText = "0:00";
  
  if (playlistContainer) {
    Array.from(playlistContainer.children).forEach((child, i) => {
      if (i === index) { child.style.background = "rgba(var(--theme-rgb), 0.5)"; child.style.fontWeight = "bold"; }
      else { child.style.background = "transparent"; child.style.fontWeight = "normal"; }
    });
  }
}
renderPlaylist();
loadSong(currentSongIndex);

function togglePlayPause() {
  if (polarisAudio.paused) {
    polarisAudio.play(); playPauseBtn.innerText = "⏸";
    recordInterval = setInterval(() => { recordRotation += 1; recordArt.style.transform = `rotate(${recordRotation}deg)`; }, 20);
  } else {
    polarisAudio.pause(); playPauseBtn.innerText = "▶"; clearInterval(recordInterval);
  }
}
function prevSong() {
  currentSongIndex--; if (currentSongIndex < 0) currentSongIndex = playlist.length - 1;
  loadSong(currentSongIndex); if (playPauseBtn.innerText === "⏸") polarisAudio.play(); 
}
function nextSong() {
  currentSongIndex++; if (currentSongIndex > playlist.length - 1) currentSongIndex = 0;
  loadSong(currentSongIndex); if (playPauseBtn.innerText === "⏸") polarisAudio.play();
}

if(polarisAudio) {
  polarisAudio.addEventListener("ended", nextSong);
  polarisAudio.addEventListener("timeupdate", () => {
    const current = polarisAudio.currentTime; const duration = polarisAudio.duration;
    if (!isNaN(duration)) {
      audioSlider.value = (current / duration) * 100;
      const mins = Math.floor(current / 60); const secs = Math.floor(current % 60).toString().padStart(2, '0');
      audioTimeDisplay.innerText = `${mins}:${secs}`;
    }
  });
}
if(audioSlider) {
  audioSlider.addEventListener("input", () => {
    const duration = polarisAudio.duration; if (!isNaN(duration)) polarisAudio.currentTime = (audioSlider.value / 100) * duration;
  });
}

// Volume Controls
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
let previousVolume = 1;

function toggleMute() {
  if (!polarisAudio) return;
  
  if (polarisAudio.volume > 0) {
    previousVolume = polarisAudio.volume;
    polarisAudio.volume = 0;
    volumeSlider.value = 0;
    muteBtn.innerText = "🔇";
  } else {
    polarisAudio.volume = previousVolume > 0 ? previousVolume : 1;
    volumeSlider.value = polarisAudio.volume;
    muteBtn.innerText = polarisAudio.volume > 0.5 ? "🔊" : "🔉";
  }
}

if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    const vol = parseFloat(e.target.value);
    polarisAudio.volume = vol;
    
    if (vol === 0) {
      muteBtn.innerText = "🔇";
    } else if (vol < 0.5) {
      muteBtn.innerText = "🔉";
    } else {
      muteBtn.innerText = "🔊";
    }
  });
}

// Gallery App
const galleryImages = [
  { src: "./gallery images/finding star.png", caption: "How to find the star" },
  { src: "./gallery images/telescope image.png", caption: "Picture of Polaris taken by @ianlauerastro on instagram" },
  { src: "./gallery images/close up.png", caption: "Close up view of Polaris" }
];
function preloadGalleryImages() { galleryImages.forEach(img => { new Image().src = img.src; }); }
preloadGalleryImages();

let currentGalleryIndex = 0;
const galleryTrack = document.getElementById("galleryTrack");
const galleryCaption = document.getElementById("galleryCaption");

function initGallery() {
  if(!galleryTrack) return;
  galleryTrack.innerHTML = "";
  galleryImages.forEach((img) => {
    const div = document.createElement("div");
    div.style.cssText = "min-width:100%; height:100%; background-size:cover; background-position:center;";
    const preloadImg = new Image();
    preloadImg.onload = () => { div.style.backgroundImage = `url('${img.src}')`; };
    preloadImg.src = img.src;
    galleryTrack.appendChild(div);
  });
  updateGalleryView();
}
function slideGallery(direction) {
  currentGalleryIndex += direction;
  if (currentGalleryIndex >= galleryImages.length) currentGalleryIndex = 0;
  else if (currentGalleryIndex < 0) currentGalleryIndex = galleryImages.length - 1;
  updateGalleryView();
}
function updateGalleryView() {
  if(!galleryTrack) return;
  galleryTrack.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;
  galleryCaption.innerText = galleryImages[currentGalleryIndex].caption;
}
initGallery();

// Terminal App
const termIn = document.getElementById("terminalInput");
const termOut = document.getElementById("terminalOutput");

if (termIn && termOut) {
  termIn.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      const commandLine = termIn.value.trim();
      termIn.value = "";
      if (commandLine === "") return;

      const outputLine = document.createElement("div");
      outputLine.innerHTML = `<span style="color: rgb(var(--theme-rgb));">${sysSettings.termUser}@polaris:~$</span> ${commandLine}`;
      termOut.appendChild(outputLine);

      const args = commandLine.split(" ");
      const cmd = args[0].toLowerCase();
      
      const responseLine = document.createElement("div");
      responseLine.style.color = "#7cbeff";
      responseLine.style.marginBottom = "5px";

      switch (cmd) {
        case "help": 
          responseLine.innerHTML = "Available commands:<br>help - Show this message<br>clear - Clear terminal<br>date - Show current date/time<br>whoami - Show current user<br>echo [text] - Print text<br>open [app] - Open an app (calc, music, weather, notes, tictactoe, gallery, terminal, settings, dictionary)<br>define [word] - Lookup definition"; 
          break;
        case "clear": termOut.innerHTML = ""; return;
        case "date": responseLine.innerText = new Date().toString(); break;
        case "whoami": responseLine.innerText = `${sysSettings.termUser} (Polaris Admin)`; break;
        case "echo": responseLine.innerText = args.slice(1).join(" "); break;
        case "define": {
          const searchWord = args.slice(1).join(" ");
          if (!searchWord) { 
            responseLine.innerText = "Usage: define [word]"; 
          } else { 
            openWindow('dictWindow'); 
            fetchDictionary(searchWord);
            responseLine.innerText = `Looking up "${searchWord}"...`;
          }
          break;
        }
        case "open": {
          if (args[1]) {
            const appMap = { "calc": "calcWindow", "music": "musicWindow", "weather": "weatherWindow", "notes": "notesWindow", "tictactoe": "tictactoeWindow", "gallery": "galleryWindow", "terminal": "terminalWindow", "settings": "settingsWindow", "dictionary": "dictWindow" };
            const targetWindow = appMap[args[1].toLowerCase()];
            if (targetWindow) { openWindow(targetWindow); responseLine.innerText = `Opened ${args[1]}.`; }
            else { responseLine.innerText = `App not found: ${args[1]}`; }
          } else { responseLine.innerText = "Usage: open [app]"; }
          break;
        }
        default: responseLine.innerText = `Command not found: ${cmd}`;
      }
      termOut.appendChild(responseLine);
      termOut.scrollTop = termOut.scrollHeight;
    }
  });
}
document.getElementById('terminalWindow')?.addEventListener('mousedown', () => {
  setTimeout(() => document.getElementById('terminalInput').focus(), 0);
});

// ACHIEVEMENTS SYSTEM
const achievementDefs = [
  { id: "explorer",   icon: "🗺️", name: "Explorer",        desc: "Open every app at least once" },
  { id: "painter",    icon: "🎨", name: "Interior Designer", desc: "Change the accent color" },
  { id: "champion",   icon: "🏆", name: "Undefeated",        desc: "Beat the Tic-Tac-Toe bot" },
  { id: "confetti",   icon: "🌟", name: "Party Starter",     desc: "Trigger star confetti" },
  { id: "nightowl",   icon: "🌌", name: "Deep Space",        desc: "Use Polaris after midnight" },
  { id: "curious",    icon: "📖", name: "Curious Mind",      desc: "Look up 5 dictionary words" },
];

const allAppIds = ['infoWindow','notesWindow','calcWindow','TimerWindow','tictactoeWindow','weatherWindow','musicWindow','galleryWindow','dictWindow','terminalWindow','settingsWindow'];

let unlockedAchievements = JSON.parse(localStorage.getItem('polarisAchievements') || '[]');
let openedApps = new Set(JSON.parse(localStorage.getItem('polarisOpenedApps') || '[]'));
let dictLookupCount = parseInt(localStorage.getItem('polarisDictCount') || '0');

function saveAchievementState() {
  localStorage.setItem('polarisAchievements', JSON.stringify(unlockedAchievements));
  localStorage.setItem('polarisOpenedApps', JSON.stringify([...openedApps]));
  localStorage.setItem('polarisDictCount', dictLookupCount.toString());
}

function unlockAchievement(id) {
  if (unlockedAchievements.includes(id)) return;
  unlockedAchievements.push(id);
  saveAchievementState();
  const def = achievementDefs.find(a => a.id === id);
  if (def) showAchievementToast(def);
  renderAchievements();
}

function showAchievementToast(def) {
  const toast = document.getElementById('achievementToast');
  if (!toast) return;
  toast.innerHTML = `<span class="achievement-icon">${def.icon}</span>
    <div><div class="achievement-name">Achievement Unlocked!</div>
    <div class="achievement-desc">${def.name} — ${def.desc}</div></div>`;
  toast.classList.add('show');
  if(typeof clickSound !== 'undefined') { clickSound.currentTime = 0; clickSound.play().catch(()=>{}); }
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function renderAchievements() {
  const list = document.getElementById('achievementsList');
  if (!list) return;
  list.innerHTML = achievementDefs.map(a => {
    const unlocked = unlockedAchievements.includes(a.id);
    return `<div class="achievement-item ${unlocked ? '' : 'locked'}">
      <span class="achievement-icon">${a.icon}</span>
      <div><p class="achievement-name">${a.name}</p><p class="achievement-desc">${a.desc}</p></div>
    </div>`;
  }).join('');
}
renderAchievements();

if (new Date().getHours() >= 0 && new Date().getHours() < 5) unlockAchievement('nightowl');