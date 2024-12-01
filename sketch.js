let sunrise;
let song;
let start;
let mainDesk;
let essay;
let discuss;
let poster;
let sketch;
let tasks;
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
let posterSubmit;

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
let isPosterStageEntered = false;

let startTime;  // To store the starting time
let elapsedTime;
let startHour = 12.5;  // Start at 1:00 PM
let startMinute = 0;


let areaX = 405;
let areaY = 227;
let areaWidth = 892;
let areaHeight = 430;

let lastFlashTime = 0; // Variable to keep track of the last flash time
let flashInterval = 1000; // Time in milliseconds for each flash (1 second)
let flashMessages = [
  "Work faster!",
  "Are you lazy? You should be done by now!",
  "why is it taking you this long??",
  "FOCUS!! You are so far behind",
  "these assignments aren't even hard, why is it taking you this long",
  "just a few more assignments and then you can enjoy the weekend"
];
let currentFlashMessage = "";  // Store the current flashing message
let showText = false;

let wordCount=0;

// Preload assets
function preload() {
  start = loadImage('assets/start page.png');
  song = loadSound("assets/floatinggarden.mp3");
  sunrise = createVideo(['assets/newsunrise.mp4']);
  sunrise.hide();  // Hide video from HTML page

  mainDesk = loadImage('assets/desk.png');
  essay = loadImage('assets/essay.png');
  discuss = loadImage('assets/discuss.png');
  poster = loadImage('assets/poster.png');
  tasks = loadImage('assets/tasks1.png');
  sketch = loadImage('assets/sketch.png');
  tasksIcon = loadImage('assets/tasks button.png');

  myFont = loadFont('assets/FsHandwriting-Regular.ttf');
  clockFont = loadFont('assets/DS-DIGII.TTF');
  bandiFont = loadFont('assets/Core Bandi Face.ttf');

  // Buttons
  submitButton = loadImage('assets/submit.png');
  replyButton = loadImage('assets/reply.png');
  posterSubmit = loadImage('assets/poster submit.png');
  pencil = loadImage('assets/pencil.png', function() {
    // Calculate the aspect ratio
    let aspectRatio = pencil.width / pencil.height;

    // Desired width (you can change this value to any desired width)
    let newWidth = 672;

    // Calculate the new height to maintain the aspect ratio
    let newHeight = newWidth / aspectRatio;

    // Resize the pencil image while maintaining aspect ratio
    pencil.resize(newWidth, newHeight);

    console.log('Pencil image loaded and resized:', pencil.width, pencil.height);
  }, function() {
    console.error('Error loading pencil image');
  });
}
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
  essayInput.elt.style.border = 'none';
  essayInput.hide(); // Initially hidden, only shown in the essay stage

  discussInput = createElement('textarea', '');
  discussInput.position(543, 358);
  discussInput.size(555, 182);
  discussInput.attribute('placeholder', 'Type your response here...');
  discussInput.elt.style.textAlign = 'left'; // Align text to the left
  discussInput.elt.style.padding = '10px';  // Add padding for better appearance
  discussInput.elt.style.resize = 'none';
  discussInput.elt.style.border = 'none';
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

  startTime = millis();
  
  
  sketchLayer = createGraphics(width, height);
}

function draw() {
  // Display the video on all stages if it's started
  if (videoStarted) {
    let sunriseWidth = windowWidth * 0.5;
    let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
    image(sunrise, -70, -20, sunriseWidth * 1.2, sunriseHeight * 1.2);  // Display video in top-left corner
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
      updateDayCounter();
      drawDayCounter();
      // clock();
      break;
    case 4: // Essay stage
      drawEssayStage();
      updateDayCounter();
      drawDayCounter();
      clock();

      break;
    case 5: // Discussion Board stage
      drawDiscussionStage();
      updateDayCounter();
      drawDayCounter();
      clock();
      break;
    case 6: // Art Sketch stage
      drawArtSketchStage();
      updateDayCounter();
      drawDayCounter();

      break;
  }

}
function updateWordCount() {
  // Get the text from the input field
  let inputText = essayInput.value();
  
  // Split the input text into words based on spaces
  // Remove leading/trailing spaces and split by one or more spaces
  let words = inputText.trim().split(/\s+/);
  
  // Update the word count (exclude empty strings)
  wordCount = words.filter(word => word.length > 0).length;
}
function displayWordCount() {
  fill("black");
  textSize(15);
  text("Word Count: " + wordCount, 470, 630);  // Display word count near the top
}
function handleFlashingText() {
  // Get the current time in milliseconds
  let currentTime = millis();

  // Check if the flash interval has passed
  if (currentTime - lastFlashTime >= flashInterval) {
    // Toggle the visibility of the flashing text
    showText = !showText;

    // Update the last flash time to the current time
    lastFlashTime = currentTime;

    // Randomly pick a new message from the array
    currentFlashMessage = random(flashMessages);
  }

  // Show the flashing text if 'showText' is true
  if (showText) {
    push();  
    
    fill("red");  
    textSize(32); 
    textAlign(CENTER, TOP); 

    // Draw the flashing text at the center of the screen
    text(currentFlashMessage, width / 2, 30);
  
    pop();
  }
}
function clock() {
  fill("white");  // Text color
  textFont(clockFont);
  textAlign(CENTER, CENTER);
  textSize(80);

  // Get elapsed time in milliseconds
  let elapsedTime = millis() - startTime;  

  // Speed factor: 1 second in real-time corresponds to 3760 virtual seconds
  let speedUpFactor = 3760;  

  // Virtual time in seconds (adjusted by the speed factor)
  let virtualSeconds = (elapsedTime / 1000) * speedUpFactor;


  let startOffsetInSeconds = startHour * 3600 + startMinute * 60;  
  virtualSeconds += startOffsetInSeconds;  

  let totalVirtualSeconds = virtualSeconds % 86400;  


  let virtualHour = floor(totalVirtualSeconds / 3600);  // Virtual hour
  let virtualMinute = floor((totalVirtualSeconds % 3600) / 60);  // Virtual minute

  // Debugging log for virtual time
  console.log("Virtual Time: " + virtualHour + ":" + virtualMinute);

  // Format the time correctly for display
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
  let rotationAngle = radians(-11);  // Rotate the clock slightly
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
  
  // Normalize to 24 hours (86400 seconds)
  let totalVirtualSeconds = virtualSeconds % 86400;  

  // Calculate the current virtual hour and minute
  let virtualHour = floor(totalVirtualSeconds / 3600);
  let virtualMinute = floor((totalVirtualSeconds % 3600) / 60);


  console.log("Virtual Time: " + virtualHour + ":" + virtualMinute);


  if (virtualHour === 0 && virtualMinute === 0 && !lastMidnight) {
    console.log(">>> It's 12:00 AM, Incrementing Day...");
    currentDay++;  // Increment the day counter
    lastMidnight = true;  // Prevent multiple increments during the same virtual day
    console.log(">>> New Day: " + currentDay);
  } else if (virtualHour !== 0 || virtualMinute !== 0) {
    lastMidnight = false;  // Reset flag when it's not midnight
  }
}
function drawDayCounter() {
  fill(0);  // White color for the text
  textSize(50);
  textAlign(LEFT, TOP);
  text("Day " + currentDay, 1380, 35);  // Display the current day at the top-left
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // Resize canvas when window is resized
}
function startGeneratingTasks() {

  let randomInterval = random(1000, 10000); //1-10 seconds

  taskGenerationTimer = setTimeout(() => {
    generateTask();  // Generate a new task
    startGeneratingTasks();  // Recursively keep generating tasks
  }, randomInterval);
}
function generateTask() {
  // If there are already 12 tasks, stop generating more
  if (taskList.length >= maxTasks) {
    return; // Don't generate more tasks until there's space
  }

  // Check if there are tasks left in the pool
  if (taskPool.length === 0) {
    console.log("Reshuffling tasks...");
    reshuffleTaskPool(); // Reshuffle when pool is empty
  }

  // Randomly pick a task from the taskPool
  let randomIndex = floor(random(taskPool.length));
  let newTask = taskPool.splice(randomIndex, 1)[0]; // Remove and get the selected task

  // Add the new task to the taskList
  taskList.push(newTask);

  updateTaskListDiv();  
  console.log("Task generated:", newTask);
}
function reshuffleTaskPool() {
  // Refill taskPool with all the tasks that have been used
  taskPool = [
    { task: "500-word Essay", stage: 4 },
    { task: "Poster", stage: 7 },
    { task: "portrait", stage: 6 },
    { task: "Discussion Board", stage: 5 },
    { task: "reading response", stage: 4 },
    { task: "abstract", stage: 4 },
    { task: "reflection", stage: 5 },
    { task: "paper 2 draft", stage: 4 },
    { task: "contour drawing", stage: 6 },
    { task: "sketch", stage: 6 },
    { task: "art draft", stage: 6 },
    { task: "one-pager", stage: 7 },
    { task: "graphic", stage: 7 }
  ];

  // Optional: Shuffle the taskPool to randomize the order
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
function drawStartPage() {
  image(start, 0, 0, width, height);
  fill(0)
  textSize(12)
  text("Music: https://www.bensound.com License code: RRF6OPMJLACN0KSW   Lee, Hyum-Seung Hahm, Dae-Hoon Designers", 280,820)

  // Define button position and size
  let buttonX = windowWidth / 2 - 75;
  let buttonY = windowHeight / 1.6 - 25;
  let buttonWidth = 150;
  let buttonHeight = 50;

  // Check if the mouse is over the button
  let buttonHovered = mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                      mouseY >= buttonY && mouseY <= buttonY + buttonHeight;

  // Set button color based on hover state
  fill(buttonHovered ? "#c8b699" : "#e1cdb0");
  rect(buttonX, buttonY, buttonWidth, buttonHeight);  // Draw the rectangle

  // Draw the "Start" text in the center of the button
  textSize(30);
  fill("black");
  textAlign(CENTER, CENTER);  // Center the text both horizontally and vertically
  text("START", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

  // Move to the next stage when the button is clicked
  if (buttonHovered && mouseIsPressed) {
    console.log("Start button clicked!");  // This will confirm the button is being clicked
    stage = 1;
    startSound();
  }
}

function startSound() {
  // Get the AudioContext and resume it
  let audioContext = getAudioContext();
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('AudioContext resumed');
      if (!song.isPlaying()) {
        song.loop();  // Start the sound and make it loop
        song.setVolume(1);  // Set volume to full
        console.log('Song is playing now!');
      }
    });
  } else {
    // If AudioContext is already running, just play the sound
    if (!song.isPlaying()) {
      song.loop();  // Start the sound and make it loop
      song.setVolume(1);  // Set volume to full
      console.log('Song is playing now!');
    }
  }
}

//===============================================================================================================================================================
function drawMessageStage() { // Stage 1
  image(mainDesk, 0, -42, width, height * 1.08);
  fill(255, 255, 255, 150); 
  noStroke();
  rect(0, 0, windowWidth, windowHeight); 

  // Center the message box
  let boxWidth = windowWidth * 0.5;  
  let boxHeight = windowHeight * 0.5; 
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

  // Loop through the taskList and display the tasks
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

    if (isHovered && mouseIsPressed) {
      currentTask = task.task;  // Set the current task to the clicked task
      stage = task.stage;  // Navigate to the corresponding task stage
    
      // Optionally: Remove the clicked task from the task list immediately
      taskList.splice(i, 1); 
    
      // Optionally log the task navigation for debugging purposes
      console.log("Navigating to stage:", stage);
    }
    handleFlashingText();
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
    text('Submit', 1238, 178.5);

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
      text('Submit', 1238, 178.5);  // Redraw the text on the button
    } else {
      cursor(ARROW);  // Default arrow cursor
    }

    // Detect button click
    if (buttonHovered && mouseIsPressed) {
      submitEssay();  // Trigger the submit action when clicked
    }
    handleFlashingText();
    updateWordCount();
    displayWordCount();
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
function drawDiscussionStage() { //stage 5
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
  handleFlashingText();
}
function submitDiscuss() {
  if (discussInput) {
    discussInput.hide();  // Hide the textarea input when leaving the essay stage
  }
  stage = 3;
  isDiscussStageEntered = false;
}
//===============================================================================================================================================================
function drawArtSketchStage() { //stage 6
  background("#664d35");
  
  // Draw the sketch background
  image(sketch, 0, 0, width, height);

  // Draw the user's sketch (from the sketchLayer)
  image(sketchLayer, 0, 0);

  image(pencil, mouseX - pencil.width / 3.2, mouseY - pencil.height / 1.099);
  // Draw a border around the drawing area for visualization (optional)
  fill(255, 255, 255, 0);  // Red with some transparency for the border
  noStroke();
  rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);  // Draw the restricted drawing area
  
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
  
  // Draw with mouse inside the defined area
  if (mouseIsPressed && mouseX >= drawingAreaX && mouseX <= drawingAreaX + drawingAreaWidth &&
      mouseY >= drawingAreaY && mouseY <= drawingAreaY + drawingAreaHeight) {
    drawOnCanvas(mouseX, mouseY);
  }
  handleFlashingText();
}
function drawOnCanvas(x, y) {
  
  sketchLayer.stroke(0);  // Set stroke color (black)
  sketchLayer.strokeWeight(4);  // Set stroke weight (thickness of the line)
  sketchLayer.line(pmouseX, pmouseY, x, y);  // Draw a line from previous mouse position to current
}
function submitArtSketch() {
  // Clear the sketch layer to reset the drawing
  sketchLayer.clear();  // This removes everything from the sketchLayer

  // Set the stage to 3 to switch to the tasks page
  stage = 3;  // Change to tasks stage

  // Optionally reset flags or perform any cleanup (if needed)
  isArtSketchStageEntered = false;  // Reset the flag (if relevant)
}
//===============================================================================================================================================================

// function drawRestrictedAreaBorder() {
//   // Set border color and thickness
//   stroke(0);  // Black border color
//   strokeWeight();  // Border thickness
//   noFill();  // No fill color inside the rectangle

//   // Draw the rectangle (border) around the restricted area
//   rect(areaX, areaY, areaWidth, areaHeight);
// }

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
