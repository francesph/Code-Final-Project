let sunrise;
let song;
let start;
let mainDesk;
let essay;
let discuss;
let sketch;
let tasks;

let buttonX1 = 1290;  // Right edge of the canvas
let buttonY1 = 223;   // Top edge of the canvas
let buttonSize = 30;
let skipButtonSize = 30;  // Size of skip buttons
let skipButtonWidth = skipButtonSize * 2;  // Width for the group of two skip triangles
let spaceBetweenButtons = 80;
let isPlaying = true;

let overallProgress = 0;  // Start at 0% progress
let currentProgress = 0;  // smooth transitions
let targetProgress = 0;   // Target progress of the bar (based on task completion)
let progressSpeed = 0.05;

let taskPage;
let taskList = []; // Start with an empty task list
let taskPool = [
  { task: "500-word Essay", stage: 4 },
  { task: "first impressions of reading", stage: 5 },
  { task: "portrait", stage: 6 },
  { task: "Discussion Board", stage: 5 },
  { task: "reading response", stage: 4 },
  { task: "abstract", stage: 4 },
  { task: "reflection", stage: 5 },
  { task: "paper 2 draft", stage: 4 },
  { task: "contour drawing", stage: 6 },
  { task: "sketch", stage: 6 },
  { task: "art draft", stage: 6 },
  { task: "landscape drawing", stage: 6 },
  { task: "respond to classmate", stage: 5 }
];

let taskGenerationTimer; // Timer for random task generation
let maxTasks = 12;
let taskContainer;
let taskListDiv;

let pencil;
let sketchLayer;
let drawingAreaX = 290;
let drawingAreaY = 125;
let drawingAreaWidth = 880;
let drawingAreaHeight = 587;

let submitButton;
let replyButton;


let currentDay = 1;  // Start from Day 1
let lastMidnight = false;

let tasksIcon;
let myFont;
let clockFont;
let bandiFont;

let stage = 0;
let videoStarted = false;  // Flag to check if the video has started

let tasksActive = false;
let isEssayStageEntered = false;
let isDiscussStageEntered = false;
let isArtSketchStageEntered = false;


let startTime;  // To store the starting time
let elapsedTime;
let startHour = 12.5;  // Start at 1:00 PM
let startMinute = 0;


let areaX = 405;
let areaY = 227;
let areaWidth = 892;
let areaHeight = 430;

let lastFlashTime = 0;
let flashInterval = 2000; // flash (1 second)
let flashMessages = [
  "Work faster!",
  "Are you lazy? You should be done by now!",
  "why is it taking you this long??",
  "FOCUS!! You are so far behind",
  "these assignments aren't even hard, why is it taking you this long?",
  "just a few more assignments and then you can enjoy the weekend"
];
let currentFlashMessage = "";
let showText = false;

let wordCount = 0;

//=============================================================================================
function preload() {
  start = loadImage('assets/start page.png');
  song = loadSound("assets/floatinggarden.mp3");
  sunrise = createVideo(['assets/newsunrise.mp4']);
  sunrise.hide();  // Hide video from HTML page

  mainDesk = loadImage('assets/main.png');
  essay = loadImage('assets/essay.png');
  discuss = loadImage('assets/discuss.png');

  tasks = loadImage('assets/tasks1.png'); //do not use this
  taskPage = loadImage('assets/taskmusic.png');
  sketch = loadImage('assets/sketch.png');


  myFont = loadFont('assets/FsHandwriting-Regular.ttf');
  clockFont = loadFont('assets/DS-DIGII.TTF');
  bandiFont = loadFont('assets/Core Bandi Face.ttf');


  pencil = loadImage('assets/pencil.png', function () {
    let aspectRatio = pencil.width / pencil.height;

    let newWidth = 672;

    let newHeight = newWidth / aspectRatio;

    pencil.resize(newWidth, newHeight);

    console.log('Pencil image loaded and resized:', pencil.width, pencil.height);
  }, function () {
    console.error('Error loading pencil image');
  });
}
function setup() {
  createCanvas(1513, 831);
  textFont(myFont);


  sunrise.loop();


  essayInput = createElement('textarea', '');
  essayInput.position(608.5, 240);
  essayInput.size(525, 350);
  essayInput.attribute('placeholder', 'Type your essay here...');
  essayInput.elt.style.textAlign = 'left';
  essayInput.elt.style.padding = '10px';
  essayInput.elt.style.resize = 'none';
  essayInput.elt.style.border = 'none';
  essayInput.hide();

  discussInput = createElement('textarea', '');
  discussInput.position(543, 358);
  discussInput.size(555, 182);
  discussInput.attribute('placeholder', 'Type your response here...');
  discussInput.elt.style.textAlign = 'left'; // Align text to the left
  discussInput.elt.style.padding = '10px';
  discussInput.elt.style.resize = 'none';
  discussInput.elt.style.border = 'none';
  discussInput.hide();

  taskContainer = createDiv();
  taskContainer.style('position', 'absolute');
  taskContainer.style('top', '200px');
  taskContainer.style('left', '20px');
  taskContainer.style('width', '40%');
  taskContainer.style('height', '400px');
  taskContainer.style('overflow-y', 'scroll');
  taskContainer.style('background-color', 'rgba(255, 255, 255, 0.8)');
  taskContainer.style('border-radius', '10px');
  taskContainer.style('padding', '10px');
  taskContainer.hide(); // Hide it initially, show it only on tasks page


  taskListDiv = createDiv();
  taskContainer.child(taskListDiv);

  startGeneratingTasks();

  startTime = millis();


  sketchLayer = createGraphics(width, height);
}
function addTask(task) {
  taskList.push(task);  // Add a new task
  updateProgressBar();  // Update the progress bar
}
function removeTaskFromList() {
  if (taskList.length > 0) {
    taskList.splice(0, 1);  // Remove the first task
    updateProgressBar();  // Update the progress bar
  }
}
function updateProgressBar() {
  // You can call this whenever the task list is updated
  let totalWidth = 400;  // Width of the progress bar
  let height = 20;  // Height of the progress bar
  drawProgressBar("Tasks", taskList, 50, 50, totalWidth, height); // Adjust x, y, and size as needed
}
function drawProgressBar(label, taskList, x, y, width, height) {
  let numTasks = taskList.length;
  let maxTasks = 12;

  // Calculate progress: As the number of tasks increases, progress decreases from 100% to 0%
  let newProgress = (maxTasks - numTasks) / maxTasks;  // Target progress value

  targetProgress = newProgress;
  currentProgress = lerp(currentProgress, targetProgress, 0.1);

  let filledHeight = height * currentProgress;

  fill(200);  // Light gray background
  noStroke();
  rect(x, y - height / 2, width, height, 4);  // Full bar (vertical)

  //(lerp red and green)
  let startColor = color(255, 0, 0);  // Red (start)
  let endColor = color(0, 255, 0);    // Green (end)
  let gradientColor = lerpColor(startColor, endColor, currentProgress);  // Get color at current progress

  fill(gradientColor);
  rect(x, y - height / 2 + height - filledHeight, width, filledHeight, 4);


  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, x + width / 2, y - height / 2 - 20);


  textSize(14);
  fill(0);  // White text for better contrast
  text(Math.round(currentProgress * 100) + "%", x + width / 2, y);  // Percentage inside the bar
}
function drawPlayPauseButton(x, y, size) {
  // Define button colors
  let buttonColor = '#897689';
  let playColor = '#bbb2bb';
  let pauseColor = '#bbb2bb';

  // Draw background circle for button
  fill(buttonColor);
  noStroke();
  ellipse(x, y, size, size);

  // Check the current state (play/pause) to draw either the play or pause symbol
  if (isPlaying) {
    // Draw Pause Button (Double Vertical Lines)
    fill(pauseColor);
    let barWidth = size / 8;
    let barSpacing = size / 6;  // Reduced spacing to bring bars closer together

    // Left bar
    rect(x - barSpacing, y - size / 4, barWidth, size / 2,3);
    // Right bar
    rect(x + barSpacing - barWidth, y - size / 4, barWidth, size / 2,3);
  } else {
    // Draw Play Button (Triangle)
    fill(playColor);
    let triangleSize = size / 2;
    triangle(
      x - triangleSize / 2, y - triangleSize / 2,  // Left point
      x + triangleSize / 2, y,                      // Right point
      x - triangleSize / 2, y + triangleSize / 2   // Bottom point
    );
  }
}
function drawStage1() {
  // Example of how to call the function in Stage 1
  drawPlayPauseButton(width / 2, height / 1.5, buttonSize);
}

function draw() {
  // Display the video on all stages if it's started
  if (videoStarted) {
    let sunriseWidth = 750
    let sunriseHeight = 420
    image(sunrise, -70, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }
  currentProgress = lerp(currentProgress, targetProgress, progressSpeed);
  switch (stage) {
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
      updateDayCounter();
      drawDayCounter();
      textFont(bandiFont);
      textSize(26);
      drawProgressBar("Tasks", taskList, width - 55, height / 2, 30, 500);
      // clock();
      break;
    case 4: // Essay stage
      drawEssayStage();
      updateDayCounter();
      drawDayCounter();
      clock();
      textFont(bandiFont);
      textSize(26);
      drawProgressBar("Tasks", taskList, width - 55, height / 2, 30, 500);
      break;
    case 5: // Discussion Board stage
      drawDiscussionStage();
      updateDayCounter();
      drawDayCounter();
      clock();
      textFont(bandiFont);
      textSize(26);
      drawProgressBar("Tasks", taskList, width - 55, height / 2, 30, 500);
      break;
    case 6: // Art Sketch stage
      drawArtSketchStage();
      updateDayCounter();
      drawDayCounter();
      textFont(bandiFont);
      textSize(26);
      drawProgressBar("Tasks", taskList, width - 55, height / 2, 30, 500);
      break;
  }
}

function updateWordCount() {

  let inputText = essayInput.value();

  let words = inputText.trim().split(/\s+/);


  wordCount = words.filter(word => word.length > 0).length;
}
function displayWordCount() {
  fill("black");
  textSize(15);
  text("Word Count: " + wordCount, 470, 630);
}
function handleFlashingText() {

  let currentTime = millis();


  if (currentTime - lastFlashTime >= flashInterval) {

    showText = !showText;

    lastFlashTime = currentTime;


    currentFlashMessage = random(flashMessages);
  }

  if (showText) {
    push();

    fill("red");
    textSize(32);
    textAlign(CENTER, TOP);

    text(currentFlashMessage, width / 2, 30);

    pop();
  }
}
function clock() {
  fill("white");  // Text color
  textFont(clockFont);
  textAlign(CENTER, CENTER);
  textSize(80);


  let elapsedTime = millis() - startTime;
  let speedUpFactor = 3760;
  let virtualSeconds = (elapsedTime / 1000) * speedUpFactor;
  let startOffsetInSeconds = startHour * 3600 + startMinute * 60;
  virtualSeconds += startOffsetInSeconds;

  let totalVirtualSeconds = virtualSeconds % 86400;

  let virtualHour = floor(totalVirtualSeconds / 3600);  //  hour
  let virtualMinute = floor((totalVirtualSeconds % 3600) / 60);  // minute

  let noon = virtualHour >= 12 ? " PM" : " AM";
  if (virtualMinute < 10) {
    virtualMinute = "0" + virtualMinute;
  }
  if (virtualHour === 0) {
    virtualHour = 12;
  } else if (virtualHour > 12) {
    virtualHour -= 12;
  }

  let clockX = 200;
  let clockY = 620;
  push();
  let rotationAngle = radians(-11);
  translate(clockX, clockY);
  rotate(rotationAngle);
  text(virtualHour + ":" + virtualMinute + noon, 0, 0);
  pop();
}
function updateDayCounter() {
  let elapsedTime = millis() - startTime;
  let speedUpFactor = 3760;
  let virtualSeconds = (elapsedTime / 1000) * speedUpFactor;


  let startOffsetInSeconds = startHour * 3600 + startMinute * 60;
  virtualSeconds += startOffsetInSeconds;

  //24 hours (86400 seconds)
  let totalVirtualSeconds = virtualSeconds % 86400;
  let virtualHour = floor(totalVirtualSeconds / 3600);
  let virtualMinute = floor((totalVirtualSeconds % 3600) / 60);

  if (virtualHour === 0 && virtualMinute === 0 && !lastMidnight) {
    console.log(">>> It's 12:00 AM, Incrementing Day...");
    currentDay++;
    lastMidnight = true;
    console.log(">>> New Day: " + currentDay);
  } else if (virtualHour !== 0 || virtualMinute !== 0) {
    lastMidnight = false;
  }
}
function drawDayCounter() {
  fill(0);
  textFont(myFont);
  textSize(50);
  textAlign(LEFT, TOP);
  text("Day " + currentDay, 1380, 35);
}
function startGeneratingTasks() {

  let randomInterval = random(1000, 7000); //1-10 seconds

  taskGenerationTimer = setTimeout(() => {
    generateTask();
    startGeneratingTasks();
  }, randomInterval);
}
function generateTask() {
  // If already 12 tasks, stop generating more
  if (taskList.length >= maxTasks) {
    return; // Don't generate more tasks until there's space
  }

  // Check tasks left
  if (taskPool.length === 0) {
    console.log("Reshuffling tasks...");
    reshuffleTaskPool(); // Reshuffle
  }

  // Randomly pick
  let randomIndex = floor(random(taskPool.length));
  let newTask = taskPool.splice(randomIndex, 1)[0]; // Remove and get the selected task

  // Add the new task to the taskList
  taskList.push(newTask);

  updateTaskListDiv();
  console.log("Task generated:", newTask);
}
function reshuffleTaskPool() {
  taskPool = [
    { task: "500-word Essay", stage: 4 },
    { task: "first impressions of reading", stage: 5 },
    { task: "portrait", stage: 6 },
    { task: "Discussion Board", stage: 5 },
    { task: "reading response", stage: 4 },
    { task: "abstract", stage: 4 },
    { task: "reflection", stage: 5 },
    { task: "paper 2 draft", stage: 4 },
    { task: "contour drawing", stage: 6 },
    { task: "sketch", stage: 6 },
    { task: "art draft", stage: 6 },
    { task: "landscape drawing", stage: 6 },
    { task: "respond to classmate", stage: 5 }
  ];

  shuffleArray(taskPool);
  console.log("Task pool reshuffled.");
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}
function updateTaskListDiv() {
  taskListDiv.html(''); // Clear 

  // Display tasks from list
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
//===============================================================================================================================================================
function drawStartPage() {
  image(start, 0, 0, width, height);

  fill(0);
  textSize(12);
  text("Music: https://www.bensound.com License code: RRF6OPMJLACN0KSW   Lee, Hyum-Seung Hahm, Dae-Hoon Designers", 280, 820);

  let buttonWidth = 150;
  let buttonHeight = 50;

  let buttonX = width / 2 - buttonWidth / 2;
  let buttonY = height / 1.6 - buttonHeight / 2;

  let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  fill(buttonHovered ? "#c8b699" : "#e1cdb0");
  rect(buttonX, buttonY, buttonWidth, buttonHeight);

  textSize(30);
  fill("black");
  textAlign(CENTER, CENTER);
  text("START", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

  if (buttonHovered && mouseIsPressed) {
    console.log("Start button clicked!");
    startSound();  // Ensure the sound starts when the start button is clicked
    stage = 1;
  }
}
function startSound() {
  let audioContext = getAudioContext();
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('AudioContext resumed');
      if (!song.isPlaying()) {
        song.loop();  // Start looping the song
        song.setVolume(1);  // Set volume to 1
        console.log('Song is playing now!');
      }
    });
  } else {
    if (!song.isPlaying()) {
      song.loop();
      song.setVolume(1);
      console.log('Song is playing now!');
    }
  }
}
//===============================================================================================================================================================
function drawMessageStage() { // Stage 1
  if (videoStarted) {
    let sunriseWidth = 750
    let sunriseHeight = 420
    image(sunrise, -70, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }
  image(mainDesk, 0, -42, width, height * 1.08);
  drawPlayPauseButton(buttonX1, buttonY1, buttonSize);
  fill(255, 255, 255, 150);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);

  // Center the message box
  let boxWidth = 780
  let boxHeight = 450
  let boxX = width / 2 - boxWidth / 2;
  let boxY = height / 2 - boxHeight / 2;
  // Draw the message box 
  fill(0);
  rect(boxX, boxY, boxWidth, boxHeight, 5);

  //words
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(80);

  let line1 = "I dont have much ";
  let line2 = "homework, but I should ";
  let line3 = "try to get ahead so Im";
  let line4 = "not too swamped later.";
  let line5 = "Its just a few assignments."
  let lineSpacing = 62;

  let totalTextHeight = (lineSpacing * 4) + 10 + (lineSpacing * 1);

  let textStartY = boxY + (boxHeight - totalTextHeight) / 2; // Center vert in box

  text(line1, boxX + boxWidth / 2, textStartY);
  text(line2, boxX + boxWidth / 2, textStartY + lineSpacing);
  text(line3, boxX + boxWidth / 2, textStartY + (lineSpacing * 2));
  text(line4, boxX + boxWidth / 2, textStartY + (lineSpacing * 3));
  text(line5, boxX + boxWidth / 2, textStartY + (lineSpacing * 4));

  let buttonWidth = 150;
  let buttonHeight = 50;

  let buttonX = width / 2 - buttonWidth / 2;
  let buttonY = width / 2.36 - buttonWidth / 2;

  // View Tasks Button hover area
  let viewTasksButtonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill("black");
  textSize(29);
  textAlign(CENTER, CENTER);
  text("View Tasks", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);


  if (viewTasksButtonHovered && mouseIsPressed) {
    prevStage = stage;
    stage = 3;  // Move to tasks stage
    tasksActive = true;
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
  if (!tasksActive) return;

  // Clear the background and display tasks
  background(200);

  if (videoStarted) {
    let sunriseWidth = 750
    let sunriseHeight = 420
    image(sunrise, -70, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);
  }


  // Display the main desk image
  image(mainDesk, 0, -42, width, height * 1.08);
  image(taskPage, 0, -42, width, height * 1.08);

  let tasksWidth = 400;
  let tasksHeight = 706;
  let tasksX = width / 2 - tasksWidth / 2;
  let tasksY = height / 2 - tasksHeight / 2;

  
  let taskContainerX = 620;
  let taskContainerY = tasksY + 164;
  let taskContainerWidth = windowWidth / 2;
  let taskContainerHeight = windowHeight * 0.4;

  // Starting position for tasks
  let taskY = taskContainerY + 10;
  let lineSpacing = 35;

  textFont(myFont);
  textAlign(LEFT, TOP);
  fill("black");
  textSize(26);


  for (let i = 0; i < taskList.length; i++) {
    let task = taskList[i];

    let buttonWidth = 300;
    let buttonX = taskContainerX + 10;  // Padding from the left
    let buttonY = taskY + i * lineSpacing;  // Space between tasks

    // Check if the mouse is hovering over the task
    let isHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY && mouseY <= buttonY + lineSpacing;

    // Change text color if hovered
    fill(isHovered ? "#F2A6C8" : "black");

    // Display task name
    text(task.task, buttonX + 10, buttonY + 10);

    if (isHovered && mouseIsPressed) {
      currentTask = task.task;
      stage = task.stage;


      taskList.splice(i, 1);


      console.log("Navigating to stage:", stage);
    }
    handleFlashingText();
  }
  drawPlayPauseButton(buttonX1, buttonY1, buttonSize);
}
//===============================================================================================================================================================
function drawEssayStage() {  // Stage 4
  if (stage === 4) {
    background(255);

    // Display video if it's started
    if (videoStarted) {
      let sunriseWidth = 750
      let sunriseHeight = 420
      image(sunrise, -450, -10, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
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

    // Clear the text input 
    if (!isEssayStageEntered) {
      essayInput.value('');
      isEssayStageEntered = true;
    }

    image(essay, 0, 0, width, height);
    fill("black");
    quad(80, 610, 330, 560, 330, 640, 80, 690)
    essayInput.show();

    // Submit button
    fill("#e6aa90");
    rect(1198, 169.5, 79.5, 20.5, 3);
    textFont(bandiFont);
    textSize(15.5);
    fill(0);
    text('Submit', 1238, 178.5);

    let buttonX = 1198;
    let buttonY = 169.5;
    let buttonWidth = 79.5;
    let buttonHeight = 20.5;

    let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY && mouseY <= buttonY + buttonHeight;


    if (buttonHovered) {
      cursor(HAND);
      fill("#f2c6b3");
      rect(buttonX, buttonY, buttonWidth, buttonHeight, 3);
      fill(0);
      text('Submit', 1238, 178.5);
    } else {
      cursor(ARROW);
    }

    // Detect button click
    if (buttonHovered && mouseIsPressed) {
      submitEssay();
    }
    handleFlashingText();
    updateWordCount();
    displayWordCount();
  }
}
function submitEssay() {

  if (essayInput) {
    essayInput.hide();
  }
  stage = 3;  // Switch to tasks page
  isEssayStageEntered = false;
}
//===============================================================================================================================================================
function drawDiscussionStage() { //stage 5
  background(200);

  if (videoStarted) {
    let sunriseWidth = 750
    let sunriseHeight = 420
    image(sunrise, -450, -10, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
  }
  if (!discussInput) {
    discussInput = createElement('textarea', '');
    discussInput.position(527, 358);
    discussInput.size(555, 182);
    discussInput.attribute('placeholder', 'Type your response here...');
    discussInput.elt.style.textAlign = 'left'; // Align text to the left
    discussInput.elt.style.padding = '10px';
    discussInput.elt.style.resize = 'none';
    discussInput.hide();
  }
  if (!isDiscussStageEntered) {
    discussInput.value('');  // Reset the content to empty string
    isDiscussStageEntered = true;
  }

  image(discuss, 0, 0, width, height);
  fill("black");
  quad(80, 610, 330, 560, 330, 640, 80, 690)

  discussInput.show();


  textAlign(LEFT, TOP);
  fill(0);
  textSize(24);

  fill("#e6aa90");
  rect(1015, 600, 121, 35.5, 6);
  textFont(bandiFont);
  textSize(23);
  fill(0);
  text('Reply', 1049, 605);

  let buttonX = 1015;
  let buttonY = 600;
  let buttonWidth = 121;
  let buttonHeight = 35.5;

  let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY && mouseY <= buttonY + buttonHeight;


  if (buttonHovered) {
    cursor(HAND);
    fill("#f2c6b3");
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 6);
    fill(0);
    text('Reply', 1049, 605);
  } else {
    cursor(ARROW);
  }


  if (buttonHovered && mouseIsPressed) {
    submitDiscuss();  // Trigger the submit action when clicked
  }
  handleFlashingText();
}
function submitDiscuss() {
  if (discussInput) {
    discussInput.hide();
  }
  stage = 3;
  isDiscussStageEntered = false;
}
//===============================================================================================================================================================
function drawArtSketchStage() { //stage 6
  background("#664d35");

  // Draw the sketch background
  image(sketch, 0, 0, width, height);
  image(sketchLayer, 0, 0);

  fill(255, 255, 255, 0);
  noStroke();
  rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);

  // Button styling
  fill("#e6aa90");
  rect(1100, 689.5, 83.5, 24.5, 4);
  textFont(bandiFont);
  textSize(15.5);
  fill(0);

  let buttonX = 1100;
  let buttonY = 689.5;
  let buttonWidth = 83.5;
  let buttonHeight = 24.5;

  textAlign(CENTER, CENTER);
  text('Submit', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2.3);  // Centered text

  // Check if the mouse is hovering over the button
  let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  if (buttonHovered) {
    cursor(HAND);
    fill("#f2c6b3");
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 4);
    fill(0);
    text('Submit', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2.3);  // Centered text
  } else {
    cursor(ARROW);
  }

  // Submit the art sketch when the button is clicked
  if (buttonHovered && mouseIsPressed) {
    submitArtSketch();
  }

  if (mouseIsPressed && mouseX >= drawingAreaX && mouseX <= drawingAreaX + drawingAreaWidth &&
    mouseY >= drawingAreaY && mouseY <= drawingAreaY + drawingAreaHeight) {
    drawOnCanvas(mouseX, mouseY);
  }


  image(pencil, mouseX - pencil.width / 3.2, mouseY - pencil.height / 1.099);

  // Handle flashing text if needed
  handleFlashingText();
}

function drawOnCanvas(x, y) {

  sketchLayer.stroke(0);
  sketchLayer.strokeWeight(4);
  sketchLayer.line(pmouseX, pmouseY, x, y);
}
function submitArtSketch() {

  sketchLayer.clear();
  stage = 3;  // Change to tasks stage

  isArtSketchStageEntered = false;
}
//===============================================================================================================================================================
//===============================================================================================================================================================
function drawButton(x, y, w, h, label, callback) {
  let buttonHovered = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
  fill(buttonHovered ? "#F2A6C8" : "pink");
  rect(x, y, w, h);
  fill("black");
  textSize(26);
  text(label, x + w / 2, y + h / 2);

  if (buttonHovered && mouseIsPressed) {
    callback();
  }
}
//===============================================================================================================================================================
function updateEssayText() {

  essayText = essayInput.value();
}
//===============================================================================================================================================================
function updateDiscussText() {

  discussText = discussInput.value();
}
//===============================================================================================================================================================
function mousePressed() {
  if (!videoStarted) {
    videoStarted = true;
    sunrise.play();
  }
  let buttonX1 = 1290;  // Right edge of the canvas
  let buttonY1 = 223;   // Top edge of the canvas
  let buttonSize = 40;

  // Check if the mouse is within the bounds of the play/pause button
  if (mouseX >= buttonX1 && mouseX <= buttonX1 + buttonSize && mouseY >= buttonY1 - buttonSize / 2 && mouseY <= buttonY1 + buttonSize / 2) {
    // Toggle play/pause functionality
    if (isPlaying) {
      song.pause();  // Pause the song
      isPlaying = false;
      console.log('Song paused');
    } else {
      song.loop();   // Play the song
      isPlaying = true;
      console.log('Song playing');
    }
  }
}
//===============================================================================================================================================================
function removeTaskFromList() {

  if (taskList.length > 0) {

    taskList.splice(0, 1);
    updateTaskListDiv();
  }
}
