setInterval(function () {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}, 1000);

dragElement(document.getElementById("window1"));
dragElement(document.getElementById("window2"));
dragElement(document.getElementById("calcWindow"));

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

dragElement(document.getElementById("notesWindow"));

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

let display = document.getElementById('calcDisplay')

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

dragElement(document.getElementById('TimerWindow'));

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
