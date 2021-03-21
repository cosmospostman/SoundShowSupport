// Global state variables
let osc;
let frequency;
let frequencySlider;
let isPlaying = false;
let adminMode = false;
let isSliding = false;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// setup() is called by p5js once at program start.
function setup() {
  // Check url params for ?admin=true
  let params = getURLParams();
  adminMode = params.admin;

  // Canvas and oscillator
  let cnv = createCanvas(windowWidth, windowHeight);
  osc = new p5.Oscillator('square');
  osc.amp(1.0);

  // Add frequency slider
  frequencySlider = createSlider(1, 30000);
  frequencySlider.position(360, 18);
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

  // Add play/stop button
  playStopButton = createButton('Back');
  playStopButton.position(20, 20);
  playStopButton.mousePressed(backPressed);
  playStopButton.class('button');

  // Add play/stop button
  playStopButton = createButton('Play/Stop');
  playStopButton.position(110, 20);
  playStopButton.mousePressed(playStopPressed);
  playStopButton.class('button');

  // Add play/stop button
  minusButton = createButton('-');
  minusButton.position(230, 20);
  minusButton.mousePressed(function(){
    setFrequency("-");
  });
  minusButton.class('button');

    // Add play/stop button
  plusButton = createButton('+');
  plusButton.position(290, 20);
  plusButton.mousePressed(function(){
    setFrequency("+");
  });
  plusButton.class('button');

}


// Handle clicks on -+ buttons
function setFrequency(freq) {
  f = Math.round(getFrequency());
  if (freq == '+') { f++; }
  else if (freq == '-') { f--; }
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

function preload() {
  font_sharetech = loadFont('fonts/ShareTechMono-Regular.ttf');
}

// draw() is called by p5js continuously.
// We also use it to update the oscillator frequency.
function draw() {
  background(color(179, 207, 213));
  frequencySlider.style('width', windowWidth-380 + 'px');

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

function drawDots(rectLength, freq) {
  let d = 10;
  let x = 20;
  let y = 100 + 50;

  let gap = (rectLength - d) / (freq + 1);

  for (let i=0; i<freq; i++) {
    circle(x + 5 + gap*(i+1), y, d)
  }
}
