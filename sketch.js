let sunrise;
let mainDesk;
let essay;
let discuss;
let poster;
let sketch;
let tasks;

let stage = 0;
let prevStage = 0;  // Variable to store the previous stage
let buttonHovered = false;
let backButtonHovered = false;
let viewTasksButtonHovered = false;
let isFullscreen = false;

//===============================================================================================================================================================
function preload() {
  sunrise = loadImage('assets/sunrise.png');
  mainDesk = loadImage('assets/main.png'); //stage 1 and 2
  essay = loadImage('assets/word.png'); //stage 3
  discuss = loadImage('assets/Discussion.png'); //stage 4
  poster = loadImage('assets/deskPoster.png'); //stage 6
  // sketch = loadImage('assets/') //stage 5
  // tasks = loadImage('assets/') //all stages
}
//===============================================================================================================================================================
function setup() {
  createCanvas(windowWidth, windowHeight);

  let fullscreenButton = createButton('Go Fullscreen');
  fullscreenButton.position(1375, 790);
  fullscreenButton.mousePressed(toggleFullscreen);
}
//===============================================================================================================================================================
function draw() {
  if (isFullscreen) {
    resizeCanvas(windowWidth, windowHeight);
  }
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  switch(stage) {
    case 0:
      // Stage 0 content
      background("#e8a2b6");
      textAlign(CENTER, CENTER);
      fill("black");
      textSize(50);
      text("EFFICIENCY", windowWidth / 2, windowHeight / 4);

      // Back Button
      drawBackButton();

      buttonHovered = mouseX >= windowWidth / 2 - 75 && mouseX <= windowWidth / 2 + 75 &&
                      mouseY >= windowHeight / 2 - 25 && mouseY <= windowHeight / 2 + 25;
      fill(buttonHovered ? "#A0D8A5" : "#8bbb96");
      rect(windowWidth / 2 - 75, windowHeight / 2 - 25, 150, 50);
      textSize(27);
      fill("black");
      text("Start", windowWidth / 2, windowHeight / 2);
      text("x:"+mouseX+" y:"+mouseY, 100, 60)
      if (buttonHovered && mouseIsPressed) {
        prevStage = stage;  // Store the current stage before changing
        stage = 1;
      }
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 1:
      // Stage 1 content (images and text)
      let sunriseWidth = windowWidth * 0.5;
      let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
      image(sunrise, 0, 0, sunriseWidth, sunriseHeight);

      image(mainDesk, 0, -42, width, height * 1.08);
      fill(255, 255, 255, 150); 
      noStroke();
      rect(0, 0, windowWidth, windowHeight); 

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

      // Back Button
      drawBackButton();

      viewTasksButtonHovered = mouseX >= windowWidth / 2 - 120 && mouseX <= windowWidth / 2 + 40 &&
                               mouseY >= windowHeight / 1 - 380 && mouseY <= windowHeight / 1 - 320;
      fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
      rect(windowWidth / 2 - 120, windowHeight / 1 - 380, 160, 60);

      fill("black");
      textSize(26);
      text("View Tasks", windowWidth / 2 - 100, windowHeight / 1 - 360);
      text("x:"+mouseX+" y:"+mouseY, 100, 60)

      if (viewTasksButtonHovered && mouseIsPressed) {
        prevStage = stage;
        stage = 3;  // Transition to stage 3
      }
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 2: //main desk screen
      image(mainDesk, 0, -42, width, height * 1.08);
    case 3://TASKS
      // Stage 2 content (View tasks screen)
      background(200); // Clear the screen to ensure Stage 2 disappears completely
      let sunriseWidth2 = windowWidth * 0.5;
      let sunriseHeight2 = sunrise.height * (sunriseWidth2 / sunrise.width);
      image(sunrise, 0, 0, sunriseWidth2, sunriseHeight2);

      image(mainDesk, 0, -42, width, height * 1.08);

      fill(255);
      rect(493, 134, 460, 621); 
      text("x:"+mouseX+" y:"+mouseY, 100, 60)

      textAlign(CENTER, CENTER);
      fill("black");
      textSize(32);
      text("View Tasks", 730, 176);



      // Essay Button Hover and Click
      viewTasksButtonHovered = mouseX >= 600 && mouseX <= 900 && 
                               mouseY >= 220 && mouseY <= 260;
      fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
      rect(600, 220, 300, 40);
      fill(0);
      text("essay", 730, 250);      
      if (viewTasksButtonHovered && mouseIsPressed) {
        prevStage = stage;
        stage = 4;  // Transition to Essay stage
        return;  // Stop further drawing for Stage 2
      }

      // Discussion Board Button Hover and Click
      viewTasksButtonHovered = mouseX >= 600 && mouseX <= 900 && 
                               mouseY >= 270 && mouseY <= 310;
      fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
      rect(600, 270, 300, 40);
      fill(0);
      text("discussion board", 730, 300);
      if (viewTasksButtonHovered && mouseIsPressed) {
        prevStage = stage;
        stage = 5;  // Transition to Discussion Board stage
        return;  // Stop further drawing for Stage 2
      }

      // Art Sketch Button Hover and Click
      viewTasksButtonHovered = mouseX >= 600 && mouseX <= 900 && 
                               mouseY >= 320 && mouseY <= 360;
      fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
      rect(600, 320, 300, 40);
      fill(0);
      text("art sketch", 730, 350);
      if (viewTasksButtonHovered && mouseIsPressed) {
        prevStage = stage;
        stage = 6;  // Transition to Art Sketch stage
        return;  // Stop further drawing for Stage 2
      }
      
      viewTasksButtonHovered = mouseX >= 600 && mouseX <= 900 && 
                               mouseY >= 370 && mouseY <= 410;
      fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
      rect(600, 370, 300, 40);
      fill(0);
      text("poster", 730, 400);
      if (viewTasksButtonHovered && mouseIsPressed) {
        prevStage = stage;
        stage = 7;  // Transition to poster stage
        return;  // Stop further drawing for Stage 2
      }    
        // Back Button
      drawBackButton();
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 4: // ESSAY stage content
      background(255); 

      image(essay, 0, 0, width, height);

      // Back Button
      drawBackButton();

      fill("black");
      text("x:"+mouseX+" y:"+mouseY, 100, 60)

      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 5: // Discussion Board stage content
      background(200); 

      image(discuss, 0, 0, width, height);

      // Back Button
      drawBackButton();

      fill("black");
      text("x:"+mouseX+" y:"+mouseY, 100, 60)
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 6: // Art Sketch stage content
      background(220); 

      // Back Button
      drawBackButton();

      fill("black");
      text("sketch", 100, 300)
      text("x:"+mouseX+" y:"+mouseY, 100, 60)
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 7: // Poster content
      background(220);
      image(poster, 0, 0, width, height);

      // Back Button
      drawBackButton();

      fill("black");
      text("x:"+mouseX+" y:"+mouseY, 100, 60)
      break;
  }
}

//===============================================================================================================================================================
function toggleFullscreen() {
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    fullscreen(true);  // Enter fullscreen mode
  } else {
    fullscreen(false); // Exit fullscreen mode
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    fullscreen(false);  // Exit fullscreen when ESC is pressed
    isFullscreen = false; // Update the state
  }
}

// Optional: Adjust canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//===============================================================================================================================================================
function drawBackButton() {
  backButtonHovered = mouseX >= 30 && mouseX <= 130 && mouseY >= 30 && mouseY <= 70;
  fill(backButtonHovered ? "#A0D8A5" : "#8bbb96");
  rect(30, 30, 100, 40);
  fill("black");
  textSize(20);
  text("Back", 80, 50);

  if (backButtonHovered && mouseIsPressed) {
    stage = prevStage;  // Go back to the previous stage
  }
}
