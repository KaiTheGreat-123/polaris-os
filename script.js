setInterval(function () {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}, 1000);

dragElement(document.getElementById("window1"));
dragElement(document.getElementById("window2"));
dragElement(document.getElementById("calcWindow"));
dragElement(document.getElementById("notesWindow"));
dragElement(document.getElementById('TimerWindow'));
dragElement(document.getElementById("tictactoeWindow"));
dragElement(document.getElementById("calendarWindow"));

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

function openWindow(windowId) {
  document.getElementById(windowId).style.display = "block";
}

function closeWindow(windowId) {
  document.getElementById(windowId).style.display = "none";
}


let selectedIcon = undefined;

function handleIconTap(element) {
  if (selectedIcon !== undefined && selectedIcon !== element) {
    selectedIcon.classList.remove("selected");
  }
  
  if (element.classList.contains("selected")) {
    element.classList.remove("selected");
    selectedIcon = undefined;
  } else {
    element.classList.add("selected");
    selectedIcon = element;
  }
}

let zIndexCounter = 1;

function bringToFront(element) {
  zIndexCounter++;
  element.style.zIndex = zIndexCounter;
}

let display = document.getElementById('calcDisplay');

function calcInput(value) {
  display.value += value;
}

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
let timerSeconds = 0;

function updateTimerDisplay() {
  const hrs = String(Math.floor(timerSeconds/3600)).padStart(2,'0');
  const mins = String(Math.floor((timerSeconds % 3600)/60)).padStart(2,'0');
  const secs = String(Math.floor(timerSeconds % 60)).padStart(2,'0');

  document.getElementById("timerDisplay").innerText = `${hrs}:${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval !== null) return;

  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  },1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  updateTimerDisplay();
}

let tttBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "🌎";
let gameActive = true;
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
];

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
  if (tttBoard[index] !== "" || !gameActive) return;
  tttBoard[index] = currentPlayer;
  cellElement.innerText = currentPlayer;
  checkWin();
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
  document.getElementById("tttStatus").innerText = `Player 🌎's Turn`;
  initTicTacToe();
}
initTicTacToe();

function buildCalendar() {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  
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
    
    if (i === date.getDate()) {
      dayCell.style.background = "rgba(242, 12, 242, 0.5)";
      dayCell.style.borderRadius = "5px";
    }
    calendarDays.appendChild(dayCell);
  }
}
buildCalendar()