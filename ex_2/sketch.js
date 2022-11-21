
/*
  
  Samyam Lamichhane
  Serial Communication
  Intro-To-Interactive-Media
    
  Nov 20, 2022 Sun.
    
    
  * Description *
    - Keyboard arrows can be used to control the x-position of the ball on screen
    - In return, it controls the brightness of an LED

  * DISCLAIMER *
  Serial-port code adapted from: https://editor.p5js.org/mangtronix/sketches/vQzE2Yhpj
  
  
  
  * Schematics *
  https://github.com/declansam/SerialComm_Exercises/blob/main/ex_2/ex_2_led_write_schem_Samyam.png

  * Pair it with *
  https://github.com/declansam/SerialComm_Exercises/blob/main/ex_2/ex_2_pot_to_p5js.ino
  
*/



// Global variables added
let h = 1000;          // Canvas height
let w = 1000;          // Canvas width
let ellipse_h = 50;
let ellipse_w = 50;
let ellipse_x = w/2;
let ellipse_y = h/2;
let ellipse_vx = 0;
let error_corr = (ellipse_w/2);
let ellipse_vel = 3;



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
  if (!navigator.serial) 
  {
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
 
function draw() {

  background(50);
  displayText();

  let color_gradient = map(ellipse_x, 0, (w - error_corr), 0, 255);
  let color_ = color(color_gradient, 0, 0);
  draw_ellipse(ellipse_x, ellipse_y, ellipse_w, ellipse_h, color_);
  pos_check();
  pos_update();
  
}


function displayText()
{
  textSize(25);
  fill("white");
  text("Move the ellipse using the RIGHT and LEFT arrows of the keyboard: ", error_corr * 5, h/2 - 400);
}



// Function to draw an ellipse
// Aruguments; (x, y) coordinates && width and height
function draw_ellipse(x, y, w_, h_, color)
{
  fill(color);
  ellipse(x, y, w_, h_);
}


function pos_check()
{
  if ((ellipse_x - error_corr) <= 0)
    ellipse_x = error_corr;
  else if (ellipse_x >= (w - error_corr))
    ellipse_x = w - error_corr;
}

function pos_update()
{
    ellipse_x += ellipse_vx;
}



function keyPressed() 
{
  // If RIGHT_ARROW is pressed, the character needs to move right, so set horizontal velocity using global var
  if (keyCode === RIGHT_ARROW)                   
  {
    ellipse_vx = ellipse_vel;
    
  }
  
  // If LEFT_ARROW is pressed, the character needs to move left, so set horizontal velocity using global var
  if (keyCode === LEFT_ARROW) 
  {
    ellipse_vx = -ellipse_vel;
  }
  
  let serial_val_ = (map(ellipse_x, 0, (w - error_corr), 0, 255));
  serial.write(serial_val_);
  // print("Serial " + serial_val_);
  

  
}


// Function that helps to move the ellipse one step at a time
function keyReleased() 
{
  // After RIGHT or LEFT arrow is released, set horizontal velocity to 0
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) 
  {
    ellipse_vx = 0;
  }

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
  
  // serial.write(ellipse_x);
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
