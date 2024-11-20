let sunrise;
let mainDesk;
let essay;
let discuss;
let poster;
let sketch;
let tasks;
let taskList = [
  { task: "500-word Essay", stage: 4 },
  { task: "Discussion Board", stage: 5 },
  { task: "Art Sketch", stage: 6 },
  { task: "Poster", stage: 7 }
];
let tasksIcon;

let stage = 0;
let prevStage = 0;  
let videoStarted = false;  // Flag to check if the video has started

//===============================================================================================================================================================
function preload() {
  // Preload assets
  sunrise = createVideo(['assets/sunrise.mp4']);
  sunrise.hide();  // Hide video from HTML page

  mainDesk = loadImage('assets/desk.png');
  essay = loadImage('assets/essay.png');
  discuss = loadImage('assets/discuss.png');
  poster = loadImage('assets/poster.png');
  tasks = loadImage('assets/tasks1.png');
  sketch = loadImage('assets/sketch.png');
  tasksIcon = loadImage('assets/tasks button.png');
}
//===============================================================================================================================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  sunrise.loop();  // Ensure the video will loop
  sunrise.volume(0);  // Optional: mute the video

  essayInput = createElement('textarea', '');
  essayInput.position(608.5, 240);
  essayInput.size(525, 350);
  essayInput.attribute('placeholder', 'Type your essay here...');
  essayInput.elt.style.textAlign = 'left';  // Align text to the left (using raw DOM style)
  essayInput.elt.style.padding = '10px';    // Add padding for better appearance
  essayInput.elt.style.resize = 'none';
  essayInput.hide(); // Initially hidden, only shown in the essay stage

  discussInput = createElement('textarea', '');
  discussInput.position(527, 358);
  discussInput.size(555, 182);
  discussInput.attribute('placeholder', 'Type your response here...');
  discussInput.elt.style.textAlign = 'left'; // Align text to the left
  discussInput.elt.style.padding = '10px';  // Add padding for better appearance
  discussInput.elt.style.resize = 'none';
  discussInput.hide();
}
//===============================================================================================================================================================
function draw() {
  // Display the video on all stages if it's started
  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -70, -20, sunriseWidth*1.2, sunriseHeight*1.2);  // Display video in top-left corner
  }

  switch(stage) {
    case 0: // Start page
      drawStartPage();
      break;

    case 1: // Message stage
      drawMessageStage();
      break;

    case 2: // Main desk stage
      drawMainDeskStage();
      break;

    case 3: // Tasks stage
      drawTasksStage();
      break;

    case 4: // Essay stage
      drawEssayStage();
      break;

    case 5: // Discussion Board stage
      drawDiscussionStage();
      break;

    case 6: // Art Sketch stage
      drawArtSketchStage();
      break;

    case 7: // Poster stage
      drawPosterStage();
      break;
  }
}

//===============================================================================================================================================================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // Resize canvas when window is resized
}

//===============================================================================================================================================================
function drawStartPage() {
  background("#e8a2b6");
  textAlign(CENTER, CENTER);
  fill("black");
  textSize(50);
  text("EFFICIENCY", windowWidth / 2, windowHeight / 4);

  // Back Button
  drawBackButton();

  let buttonHovered = mouseX >= windowWidth / 2 - 75 && mouseX <= windowWidth / 2 + 75 &&
                      mouseY >= windowHeight / 2 - 25 && mouseY <= windowHeight / 2 + 25;
  fill(buttonHovered ? "#A0D8A5" : "#8bbb96");
  rect(windowWidth / 2 - 75, windowHeight / 2 - 25, 150, 50);
  textSize(27);
  fill("black");
  text("Start", windowWidth / 2, windowHeight / 2);

  if (buttonHovered && mouseIsPressed) {
    prevStage = stage;  // Store the current stage before changing
    stage = 1;  // Move to message stage
  }
}

//===============================================================================================================================================================
function drawMessageStage() {
  image(mainDesk, 0, -42, width, height * 1.08);
  fill(255, 255, 255, 150); 
  noStroke();
  rect(0, 0, windowWidth, windowHeight);  // Semi-transparent overlay

  // Display message box
  fill(0);
  let boxWidth = windowWidth * 0.4;
  let boxHeight = windowHeight * 0.25;
  rect(windowWidth * 0.15, windowHeight * 0.3, boxWidth, boxHeight);

  fill(255);
  textAlign(LEFT, TOP);  
  textSize(windowWidth * 0.03);
  let line1 = "I don't have much homework,";
  let line2 = "but I should try to get ahead";
  let line3 = "so I'm not so swamped later.";
  let lineSpacing = 48;

  text(line1, windowWidth * 0.15 + 10, windowHeight * 0.31 + 10); 
  text(line2, windowWidth * 0.15 + 10, windowHeight * 0.33 + 10 + lineSpacing); 
  text(line3, windowWidth * 0.15 + 10, windowHeight * 0.35 + 10 + (lineSpacing * 2)); 

  // View Tasks Button
  let viewTasksButtonHovered = mouseX >= windowWidth / 2 - 120 && mouseX <= windowWidth / 2 + 40 &&
                               mouseY >= windowHeight / 1 - 380 && mouseY <= windowHeight / 1 - 320;
  fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
  rect(windowWidth / 2 - 120, windowHeight / 1 - 380, 160, 60);
  fill("black");
  textSize(26);
  text("View Tasks", windowWidth / 2 - 100, windowHeight / 1 - 360);

  if (viewTasksButtonHovered && mouseIsPressed) {
    prevStage = stage;
    stage = 3;  // Move to tasks stage
  }

  drawBackButton();
}

//===============================================================================================================================================================
function drawMainDeskStage() {
  image(mainDesk, 0, -42, width, height * 1.08);
  fill(0);
  text("x:" + mouseX + " y:" + mouseY, 100, 100);
}

//===============================================================================================================================================================
function drawTasksStage() {
  background(200); // Clear screen

  // Display the sunrise video in the top-left corner if videoStarted is true
  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -70, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }

  // Display the main desk image
  image(mainDesk, 0, -42, width, height * 1.08);

  // Calculate the dimensions of the tasks image with a larger scale
  let tasksWidth = windowWidth * 1;  // Increase the width for a larger image
  let tasksHeight = tasks.height * (tasksWidth / tasks.width); // Maintain the aspect ratio

  // Center the tasks image
  let tasksX = (windowWidth - tasksWidth) / 2;  // Center horizontally
  let tasksY = (windowHeight - tasksHeight) / 2;  // Center vertically
  image(tasks, tasksX, tasksY, tasksWidth, tasksHeight);  // Display the larger tasks image

  let taskY = windowHeight * 0.25;  // Initial vertical position for tasks (moved down)
  let lineSpacing = 42;  // Decreased line spacing (less vertical distance between tasks)
  textAlign(LEFT, TOP);
  fill("black");
  textSize(26);

  for (let i = 0; i < taskList.length; i++) {
    let task = taskList[i];

    // Calculate position for text with reduced spacing
    let buttonWidth = 300;
    let buttonX = windowWidth / 2 - buttonWidth / 2;
    let buttonY = taskY + i * lineSpacing;  // Updated to use reduced lineSpacing

    // Check if mouse is over the text
    let isHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                    mouseY >= buttonY && mouseY <= buttonY + lineSpacing;  // Adjusted height for the hover area

    // Set the text color based on hover state
    fill(isHovered ? "#F2A6C8" : "black");  // Change text color on hover

    // Draw the task text
    text(task.task, buttonX + 10, buttonY + 10);

    // Handle task click
    if (isHovered && mouseIsPressed) {
      // Change the stage to the corresponding one
      stage = task.stage;

      // Remove the task from the list after clicking
      taskList.splice(i, 1); // Remove the clicked task from the list
    }
  }

  // Draw the back button
  drawBackButton();
}
//===============================================================================================================================================================
function drawEssayStage() {
  background(255);

  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -450, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }
  
  image(essay, 0, 0, width, height);

  image(tasksIcon, 20, 20,width, height);

  // Show the input field for the essay stage
  essayInput.show();

  // Set text alignment for the essay input (instructions text)
  textAlign(LEFT, TOP);
  fill(0);
  textSize(12);
  

  drawBackButton();
}

//===============================================================================================================================================================
function drawDiscussionStage() {
  background(200);

  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -450, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }
  
  image(discuss, 0, 0, width, height);
  image(tasksIcon, 20, 20,width, height);
  // Show the input field for the discussion stage
  discussInput.show();

  // Set text alignment for the discussion input (instructions text)
  textAlign(LEFT, TOP);
  fill(0);
  textSize(24);

  drawBackButton();
}

//===============================================================================================================================================================
function drawArtSketchStage() {
  background("#664d35");
  image(sketch, 0, 0, width, height);
  image(tasksIcon, 20, 20,width, height);
  drawBackButton();
}

//===============================================================================================================================================================
function drawPosterStage() {
  background(220);

  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, 50, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }

  image(poster, 0, 0, width, height);


  drawBackButton();
}

//===============================================================================================================================================================
function drawButton(x, y, w, h, label, callback) {
  let buttonHovered = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
  fill(buttonHovered ? "#F2A6C8" : "pink");
  rect(x, y, w, h);
  fill("black");
  textSize(26);
  text(label, x + w / 2, y + h / 2);

  if (buttonHovered && mouseIsPressed) {
    callback();  // Call the callback function (e.g., change stage)
  }
}

function updateEssayText() {
  // Store the value typed in the essay input field
  essayText = essayInput.value();
}

function updateDiscussText() {
  // Store the value typed in the discussion input field
  discussText = discussInput.value();
}
//===============================================================================================================================================================
function drawBackButton() {
  backButtonHovered = mouseX >= 30 && mouseX <= 130 && mouseY >= 30 && mouseY <= 70;
  fill(backButtonHovered ? "#A0D8A5" : "#8bbb96");
  rect(30, 30, 100, 40);
  fill("black");
  textSize(20);
  text("Back", 78, 50);

  if (backButtonHovered && mouseIsPressed && stage !== 0) {
    if (stage === 4 || stage === 5) {
      essayInput.hide(); // Hide essay input on back
      discussInput.hide(); // Hide discussion input on back
    }
    stage = prevStage;  // Go back to the previous stage
  }
}

function mousePressed() {
  if (!videoStarted) {
    videoStarted = true;  // Start the video on first mouse press
    sunrise.play();  // Ensure video starts
  }
}
