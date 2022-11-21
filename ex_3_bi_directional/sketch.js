
/*

    Samyam Lamichhane
    Serial Communication
    Bi-directional communcation
    Intro-To-Interactive-Media
    
    Nov 20, 2022 Sun.
    
    
    * Description *
      - LED Blinks when the ball bounces
      - Potentiometer can be used to control the wind direction and speed
      
    * Parameters Control *
      1. User can set if the ball should remain or exit the canvas - using "beyondBorder" global variable
      2. User can set the maximum wind velocity - using "max_wind_vel" global variable
      3. User can control the brightness of LED - using "ledBrightness" global variable
    
    * DISCLAIMER *
    Wind gravity code adapted from: https://editor.p5js.org/aaronsherwood/sketches/I7iQrNCul
    
    
    
    * Schematics *
    https://github.com/declansam/SerialComm_Exercises/blob/main/ex_3_bi_directional/bi_dir_schem_ex_3_Samyam.png

    * Pair it with *
    https://github.com/declansam/SerialComm_Exercises/blob/main/ex_3_bi_directional/ex_3_bidir_comm.ino
    
*/



// USER CONTROl - The user can decide if the ball can stay within the canvas or can go beyond it
// 'y' = The ball can travel beyond right/ left border
// 'n' = The ball should stay within the border
let beyondBorder = "n";
let max_wind_vel = 3;                // Maximum Wind Speed
let ledBrightness = 255;


// Misc Global Variables
let canvas_w = 800;
let canvas_h = 800;

// Global Variables for gravity wind
let velocity;
let gravity;
let position_;
let acceleration;
let wind;
let drag = 0.99;
let mass = 50;
let error_corr = 5;                  // Variable that fixes ball dimension
let scaled_wind;                     // Variable used to track wind speed and direction

// Global Variables for Serial Communication
// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();
 

// HTML button object:
let portButton;
let inData;                   // for incoming serial data
let temp_inData;
let outByte = 0;              // for outgoing data

let statusOnOff = 0;          // LED Blinking Effect
let bg_image;                 // Image variable for background image


// Loading the background image
function preload()
{
  bg_img = loadImage("image/bg_dash.png");
}



function setup() 
{
  // Initial program setup
  imageMode(CORNER);
  createCanvas(canvas_w, canvas_h);
  noFill();
  position_ = createVector(width/2, 0);
  velocity = createVector(0,0);
  acceleration = createVector(0,0);
  gravity = createVector(0, 0.5*mass);
  wind = createVector(0,0);
  
  
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



function draw() 
{
  // background(255);
  image(bg_img, 0, 0, canvas_w, canvas_h);
  display_text();
  
  // Conditional that disables/ enables the functionality to keep the ball within the canvas
  if (beyondBorder == "n" || beyondBorder == "N" || beyondBorder == "NO" || beyondBorder == "no" || beyondBorder == "No")
    pos_check();
  
  // Initial Setup
  applyForce(wind);
  applyForce(gravity);
  velocity.add(acceleration);
  velocity.mult(drag);
  position_.add(velocity);
  acceleration.mult(0);
  fill(247, 180, 5);
  ellipse(position_.x,position_.y,mass,mass);
  
  if (position_.y > height - mass/2) 
  {
      velocity.y *= -0.9;  // A little dampening when hitting the bottom
      position_.y = height - mass/2;
    
  }
  
  
  // LED SETUP
  if (position_.y > height - mass/2 - mass) 
  {
    if (velocity.y > 1) 
    {
      serial.write(ledBrightness);
    }
  }
  
  
  // Wind Setup
  let max_pot_reading = 255;
  scaled_wind = map(inData, 0, max_pot_reading, -max_wind_vel, max_wind_vel);
  
  print("X Pos: ", position_.x);
  // print("Pot Reading: ", inData);
  // print("Scaled: ", scaled_data);
  
  wind.x = scaled_wind;
  // wind.y = scaled_data;
  
}




// Replicates the ball's movement
function applyForce(force)
{
  // Newton's 2nd law: F = M * A
  // or A = F / M
  let f = p5.Vector.div(force, mass);
  acceleration.add(f);
}



// Keyboard Control
function keyPressed()
{
  if (keyCode==LEFT_ARROW){
    wind.x=-1;
  }
  if (keyCode==RIGHT_ARROW){
    wind.x=1;
  }
  if (key==' '){
    mass=random(15,80);
    position_.y=-mass;
    velocity.mult(0);
  }
}



// Function that checks if the ball is within the canvas or not
// It restricts the ball from exiting the canvas
// Called in draw() function
function pos_check()
{
  // error_corr helps to keep ball within the frame. 
  // Without it, some portion of the ball disappears into the walls.
  // Here, 2.5 is a special value that avoids glitchy effect when wind direction is changed
  if ((position_.x - mass/2) < 2.5)
    position_.x = mass/2 + error_corr;
  
  else if (position_.x >= (canvas_w - mass/2) - 2.5)
    position_.x = canvas_w - mass/2 - error_corr;
}



// Function that displays information on the canvas
function display_text()
{
  textSize(17);
  fill("white");
  
  let x_ = round(position_.x, 2) - mass/2 + 1;
  let y_ = canvas_h - (round(position_.y, 2) - mass/2 + mass);
  
  text("X-position = " + round(x_), (canvas_w - 200), 50);
  text("Y-position = " + round(y_), (canvas_w - 200), 70);
  text("Wind-Speed = " + round(scaled_wind, 3), (canvas_w - 200), 90);
  
}




// if there's no port selected, 
// make a port select button appear:
function makePortButton() 
{
  // create and position_ a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}
 


// make the port selector window appear:
function choosePort() 
{
  if (portButton) portButton.show();
  serial.requestPort();
}
 

// open the selected port, and make the port 
// button invisible:
function openPort() 
{
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
function portError(err) 
{
  alert("Serial port error: " + err);
}



// read any incoming data as a string
// (assumes a newline at the end of it):
function serialEvent() 
{
  inData = Number(serial.read());
  console.log(inData);
  
  serial.write(statusOnOff);          // Blinking Effect
}



// try to connect if a new serial port 
// gets added (i.e. plugged in via USB):
function portConnect() 
{
  console.log("port connected");
  serial.getPorts();
}
 


// if a port is disconnected:
function portDisconnect() 
{
  serial.close();
  console.log("port disconnected");
}
 


function closePort() 
{
  serial.close();
}

