// Global state variables
let osc;
let frequency;
let frequencySlider;
let isPlaying = false;
let adminMode = false;
let isSliding = false;

// setup() is called by p5js once at program start.
function setup() {
  // Check url params for ?admin=true
  let params = getURLParams();
  adminMode = params.admin;

  // Canvas and oscillator
  let cnv = createCanvas(windowWidth, windowHeight - 40);
  osc = new p5.Oscillator('square');
  osc.amp(1.0);

  // Add frequency slider
  frequencySlider = createSlider(1, 440);
  frequencySlider.position(100, 26);
  frequencySlider.style('width', windowWidth-120 + 'px');
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
  playStopButton = createButton('Play/Stop');
  playStopButton.position(20, 55);
  playStopButton.mousePressed(playStopPressed);
  playStopButton.class('playStopButton');

  // Add some frequency shifting buttons
  notes = [ ['-', '-'],
            ['+', '+'],
            ['A', 110.00],
            ['B', 123.47],
            ['C', 130.81],
            ['D', 146.83],
            ['E', 164.81],
            ['F', 174.61],
            ['G', 196.00],
            ['A', 220.00] ];
  createNoteButtonList(notes);

  // Add extra controls if admin mode
  if (adminMode) {
    checkboxLocalSound = createCheckbox('Local sound', false);
    checkboxLocalSound.elt.onchange = function() {
      config.localSound = checkboxLocalSound.checked();
      invalidateConfig();
      setFirebaseConfig(config);
    };
    checkboxShowKeys = createCheckbox('Show keys', false);
    checkboxShowKeys.elt.onchange = function() {
      config.showKeys = checkboxShowKeys.checked();
      invalidateConfig();
      setFirebaseConfig(config);
    };
  }

  invalidateConfig();
}

function createNoteButtonList(notes) {
  let i=0;
  notes.forEach(function(n) {
    button = createButton(n[0]);
    button.position(100+30*i++, 55);
    button.mousePressed(function(){
      setFrequency(n[1]);
    });
    if (n[0] != '+' && n[0] != '-') {
      button.class('keys');
    }
  });
}

// Show or hide the play/stop button and frequency keys
// depending on the current config
function invalidateConfig() {
  select('.playStopButton').style('display', adminMode || config.localSound ? 'block' : 'none');
  selectAll('.keys').forEach(function(e) {
    e.style('display', config.showKeys ? 'block' : 'none');
  });
}


// Handle clicks on -+ABCDEFGA buttons and from Firebase.
// Set local state, update the slider, and Firebase if needed.
function setFrequency(freq) {
  if (freq != frequency) {
    if (freq == '+') { frequency++; }
    else if (freq == '-') { frequency--; }
    else { frequency = freq; }
    frequencySlider.value(frequency);
  }
  if (firebaseFrequency != freq) {
    setFirebaseFrequency(frequency);
  }
}

// Decide which source to prefer for frequency value, called from draw()
function getFrequency() {
  // Don't do anything until Firebase frequency is loaded
  if (firebaseFrequency === undefined) {
    return undefined;
  }
  // If slider is not actively in use, then prefer firebase frequency
  if (!isSliding && firebaseFrequency != frequency) {
    setFrequency(firebaseFrequency);
  }
  // Otherwise get the latest value from the slider
  if (frequencySlider.value() != frequency) {
    setFrequency(frequencySlider.value());
  }
  // By now, frequency should be up to date
  return frequency;
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
  background(220);
  
  f = getFrequency();
  osc.freq(f);
  
  if (f != undefined) {
    textSize(12);
    text('Frequency', 20, 20);
    textSize(24);
    text(f +'Hz', 20, 44);
  }

  let rectLength = windowWidth-40;
  rect(20, 100, rectLength, 100);
  drawDots(rectLength, f);
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
