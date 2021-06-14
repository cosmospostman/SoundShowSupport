 // Global state variables
let osc;
let frequency;
let frequencySlider;
let isPlaying = false;
let isSliding = false;
let isCameraControlled = false;

let table_notesLookup;
let noteFrequencies = {};

let table_overTheRainbow;

var websocket;

function preload() {
  font_sharetech = loadFont('fonts/ShareTechMono-Regular.ttf');
  table_notesLookup = loadTable('data/notes.csv', 'csv');
  table_overTheRainbow = loadTable('data/overtherainbow.csv', 'csv');
}

function loadNoteFrequencies() {
  table_notesLookup.rows.forEach(function(e) {
    let name = e.arr[0] + e.arr[1];
    let freq = e.arr[2];
    noteFrequencies[name] = freq;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// setup() is called by p5js once at program start.
function setup() {
  loadNoteFrequencies();

  // Canvas and oscillator
  let cnv = createCanvas(windowWidth, windowHeight);
  osc = new p5.Oscillator('square');
  osc.amp(1.0);

  // Add frequency slider
  frequencySlider = createSlider(1, 30000);
  frequencySlider.position(20, windowHeight - 50);
  frequencySlider.mousePressed(function() {
    isSliding = true;
  });
  frequencySlider.mouseReleased(function() {
    isSliding = false;
  });
    frequencySlider.touchStarted(function() {
    isSliding = true;
  });
  frequencySlider.touchEnded(function() {
    isSliding = false;
  });

  // BACK
  playStopButton = createButton('Back');
  playStopButton.position(20, 20);
  playStopButton.mousePressed(backPressed);
  playStopButton.class('button');

  // PLAY/STOP
  playStopButton = createButton('Play/Stop');
  playStopButton.position(110, 20);
  playStopButton.mousePressed(playStopPressed);
  playStopButton.class('button');

  // NETWORK SETUP
  controlSourceButton = createButton('LOC');
  controlSourceButton.position(200, 20);
  controlSourceButton.mousePressed(function(){
    isCameraControlled = !isCameraControlled;
    controlSourceButton.elt.innerText = isCameraControlled ? "CAM" : "LOC";
    if (isCameraControlled) {
      connectWebSocket();
      frequencySlider.hide();
    } else {
      closeWebSocket();
      frequencySlider.show();
    }
  });
  controlSourceButton.class('button');

  // LESS FREQ
  minusButton = createButton('-');
  minusButton.position(290, 20);
  minusButton.mousePressed(function(){
    incOrDecFrequency("-");
  });
  minusButton.class('button');

  // MORE FREQ
  plusButton = createButton('+');
  plusButton.position(350, 20);
  plusButton.mousePressed(function(){
    incOrDecFrequency("+");
  });
  plusButton.class('button');

  // RAINBOWS
  rainbowButton = createButton('RBW');
  rainbowButton.position(410, 20);
  rainbowButton.mousePressed(function(){
    playOverTheRainbow();
  });
  rainbowButton.class('button');

  notes = [
    ['C', 261.63],
    ['D', 293.66],
    ['E', 329.63],
    ['F', 349.23],
    ['G', 392.00],
    ['A', 440.00],
    ['B', 493.88],
    ['C', 523.25] ];
    noteButtonList(notes);
}

function noteButtonList(notes) {
  let i=0;
  notes.forEach(function(n) {
    button = createButton(n[0]);
    button.position(500+60*i++, 20);
    button.class('button');
    button.mousePressed(function(){
      setFrequency(n[1]);
    });
  });
}

function setFrequency(freq) {
  f = Math.round(freq);
  frequencySlider.value(2000*Math.log2(f));
}

// Handle clicks on -+ buttons
function incOrDecFrequency(button) {
  f = Math.round(getFrequency());
  if (button == '+') { f++; }
  else if (button == '-') { 
    if (f == 1) { return; }
    f--; 
  }
  frequencySlider.value(2000*Math.log2(f));
}

// Decide which source to prefer for frequency value, called from draw()
function getFrequency() {
  return Math.round(Math.pow(2, (frequencySlider.value() / 2000)));
}

function backPressed() {
  window.location.href = '/';
}

// Toggle the oscillator on or off.
function playStopPressed() {
  if (isPlaying) {
    // Stop playing
    osc.stop();
  } else {
    // Start playing
    osc.start();
  }
  isPlaying = !isPlaying;
}

// draw() is called by p5js continuously.
// We also use it to update the oscillator frequency.
function draw() {
  background(color(179, 207, 213));
  frequencySlider.style('width', windowHeight-80 + 'px');
  frequencySlider.style('transform', 'rotate(-90deg)');
  frequencySlider.style('transform-origin', '16px 25px');

  playStopButton.elt.innerText = isPlaying ? "Stop" : "Play";

  f = getFrequency();
  osc.freq(f);
  
  if (f != undefined) {
    //textSize(12);
    //text('Frequency', 20, 20);
    textSize(300);
    textFont(font_sharetech);
    textAlign(CENTER, CENTER);
    text(nfc(f), windowWidth/2, windowHeight/2 - 100);
    textSize(200);
    text("Hz", windowWidth/2, windowHeight/2 + 150);
  }

  let rectLength = windowWidth-40;
}

function getWebSocketAddress() {
  return 'ws://' + 192.168.43.158 + ':8000/synth/frequency'
}

function connectWebSocket() {
  socket = new WebSocket(getWebSocketAddress());
  // Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    if (isCameraControlled) {
      setFrequency(event.data);
    }
  });
}

function closeWebSocket() {
  //socket.close();
}

function playOverTheRainbow() {
  isPlaying = true;
  osc.start();
  let time = 0;
  let time_adjustment = 0.5;
  table_overTheRainbow.rows.forEach(function(e) {
    let note = e.arr[0];
    console.log("Processed " + note + " timeout " + time);
    setTimeout(function(){
      console.log("Playing " + noteFrequencies[note]);
      setFrequency(noteFrequencies[note]);
    }, time);
    time = time + time_adjustment * parseInt(e.arr[1]);
  });

  setTimeout(function(){
    isPlaying = false;
    osc.stop()
  }, time);

}