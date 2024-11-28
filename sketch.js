let sunrise;
let mainDesk;
let essay;
let discuss;
let poster;
let sketch;
let tasks;
let taskList = [
  { task: "500-word Essay", stage: 4 },
  { task: "Poster", stage: 7},
  { task: "portrait", stage: 6},
  { task: "Discussion Board", stage: 5},
  { task: "reading response", stage: 4},

  { task: "abstract", stage: 4},
  { task: "reflection", stage: 5},

  { task: "paper 2 draft", stage: 4},
  { task: "contour drawing", stage: 6},
  { task: "sketch", stage: 6},
  { task: "art draft", stage: 6},
  { task: "one-pager", stage: 7},
  { task: "graphic", stage: 7},

];

let pencil;


let submitButton;
let replyButton;
let posterSubmit;

let taskGenerationTimer; // Timer for random task generation
let maxTasks = 12; // Maximum number of tasks that should be displayed on the screen
let taskContainer;
let taskListDiv;

let tasksIcon;
let myFont;
let clockFont;
let bandiFont;

let stage = 0;
// let prevStage = 0;  
let videoStarted = false;  // Flag to check if the video has started

let tasksActive = false;
let isEssayStageEntered = false;
let isDiscussStageEntered = false;
let isArtSketchStageEntered = false;
let isPosterStageEntered = false;

let startTime;  // To store the starting time
let elapsedTime;
let startHour = 12;  // Start at 12:00 PM
let startMinute = 0;
//===============================================================================================================================================================
function preload() {
  // Preload assets
  sunrise = createVideo(['assets/newsunrise.mp4']);
  sunrise.hide();  // Hide video from HTML page

  mainDesk = loadImage('assets/desk.png');
  essay = loadImage('assets/essay.png');
  discuss = loadImage('assets/discuss.png');
  poster = loadImage('assets/poster.png');
  tasks = loadImage('assets/tasks1.png');
  sketch = loadImage('assets/sketch.png');
  tasksIcon = loadImage('assets/tasks button.png');

  myFont= loadFont('assets/FsHandwriting-Regular.ttf');
  clockFont = loadFont('assets/DS-DIGII.TTF');
  bandiFont = loadFont('assets/Core Bandi Face.ttf');

  //buttons
  submitButton = loadImage('assets/submit.png');

  replyButton = loadImage('assets/reply.png');
  posterSubmit = loadImage('assets/poster submit.png');

  pencil = loadImage('assets/pencil.png')
}
//===============================================================================================================================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(myFont);

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

  taskContainer = createDiv();
  taskContainer.style('position', 'absolute');
  taskContainer.style('top', '200px');
  taskContainer.style('left', '20px');
  taskContainer.style('width', '80%');
  taskContainer.style('height', '400px');
  taskContainer.style('overflow-y', 'scroll');  // Enable vertical scrolling
  taskContainer.style('background-color', 'rgba(255, 255, 255, 0.8)');
  taskContainer.style('border-radius', '10px');
  taskContainer.style('padding', '10px');
  taskContainer.hide(); // Hide it initially, show it only on tasks page
  
  // Initialize the div for tasks to be added inside the container
  taskListDiv = createDiv();
  taskContainer.child(taskListDiv);

  // Start generating tasks
  startGeneratingTasks();

  startTime = millis();
  
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
      clock();
      break;

    case 5: // Discussion Board stage
      drawDiscussionStage();
      clock();
      break;

    case 6: // Art Sketch stage
      drawArtSketchStage();
      break;

    case 7: // Poster stage
      drawPosterStage();
      clock();
      break;
  }

  if (stage === 3) {
    drawTasksStage();
  }
}

function clock() {
  fill("white");  // Text color
  textFont(clockFont);  // Use the clock font
  textAlign(CENTER, CENTER);  // Center-align the text
  textSize(80);  // Text size

  // Calculate how much time has passed since the program started
  elapsedTime = millis() - startTime;  // Time in milliseconds

  // Calculate the speed-up factor (24 hours in 23 seconds)
  let speedUpFactor = 3760;  // 24 hours / 23 seconds = 3760 seconds per second
  
  // Convert the elapsed time to "virtual" seconds
  let virtualSeconds = (elapsedTime / 1000) * speedUpFactor;

  // Calculate the virtual time based on the start time (e.g., 12:00 PM)
  let totalSeconds = virtualSeconds + (startHour * 3600 + startMinute * 60);  // Add the start time offset
  totalSeconds = totalSeconds % 86400;  // Ensure it loops after 24 hours

  let Hour = floor(totalSeconds / 3600);  // Get the hour
  let min = floor((totalSeconds % 3600) / 60);  // Get the minute

  let noon = Hour >= 12 ? " PM" : " AM";
  
  // Ensure minutes are always two digits
  if (min < 10) {
    min = "0" + min;
  }

  // Convert to 12-hour format
  if (Hour === 0) {
    Hour = 12;  // Midnight (00:xx) is 12 AM
  } else if (Hour > 12) {
    Hour -= 12;  // Convert hours after 12 PM (13-23) to 1-11 PM
  }

  let clockX = 200;         // X position of the clock
  let clockY = 620;         // Y position of the clock

  push();  // Save the current drawing state

  // Set a rotation angle (rotate the text slightly)
  let rotationAngle = radians(-11);  // Negative for counterclockwise rotation
  translate(clockX, clockY);  // Move the origin to the clock position
  rotate(rotationAngle);  // Apply rotation

  // Draw the clock text at the center
  text(Hour + ":" + min + noon, 0, 0);  // Centered after rotation

  pop();  // Restore the original coordinate system
}

//===============================================================================================================================================================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // Resize canvas when window is resized
}

function startGeneratingTasks() {
  // Generate tasks continuously every 5 to 7 seconds
  let randomInterval = random(5000, 7000);

  taskGenerationTimer = setTimeout(() => {
    generateTask();  // Generate a new task
    startGeneratingTasks();  // Recursively keep generating tasks
  }, randomInterval);
}

// Function to generate and add a new task to the task list
function generateTask() {
  // If there are already 12 tasks, stop generating more
  if (taskList.length >= maxTasks) {
    return;
  }

  // Randomly create a new task
  let newTask = { 
    task: "New Task " + (taskList.length + 1), 
    stage: random(4, 7), 
    createdAt: millis() // Time when the task was created
  };

  // Add the task to the list
  taskList.push(newTask);
  updateTaskListDiv();  
  console.log("Task generated:", newTask);
}
// update the task display
function updateTaskListDiv() {
  taskListDiv.html(''); // Clear the existing list before re-adding tasks
  
  // Display tasks from the list
  for (let i = 0; i < taskList.length; i++) {
    let task = taskList[i];
    let taskDiv = createDiv(task.task);
    taskDiv.style('padding', '8px');
    taskDiv.style('border', '1px solid #ccc');
    taskDiv.style('margin', '5px 0');
    taskDiv.style('border-radius', '5px');
    taskListDiv.child(taskDiv);
  }
}


function removeTask(index) {
  taskList.splice(index, 1);
}
//===============================================================================================================================================================
function drawStartPage() { //stage 0
  background("#e8a2b6");
  textAlign(CENTER, CENTER);
  fill("black");
  textSize(50);
  text("EFFICIENCY", windowWidth / 2, windowHeight / 4);

  // Start Button
  let buttonHovered = mouseX >= windowWidth / 2 - 75 && mouseX <= windowWidth / 2 + 75 &&
                      mouseY >= windowHeight / 2 - 25 && mouseY <= windowHeight / 2 + 25;
  fill(buttonHovered ? "#A0D8A5" : "#8bbb96");
  rect(windowWidth / 2 - 75, windowHeight / 2 - 25, 150, 50);
  textSize(27);
  fill("black");
  text("Start", windowWidth / 2, windowHeight / 2);

  if (buttonHovered && mouseIsPressed) {
    stage = 1;
  }
}

//===============================================================================================================================================================
function drawMessageStage() { // Stage 1
  image(mainDesk, 0, -42, width, height * 1.08);
  fill(255, 255, 255, 150); 
  noStroke();
  rect(0, 0, windowWidth, windowHeight);  // Semi-transparent overlay

  // Center the message box
  let boxWidth = windowWidth * 0.5;  // Set the width of the box (40% of the window width)
  let boxHeight = windowHeight * 0.5;  // Set the height of the box (25% of the window height)
  let boxX = (windowWidth - boxWidth) / 2;  // Center the box horizontally
  let boxY = (windowHeight - boxHeight) / 2;  // Center the box vertically 
  // Draw the message box 
  fill(0);
  rect(boxX, boxY, boxWidth, boxHeight, 5);

  // Display the text inside the message box
  fill(255);  // Text color (white)
  textAlign(CENTER, CENTER);  // Align text to center both horizontally and vertically
  textSize(windowWidth * 0.05);
  
  let line1 = "I dont have much ";
  let line2 = "homework, but I should ";
  let line3 = "try to get ahead so Im";
  let line4 = "not too swamped later.";
  let line5 = "Its just a few assignments."
  let lineSpacing = 62;

  let totalTextHeight = (lineSpacing * 4) + 10 + (lineSpacing * 1);

  let textStartY = boxY + (boxHeight - totalTextHeight)/2; // Center vert in box

  text(line1, boxX + boxWidth / 2, textStartY); 
  text(line2, boxX + boxWidth / 2, textStartY + lineSpacing);
  text(line3, boxX + boxWidth / 2, textStartY + (lineSpacing * 2));
  text(line4, boxX + boxWidth / 2, textStartY + (lineSpacing * 3));
  text(line5, boxX + boxWidth / 2, textStartY + (lineSpacing * 4));

  let buttonWidth = 150; 
  let buttonHeight = 50; 
  // let buttonX = 868;
  // let buttonY = 467;
  let buttonX = (windowWidth - buttonWidth) / 2;  // Center horizontally
  let buttonY = boxY + boxHeight - 65;  // Position button below the message box (with padding)

  // View Tasks Button hover area
  let viewTasksButtonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                               mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill("black");
  textSize(29);
  textAlign(CENTER, CENTER);
  text("View Tasks", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);  // Center the text

  // Move to tasks stage when clicked
  if (viewTasksButtonHovered && mouseIsPressed) {
    prevStage = stage;
    stage = 3;  // Move to tasks stage
    tasksActive = true;  // Enable task interaction after clicking "View Tasks"
  }
}

//===============================================================================================================================================================
function drawMainDeskStage() { //stage 2
  
  image(mainDesk, 0, -42, width, height * 1.08);
  fill(0);
  text("x:" + mouseX + " y:" + mouseY, 100, 100);
}

//===============================================================================================================================================================
function drawTasksStage() {  // Stage 3
  if (!tasksActive) return;  // Do nothing if tasks are not active
  
  // Clear the background and display tasks
  background(200); 

  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -70, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }

  // Display the main desk image
  image(mainDesk, 0, -42, width, height * 1.08);

  // Center the tasks image both vertically and horizontally
  let tasksWidth = windowWidth * 0.8;
  let tasksHeight = tasks.height * (tasksWidth / tasks.width);
  let tasksX = (windowWidth - tasksWidth) / 2;
  let tasksY = (windowHeight - tasksHeight) / 2;
  image(tasks, tasksX, tasksY, tasksWidth, tasksHeight);  // Display the tasks image centered

  // Move the task list container to the right by increasing the X position
  let taskContainerX = 620;  // Shift the task container to the right (increased from windowWidth / 4)
  let taskContainerY = tasksY + 175;  // Position task list above the tasks image (50px above)
  let taskContainerWidth = windowWidth / 2;
  let taskContainerHeight = windowHeight * 0.4;

  // Starting position for tasks
  let taskY = taskContainerY + 10;
  let lineSpacing = 34;

  textFont(myFont);
  textAlign(LEFT, TOP);
  fill("black");
  textSize(26);

  // Loop through the taskList array but only show the first 4 tasks
  let tasksToDisplay = taskList.slice(0, 4);  // Slice the first 4 tasks from taskList

  for (let i = 0; i < tasksToDisplay.length; i++) {
    let task = tasksToDisplay[i];

    let buttonWidth = 300;  // Width of the task item button
    let buttonX = taskContainerX + 10;  // Padding from the left
    let buttonY = taskY + i * lineSpacing;  // Space between tasks

    // Check if the mouse is hovering over the task
    let isHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                    mouseY >= buttonY && mouseY <= buttonY + lineSpacing;

    // Change text color if hovered
    fill(isHovered ? "#F2A6C8" : "black");

    // Display task name
    text(task.task, buttonX + 10, buttonY + 10);

    // Handle task click (navigate to its corresponding stage)
    if (isHovered && mouseIsPressed) {
      currentTask = task.task;  // Set the current task to the clicked task
      stage = task.stage;  // Navigate to the corresponding task stage
      taskList.splice(taskList.indexOf(task), 1); // Remove the clicked task from the main task list immediately
    }
  }
}

//===============================================================================================================================================================
function drawEssayStage() {  // Stage 4
  if (stage === 4) {
    background(255);

    // Display video if it's started
    if (videoStarted) {
      let sunriseWidth = windowWidth * 0.5;
      let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
      image(sunrise, -450, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
    }


    // Ensure the input field is created only once
    if (!essayInput) {
      essayInput = createElement('textarea', '');
      essayInput.position(608.5, 240);
      essayInput.size(525, 350);
      essayInput.attribute('placeholder', 'Type here...');
      essayInput.elt.style.textAlign = 'left';
      essayInput.elt.style.padding = '10px';
      essayInput.elt.style.resize = 'none';
    }

    // Clear the text input only when first entering the essay stage
    if (!isEssayStageEntered) {
      essayInput.value('');  // Reset the content to empty string
      isEssayStageEntered = true;  // Set the flag to true so it doesn't clear again
    }

    image(essay, 0, 0, width, height);  // Background image for essay page
    fill("black");
    quad(80, 610, 330, 560, 330, 640, 80, 690)
    essayInput.show();  // Show the input field

    // Submit button
    fill("#e6aa90");
    rect(1198,169.5,79.5,20.5,3);
    textFont(bandiFont);
    textSize(15.5);
    fill(0);
    text('Submit', 1238, 177.5);

    let buttonX = 1198;
    let buttonY = 169.5;
    let buttonWidth = 79.5;
    let buttonHeight = 20.5;

    let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                        mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

    // Provide hover feedback (optional)
    if (buttonHovered) {
      cursor(HAND);  // Change cursor to a hand when hovering over the button
      fill("#f2c6b3");  // Change color when hovered
      rect(buttonX, buttonY, buttonWidth, buttonHeight, 3);  // Re-draw the button with hover color
      fill(0);
      text('Submit', 1238, 177.5);  // Redraw the text on the button
    } else {
      cursor(ARROW);  // Default arrow cursor
    }

    // Detect button click
    if (buttonHovered && mouseIsPressed) {
      submitEssay();  // Trigger the submit action when clicked
    }
  }
}
function submitEssay() {
  // Hide the input field and submit button when submitting the essay
  if (essayInput) {
    essayInput.hide();  // Hide the textarea input when leaving the essay stage
  }
  stage = 3;  // Switch to tasks page
  isEssayStageEntered = false;
}
//===============================================================================================================================================================
function drawDiscussionStage() {
  background(200);

  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -450, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }
  if (!discussInput) {
    discussInput = createElement('textarea', '');
    discussInput.position(527, 358);
    discussInput.size(555, 182);
    discussInput.attribute('placeholder', 'Type your response here...');
    discussInput.elt.style.textAlign = 'left'; // Align text to the left
    discussInput.elt.style.padding = '10px';  // Add padding for better appearance
    discussInput.elt.style.resize = 'none';
    discussInput.hide();
  }
  if (!isDiscussStageEntered) {
    discussInput.value('');  // Reset the content to empty string
    isDiscussStageEntered = true;  // Set the flag to true so it doesn't clear again
  }

  image(discuss, 0, 0, width, height);
  fill("black");
  quad(80, 610, 330, 560, 330, 640, 80, 690)
  // Show the input field for the discussion stage
  discussInput.show();

  // Set text alignment for the discussion input (instructions text)
  textAlign(LEFT, TOP);
  fill(0);
  textSize(24);

  fill("#e6aa90");
  rect(1015,600,121,35.5,6);
  textFont(bandiFont);
  textSize(23);
  fill(0);
  text('Reply', 1049,605);

  let buttonX = 1015;
  let buttonY = 600;
  let buttonWidth = 121;
  let buttonHeight = 35.5;

  let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                      mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  // Provide hover feedback (optional)
  if (buttonHovered) {
    cursor(HAND);  // Change cursor to a hand when hovering over the button
    fill("#f2c6b3");  // Change color when hovered
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 6);  // Re-draw the button with hover color
    fill(0);
    text('Reply', 1049, 605);  // Redraw the text on the button
  } else {
    cursor(ARROW);  // Default arrow cursor
  }

  // Detect button click
  if (buttonHovered && mouseIsPressed) {
    submitDiscuss();  // Trigger the submit action when clicked
  }
}
function submitDiscuss() {
  if (discussInput) {
    discussInput.hide();  // Hide the textarea input when leaving the essay stage
  }
  stage = 3;
  isDiscussStageEntered = false;
}
//===============================================================================================================================================================
function drawArtSketchStage() {
  background("#664d35");
  image(sketch, 0, 0, width, height);

  // Button styling
  fill("#e6aa90");
  rect(1100, 689.5, 83.5, 24.5, 4);  // Draw the button
  textFont(bandiFont);
  textSize(15.5);
  fill(0);
  text('Submit', 1120, 693.5);  // Button text

  // Button position and size
  let buttonX = 1100;
  let buttonY = 689.5;
  let buttonWidth = 83.5;
  let buttonHeight = 24.5;

  // Check if the mouse is hovering over the button
  let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                      mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  // Provide hover feedback (optional)
  if (buttonHovered) {
    cursor(HAND);  // Change cursor to hand when hovering over the button
    fill("#f2c6b3");  // Change button color when hovered
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 4);  // Re-draw the button with hover color
    fill(0);
    text('Submit', 1120, 693.5);  // Redraw the text on the button
  } else {
    cursor(ARROW);  // Default arrow cursor when not hovering
  }

  // Detect button click
  if (buttonHovered && mouseIsPressed) {
    submitArtSketch();  // Trigger the submit action when clicked
  }
}

// Function that is triggered when the "Submit" button is clicked
function submitArtSketch() {
  // Set the stage to 3 to switch to the tasks page
  stage = 3;  // Change to tasks stage

  // Optionally reset flags or perform any cleanup (if needed)
  isArtSketchStageEntered = false;  // Reset the flag (if relevant)
}


//===============================================================================================================================================================
function drawPosterStage() {
  background(220);

  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -450, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }

  image(poster, 0, 0, width, height);
  fill("black");
  quad(80, 610, 330, 560, 330, 640, 80, 690)

  
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
//===============================================================================================================================================================
function updateEssayText() {
  // Store the value typed in the essay input field
  essayText = essayInput.value();
}
//===============================================================================================================================================================
function updateDiscussText() {
  // Store the value typed in the discussion input field
  discussText = discussInput.value();
}
//===============================================================================================================================================================
function mousePressed() {
  if (!videoStarted) {
    videoStarted = true;
    sunrise.play();
  }
}
//===============================================================================================================================================================
function removeTaskFromList() {
  // Make sure there is a task in the list to remove
  if (taskList.length > 0) {
    // Remove the first task (or whatever logic you need)
    taskList.splice(0, 1);  // Example: remove the first task in the list
    updateTaskListDiv();  // Update the task list UI after removal
  }
}
