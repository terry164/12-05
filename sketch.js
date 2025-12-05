let spriteSheet;
let jumpSheet;
let currentFrame = 0;
const totalFrames = 8;
const frameWidth = 419 / 8;
const frameHeight = 67;
const animationSpeed = 10;
let frameCounter = 0;

// 角色狀態
let characterX = 0;
let characterY = 0;
let characterState = 'idle'; // 'idle', 'walkRight', 'walkLeft', 'walkUp', 'walkDown', 'jump'
let characterDirection = 1; // 1 = right, -1 = left
const moveSpeed = 3;
const jumpTotalFrames = 14;
const jumpFrameWidth = 419 / 8;
const jumpFrameHeight = 67;

// 記錄按鍵狀態
let keysPressed = {};

function preload() {
  spriteSheet = loadImage('2/all-2.png');
  jumpSheet = loadImage('2/all-2.png'); // 使用相同的圖片作為跳躍動畫
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  characterX = 0;
  characterY = 0;
}

function draw() {
  background('#faedcd');
  
  // 更新角色位置和狀態
  if (keysPressed[RIGHT_ARROW] && characterState !== 'jump') {
    characterState = 'walkRight';
    characterDirection = 1;
  } else if (keysPressed[LEFT_ARROW] && characterState !== 'jump') {
    characterState = 'walkLeft';
    characterDirection = -1;
  } else if (keysPressed[UP_ARROW] && characterState !== 'jump') {
    characterState = 'walkUp';
  } else if (keysPressed[DOWN_ARROW] && characterState !== 'jump') {
    characterState = 'walkDown';
  } else if (characterState !== 'jump' && !keysPressed[RIGHT_ARROW] && !keysPressed[LEFT_ARROW] && !keysPressed[UP_ARROW] && !keysPressed[DOWN_ARROW]) {
    characterState = 'idle';
    currentFrame = 0;
    frameCounter = 0;
  }
  
  // 計算角色中心位置
  const centerX = width / 2;
  const centerY = height / 2;
  
  // 根據狀態更新位置
  if (characterState === 'walkRight') {
    characterX += moveSpeed;
  } else if (characterState === 'walkLeft') {
    characterX -= moveSpeed;
  } else if (characterState === 'walkUp') {
    characterY -= moveSpeed;
  } else if (characterState === 'walkDown') {
    characterY += moveSpeed;
  } else if (characterState === 'jump') {
    // 計算跳躍高度（拋物線）
    const jumpProgress = currentFrame / jumpTotalFrames;
    const jumpHeight = Math.sin(jumpProgress * Math.PI) * 150; // 最高150像素
    characterY = -jumpHeight;
  }
  
  // 更新動畫幀
  frameCounter++;
  if (frameCounter >= animationSpeed) {
    currentFrame = (currentFrame + 1) % (characterState === 'jump' ? jumpTotalFrames : totalFrames);
    frameCounter = 0;
    
    // 跳躍完成後回到待機狀態
    if (characterState === 'jump' && currentFrame === 0) {
      characterState = 'idle';
      characterY = 0;
    }
  }
  
  // 計算當前幀的位置
  let srcX, srcY, displayFrameWidth, displayFrameHeight;
  
  if (characterState === 'jump') {
    srcX = currentFrame * jumpFrameWidth;
    srcY = 0;
    displayFrameWidth = jumpFrameWidth;
    displayFrameHeight = jumpFrameHeight;
  } else {
    srcX = currentFrame * frameWidth;
    srcY = 0;
    displayFrameWidth = frameWidth;
    displayFrameHeight = frameHeight;
  }
  
  // 根據狀態決定顯示位置
  const displayX = centerX - displayFrameWidth / 2 + characterX;
  const displayY = centerY - displayFrameHeight / 2 + characterY;
  
  // 繪製精靈
  push();
  translate(displayX + displayFrameWidth / 2, displayY);
  
  // 如果面向左邊，翻轉
  if (characterDirection === -1) {
    scale(-1, 1);
  }
  
  const currentSheet = characterState === 'jump' ? jumpSheet : spriteSheet;
  image(currentSheet, -displayFrameWidth / 2, 0, displayFrameWidth, displayFrameHeight, srcX, srcY, displayFrameWidth, displayFrameHeight);
  pop();
}

function keyPressed() {
  keysPressed[keyCode] = true;
  
  // 只有向上鍵觸發跳躍
  if (keyCode === UP_ARROW && characterState !== 'jump') {
    characterState = 'jump';
    currentFrame = 0;
    frameCounter = 0;
  }
  return false;
}

function keyReleased() {
  keysPressed[keyCode] = false;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
