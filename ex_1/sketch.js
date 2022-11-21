
/*
  
  Samyam Lamichhane
  Serial Communication
  Intro-To-Interactive-Media
    
  Nov 20, 2022 Sun.
    
    
  * Description *
    - Potentiometer can be used to control the x-coordinates of the ball on the canvas

  * DISCLAIMER *
  Serial-port code adapted from: https://editor.p5js.org/mangtronix/sketches/vQzE2Yhpj
  
  
  
  * Schematics *
  https://github.com/declansam/SerialComm_Exercises/blob/main/ex_1/ex_1_pot_read_schem_Samyam.png

  * Pair it with *
  https://github.com/declansam/SerialComm_Exercises/blob/main/ex_1/ex_1_pot_to_p5js.ino
  
*/



// Global variables added
let h = 1000;          // Canvas height
let w = 1000;          // Canvas width
let ellipse_height = 50;
let ellipse_width = 50;


// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();
 
// HTML button object:
let portButton;
let inData;                   // for incoming serial data
let outByte = 0;              // for outgoing data
 

function setup() 
{
  createCanvas(w, h);          // make the canvas
  
  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}
 


function draw() 
{

  background(50);
  fill(255);

  textSize(25);
  text("Raw sensor value: " + inData, 30, 50);
  
  
  // ------------------ Ellipse Values ----------------
  let max_pot_reading = 255;
  let map_error_corr = ellipse_width/2;
  
  // X-coordinate is scaled based on the readings from potentiometer
  let scaled_x_pos = map(inData, 0, max_pot_reading, map_error_corr, (w-map_error_corr));
  
  
  // Draw ellipse using the values determined above
  draw_ellipse(scaled_x_pos, (h/2 - map_error_corr), ellipse_height, ellipse_width);
  
  
  // Text Display on the right side of the canvas
  let rounded_x_pos = round(scaled_x_pos, 2);          // Data rounded upto 2 decimal places
  textSize(25);
  fill("white");
  text("Scaled X-position: " + rounded_x_pos, (w/2 + 150), 50);
  
}



// Function to draw an ellipse
// Aruguments; (x, y) coordinates && width and height
function draw_ellipse(x, y, w_, h_)
{
  fill("red");
  ellipse(x, y, w_, h_);
}




// if there's no port selected, 
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}
 
// make the port selector window appear:
function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}
 
// open the selected port, and make the port 
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  serial.open().then(initiateSerial);
 
  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}
 
// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}
// read any incoming data as a string
// (assumes a newline at the end of it):
function serialEvent() {
  inData = Number(serial.read());
  console.log(inData);
}
 
// try to connect if a new serial port 
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}
 
// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}
 
function closePort() {
  serial.close();
}

