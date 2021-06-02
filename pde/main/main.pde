import processing.video.*;
import processing.sound.*;
import boofcv.processing.*;
import boofcv.struct.image.*;
import georegression.struct.point.*;
import georegression.struct.shapes.*;
import websockets.*;

Capture cam;
SimpleTrackerObject tracker;
SqrOsc square;
WebsocketServer ws;
final int CAMERA_WIDTH = 800;  //px
final int CAMERA_HEIGHT = 600; //px
final int MARGIN = 100;        //px

// storage for where the use selects the target and the current target location
Quadrilateral_F64 target = new Quadrilateral_F64();
// if true the target has been detected by the tracker
boolean targetVisible = false;
PFont f;
// indicates if the user is selecting a target or if the tracker is tracking it
int mode = 0;

void setup() {
  // Open up the camera so that it has a video feed to process
  initializeCamera(CAMERA_WIDTH, CAMERA_HEIGHT);
  surface.setSize(cam.width, cam.height);

  // Select which tracker you want to use by uncommenting and commenting the lines below
      tracker = Boof.trackerCirculant(null, ImageDataType.F32);
//    tracker = Boof.trackerTld(null,ImageDataType.F32);
//    tracker = Boof.trackerMeanShiftComaniciu(null, ImageType.ms(3,GrayF32.class));
//    tracker = Boof.trackerSparseFlow(config, ImageDataType.F32);

  f = createFont("Arial", 32, true);
  
  startWebSocketServer();
  setupOscillator();
}

void startWebSocketServer() {
  // Initiates the websocket server, and listens for incoming connections on ws://localhost:8000/synth
  ws = new WebsocketServer(this, 8000, "/synth/frequency");
  println("WebsocketServer listening on port 8000 /synth/frequency");
}

void sendFrequency(float frequency) {
  ws.sendMessage("" + frequency);
}

void setupOscillator() { 
  // Create square wave oscillator.
  square = new SqrOsc(this);
  square.freq(1);
//  square.play();
}

void draw() {
  if (cam.available() == true) {
    cam.read();

    if ( mode == 1 ) {
      targetVisible = true;
    } else if ( mode == 2 ) {
      // user has selected the object to track so initialize the tracker using
      // a rectangle.  More complex objects and be initialized using a Quadrilateral.
      if ( !tracker.initialize(cam, target.a.x, target.a.y, target.c.x, target.c.y) ) {
        mode = 100;
      } else {
        targetVisible = true;
        mode = 3;
      }
    } else if ( mode == 3 ) {
      // Update the track state using the next image in the sequence
      if ( !tracker.process(cam) ) {
        // it failed to detect the target.  Depending on the tracker this could mean
        // the track is lost for ever or it could be recovered in the future when it becomes visible again
        targetVisible = false;
      } else {
        // tracking worked, save the results
        targetVisible = true;
        target.set(tracker.getLocation());
      }
    }
  }
  image(cam, 0, 0);

  // The code below deals with visualizing the results
  textFont(f);
  textAlign(CENTER);
  fill(0, 0xFF, 0);
  if ( mode == 0 ) {
    text("Click and Drag", width/2, height/4);
  } else if ( mode == 1 || mode == 2 || mode == 3) {
    if ( targetVisible ) {
      drawTarget();
      //setFrequencyFromYCoord((float)target.a.y);
      setFrequencyFromYCoord((float)target.a.x);
    } else {
      text("Can't Detect Target", width/2, height/4);
    }
  } else if ( mode == 100 ) {
    text("Initialization Failed.\nSelect again.", width/2, height/4);
  }
}

void setFrequencyFromYCoord(float y) {
  float rawY = y;
  // Make 0hz be bottom of the screen
  y = CAMERA_HEIGHT - y;
  if (y < 0) { y = 0; }
  // Scale to 30,000hz
  y = y * (30000 / CAMERA_HEIGHT);
  // Log scale 
  y = makeItLogScale(y);
  
  // println(rawY + "\t" + y);
  square.freq(y);
  sendFrequency(y);
}

void setFrequencyFromXCoord(float x) {
  float rawX = x;
  // Make 0hz be bottom of the screen
  x = CAMERA_WIDTH - x;
  if (x < 0) { x = 0; }
  // Scale to 30,000hz
  x = x * (30000 / CAMERA_WIDTH);
  // Log scale 
  x = makeItLogScale(x);
  
  println(rawX + "\t" + x);
  square.freq(x);
  sendFrequency(x);
}


float makeItLogScale(float linearValue) {
  return Math.round(Math.pow(2, (linearValue / 2000)));
}

void mousePressed() {
  // use is draging a rectangle to select the target
  mode = 1;
  target.a.set(mouseX, mouseY);
  target.b.set(mouseX, mouseY);
  target.c.set(mouseX, mouseY);
  target.d.set(mouseX, mouseY);
}

void mouseDragged() {
  target.b.x = mouseX;
  target.c.set(mouseX, mouseY);
  target.d.y = mouseY;
}

void mouseReleased() {
  // After the mouse is released tell it to initialize tracking
  mode = 2;
}

// Draw the target using different colors for each side so you can see if it is rotating
// Most trackers don't estimate rotation.
void drawTarget() {
  noFill();
  strokeWeight(3);
  stroke(255, 0, 0);
  line(target.a, target.b);
  stroke(0, 255, 0);
  line(target.b, target.c);
  stroke(0, 0, 255);
  line(target.c, target.d);
  stroke(255, 0, 255);
  line(target.d, target.a);
}

void line( Point2D_F64 a, Point2D_F64 b ) {
  line((float)a.x, (float)a.y, (float)b.x, (float)b.y);
}

void initializeCamera( int desiredWidth, int desiredHeight ) {
  String[] cameras = Capture.list();

  if (cameras.length == 0) {
    println("There are no cameras available for capture.");
    exit();
  } else {
    cam = new Capture(this, desiredWidth, desiredHeight, cameras[1]);
    cam.start();
  }
}
