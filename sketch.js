let pulse;
let frequency;
let frequencySlider;
let isPlaying = false;

function setup() {
  // let cnv = createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight);

  frequencySlider = createSlider(1, 440, 1);
  frequencySlider.position(100, 26);
  frequencySlider.style('width', windowWidth-120 + 'px');

  button = createButton('Play/Stop');
  button.position(20, 55);
  button.mousePressed(startPulse);

  notes = [ ['A', 110.00],
            ['B', 123.47],
            ['C', 130.81],
            ['D', 146.83],
            ['E', 164.81],
            ['F', 174.61],
            ['G', 196.00],
            ['A', 220.00] ];
  noteButtonList(notes);

  osc = new p5.Oscillator('square');
  osc.amp(0.5);
}

function noteButtonList(notes) {
  let i=0;
  notes.forEach(function(n) {
    button = createButton(n[0]);
    button.position(100+30*i++, 55);
    button.mousePressed(function(){
      setFrequency(n[1]);
    });
  });
}

// Manual update => set state and slider
function setFrequency(freq) {
  if (freq != frequency) {
    frequency = freq;
    frequencySlider.value(freq);
  }
}

// Prefer slider value
function getFrequency() {
  if (frequencySlider.value() != frequency) {
    frequency = frequencySlider.value();
    setFirebaseFrequency(frequency);
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
  
  textSize(12);
  text('Frequency', 20, 20);
  textSize(24);
  text(f +'hz', 20, 44);

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


