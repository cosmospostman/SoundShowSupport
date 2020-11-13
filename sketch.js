let osc;
let frequency;
let frequencySlider;
let isPlaying = false;
let config = {
  localSound: false,
  showKeys: false
}
let adminMode = false;
let isSliding = false;

function setup() {
  // let cnv = createCanvas(400, 400);
  let params = getURLParams();
  let cnv = createCanvas(windowWidth, windowHeight);
  adminMode = params.admin;
  osc = new p5.Oscillator('square');
  osc.amp(1.0);

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

  playStopButton = createButton('Play/Stop');
  playStopButton.position(20, 55);
  playStopButton.mousePressed(startPulse);
  playStopButton.class('playStopButton');

  notes = [ ['+', '+'],
            ['-', '-'],
            ['A', 110.00],
            ['B', 123.47],
            ['C', 130.81],
            ['D', 146.83],
            ['E', 164.81],
            ['F', 174.61],
            ['G', 196.00],
            ['A', 220.00] ];
  noteButtonList(notes);

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

function invalidateConfig() {
  select('.playStopButton').style('display', adminMode || config.localSound ? 'block' : 'none');
  selectAll('.keys').forEach(function(e) {
    e.style('display', config.showKeys ? 'block' : 'none');
  });
}

function noteButtonList(notes) {
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

// Manual update => set state and slider
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

// Prefer firebase frequency, then slider value
function getFrequency() {
  if (firebaseFrequency === undefined) {
    return undefined;
  }
  // If not sliding, then prefer firebase frequency
  if (!isSliding && firebaseFrequency != frequency) {
    setFrequency(firebaseFrequency);
  }
  // Then see if the slider has changed
  if (frequencySlider.value() != frequency) {
    setFrequency(frequencySlider.value());
  }
  return frequency;
}

function startPulse() {
  if (isPlaying) {
    // Stop playing
    osc.stop();
  } else {
    // Start playing
    osc.start();
  }
  isPlaying = !isPlaying;
}


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


