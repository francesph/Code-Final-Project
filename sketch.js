let sunrise;
let desk;
let stage = 0;
let buttonHovered = false;
let viewTasksButtonHovered = false;

//===============================================================================================================================================================
function preload() {
  sunrise = loadImage('assets/sunrise.png');
  desk = loadImage('assets/desk.png');
}
//===============================================================================================================================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
}
//===============================================================================================================================================================
function draw() {
  switch(stage) {
    case 0:
      // Stage 0 content
      background("#e8a2b6");
      textAlign(CENTER, CENTER);
      fill("black");
      textSize(windowWidth * 0.05);
      text("EFFICIENCY", windowWidth / 2, windowHeight / 4);

      buttonHovered = mouseX >= windowWidth / 2 - 75 && mouseX <= windowWidth / 2 + 75 &&
                      mouseY >= windowHeight / 2 - 25 && mouseY <= windowHeight / 2 + 25;

      fill(buttonHovered ? "#A0D8A5" : "#8bbb96");
      rect(windowWidth / 2 - 75, windowHeight / 2 - 25, 150, 50);

      textSize(windowWidth * 0.03);
      fill("black");
      text("Start", windowWidth / 2, windowHeight / 2);

      if (buttonHovered && mouseIsPressed) {
        stage = 1;
      }
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 1:
      // Stage 1 content (images and text)
      let sunriseWidth = windowWidth * 0.5;
      let sunriseHeight = sunrise.height * (sunriseWidth / sunrise.width);
      image(sunrise, windowWidth / 4, 0, sunriseWidth, sunriseHeight);

      let deskWidth = windowWidth * 0.7;
      let deskHeight = desk.height * (deskWidth / desk.width);
      image(desk, 0, 0, deskWidth, deskHeight);
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

      viewTasksButtonHovered = mouseX >= windowWidth / 2 - 120 && mouseX <= windowWidth / 2 + 40 &&
                               mouseY >= windowHeight / 1 - 380 && mouseY <= windowHeight / 1 - 320;

      fill(viewTasksButtonHovered ? "#F2A6C8" : "pink");
      rect(windowWidth / 2 - 120, windowHeight / 1 - 380, 160, 60);

      fill("black");
      textSize(26);
      text("View Tasks", windowWidth / 2 - 100, windowHeight / 1 - 360);

      if (viewTasksButtonHovered && mouseIsPressed) {
        stage = 2;  // Transition to stage 2
      }
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 2:
      // Stage 2 content (View tasks screen)
      background(200); // Clear the screen to ensure Stage 2 disappears completely
      fill(255);
      rect(493, 134, 460, 621); 

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
        stage = 3;  // Transition to Essay stage
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
        stage = 4;  // Transition to Discussion Board stage
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
        stage = 5;  // Transition to Art Sketch stage
        return;  // Stop further drawing for Stage 2
      }
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 3: // ESSAY stage content
  background(255); 

  // Resize desk image proportionally (new variable names to avoid conflict)
  let deskWidth3 = windowWidth * 0.9; // desks takes up 90% of screen
  let deskHeight3 = desk.height * (deskWidth3 / desk.width); //  height proportional


  image(desk, 20, -100, deskWidth3, deskHeight3);



  fill(0);
  textSize(32); 
  text("Essay stage.", 200, 200);
  break;


//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 4: // Discussion Board stage content
      background(200); 
      let deskWidth4 = windowWidth * 0.9; 
      let deskHeight4 = desk.height * (deskWidth3 / desk.width); 
      image(desk, 20, -100, deskWidth3, deskHeight3);

      fill(0);
      textSize(32);
      text("Discussion Board stage.", 500, 200);
      break;
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    case 5: // Art Sketch stage content
      background(220); 
      fill(0);
      text("This is the Art Sketch stage.", 500, 200);
      break;
  }
}

// Optional: Adjust canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
