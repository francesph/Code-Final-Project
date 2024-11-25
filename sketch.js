let sunrise;
let mainDesk;
let essay;
let discuss;
let poster;
let sketch;
let tasks;
let taskList = [
  { task: "500-word Essay", stage: 4 },
  { task: "paper 2 draft", stage: 4},
  { task: "reading response", stage: 4},
  { task: "abstract", stage: 4},
  { task: "reflection", stage: 5},
  { task: "Discussion Board", stage: 5},
  // { task: "portrait", stage: 6},
  // { task: "contour drawing", stage: 6},
  // { task: "sketch", stage: 6},
  // { task: "art draft", stage: 6},
  // { task: "one-pager", stage: 7},
  // { task: "graphic", stage: 7},
  // { task: "Poster", stage: 7},
];

let submitButton;
let replyButton;
let posterSubmit;

let taskGenerationTimer; // Timer for random task generation
let maxTasks = 10; // Maximum number of tasks that should be displayed on the screen
let taskContainer;
let taskListDiv;

let tasksIcon;
let myFont;
let clockFont;
let bandiFont;

let stage = 0;
// let prevStage = 0;  
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

  myFont= loadFont('assets/FsHandwriting-Regular.ttf');
  clockFont = loadFont('assets/DS-DIGI.TTF');
  bandiFont = loadFont('assets/Core Bandi Face.ttf');

  //buttons
  submitButton = loadImage('assets/submit.png');
  console.log(submitButton.width, submitButton.height); 
  replyButton = loadImage('assets/reply.png');
  posterSubmit = loadImage('assets/poster submit.png');
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

  startGeneratingTasks();
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

  if (stage === 3) {
    drawTasksStage();
  }
}

//===============================================================================================================================================================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // Resize canvas when window is resized
}

function startGeneratingTasks() {
  // If task list has space, generate a task
  if (taskList.length < maxTasks) {
    generateTask();  // Generate a new task
  }

  // Set a random interval to generate tasks between 5 and 50 seconds (5000 to 50000 milliseconds)
  let randomInterval = random(5000, 50000);

  taskGenerationTimer = setTimeout(() => {
    startGeneratingTasks();  // Keep generating tasks at random intervals
  }, randomInterval);
}

// Function to generate and add a new task to the task list
function generateTask() {
  // If there are already 10 tasks, stop generating more
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
  updateTaskListDiv();  // Update the task display immediately after adding a task
  console.log("Task generated:", newTask);
}

// Function to update the task display on the tasks page
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

// Optional: Add a way to remove tasks from the list manually (e.g., on click or timeout)
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
    prevStage = stage;  // Store the current stage before changing
    stage = 1;  // Move to message stage
  }
}

//===============================================================================================================================================================
function drawMessageStage() { //stage 1
  image(mainDesk, 0, -42, width, height * 1.08);
  fill(255, 255, 255, 150); 
  noStroke();
  rect(0, 0, windowWidth, windowHeight);  // Semi-transparent overlay

  // Center the message box
  let boxWidth = windowWidth * 0.35;  // Set the width of the box (40% of the window width)
  let boxHeight = windowHeight * 0.25;  // Set the height of the box (25% of the window height)
  let boxX = (windowWidth - boxWidth) / 2;  // Center the box horizontally
  let boxY = (windowHeight - boxHeight) / 2;  // Center the box vertically 
  // Draw the message box 
  fill(0);
  rect(boxX, boxY, boxWidth, boxHeight, 5);

  // Display the text inside the message box
  fill(255);  // Text color (white)
  textAlign(CENTER, CENTER);  // Align text to center both horizontally and vertically
  textSize(windowWidth * 0.03);
  
  let line1 = "I dont have much homework,";
  let line2 = "but I should try to get ahead";
  let line3 = "so Im not so swamped later.";
  let lineSpacing = 48;

  // Calculate the total height of the text block to center it
  let totalTextHeight = (lineSpacing * 2) + 10 + (lineSpacing * 1); // Total height of 3 lines of text

  // Adjust Y position so that the text is centered vertically in the box
  let textStartY = boxY + (boxHeight - totalTextHeight) / 2; // Center the text vertically in the box

  // Draw the text with vertical spacing
  text(line1, boxX + boxWidth / 2, textStartY);  // Center horizontally, and start vertically
  text(line2, boxX + boxWidth / 2, textStartY + lineSpacing);
  text(line3, boxX + boxWidth / 2, textStartY + (lineSpacing * 2));

  let buttonWidth = 150;  // Width
  let buttonHeight = 50;  // Height
  let buttonX = (windowWidth - buttonWidth) / 2;  // Center horizontally
  let buttonY = boxY + boxHeight - 60;  // Position button below the message box (with padding)

  // View Tasks Button hover area
  let viewTasksButtonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                               mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill("black");
  textSize(26);
  textAlign(CENTER, CENTER);
  text("View Tasks", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);  // Center the text

  // Move to tasks stage when clicked
  if (viewTasksButtonHovered && mouseIsPressed) {
    prevStage = stage;
    stage = 3;  // Move to tasks stage
  }
}

//===============================================================================================================================================================
function drawMainDeskStage() { //stage 2
  
  image(mainDesk, 0, -42, width, height * 1.08);
  fill(0);
  text("x:" + mouseX + " y:" + mouseY, 100, 100);
}

//===============================================================================================================================================================
function drawTasksStage() { 
  // stage 3
  background(200); // Clear the background
  
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

  // Semi-transparent background for the task list container
  fill(255, 255, 0, 180);
  noStroke();
  rect(taskContainerX, taskContainerY, 300, 415);

  // Starting position for tasks
  let taskY = taskContainerY + 10;
  let lineSpacing = 34;

  textAlign(LEFT, TOP);
  fill("black");
  textSize(26);

  // Loop through the taskList array and display tasks
  for (let i = 0; i < taskList.length; i++) {
    let task = taskList[i];

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
      taskList.splice(i, 1); // Remove the clicked task from the task list immediately
    }
  }
}

//===============================================================================================================================================================
function drawEssayStage() {
  background(255);

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
    essayInput.attribute('placeholder', 'Type your essay here...');
    essayInput.elt.style.textAlign = 'left';
    essayInput.elt.style.padding = '10px';
    essayInput.elt.style.resize = 'none';
  }

  image(essay, 0, 0, width, height);
  
  essayInput.show();  // Show the input field

  fill("#e6aa90");
  rect(1198,169.5,79.5,20.5,3);
  textFont(bandiFont);
  textSize(15.5);
  fill(0);
  text('Submit', 1215.7,171.5);
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

  image(discuss, 0, 0, width, height);

  // Show the input field for the discussion stage
  discussInput.show();

  // Set text alignment for the discussion input (instructions text)
  textAlign(LEFT, TOP);
  fill(0);
  textSize(24);

  fill("#e6aa90");
  rect(999,600,121,35.5,6);
  textFont(bandiFont);
  textSize(23);
  fill(0);
  text('Reply', 1033,605);
}

//===============================================================================================================================================================
function drawArtSketchStage() {
  background("#664d35");
  image(sketch, 0, 0, width, height);

  fill("#e6aa90");
  rect(1198,169.5,79.5,20.5,3);
  textFont(bandiFont);
  textSize(15.5);
  fill(0);
  text('Submit', 1215.7,171.5);
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
