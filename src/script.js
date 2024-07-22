let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
let isDead = false;
let animationId;
const deathScreen = document.getElementById("death-screen");

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((block, x) => {
    if (block == 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((block, x) => {
    if (block == 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

animations = {
  Idle: {
    imageSrc: "../assets/warrior/Idle.png",
    frameRate: 8,
    frameBuffer: 4,
  },
  IdleLeft: {
    imageSrc: "../assets/warrior/IdleLeft.png",
    frameRate: 8,
    frameBuffer: 4,
  },
  Run: {
    imageSrc: "../assets/warrior/Run.png",
    frameRate: 8,
    frameBuffer: 6,
  },
  RunLeft: {
    imageSrc: "../assets/warrior/RunLeft.png",
    frameRate: 8,
    frameBuffer: 6,
  },
  Jump: {
    imageSrc: "../assets/warrior/Jump.png",
    frameRate: 2,
    frameBuffer: 3,
  },
  JumpLeft: {
    imageSrc: "../assets/warrior/JumpLeft.png",
    frameRate: 2,
    frameBuffer: 3,
  },
  Fall: {
    imageSrc: "../assets/warrior/Fall.png",
    frameRate: 2,
    frameBuffer: 3,
  },
  FallLeft: {
    imageSrc: "../assets/warrior/FallLeft.png",
    frameRate: 2,
    frameBuffer: 3,
  },
  Dead: {
    imageSrc: "../assets/warrior/Death.png",
    frameRate: 6,
    frameBuffer: 10,
  },
  TakeHit: {
    imageSrc: "../assets/warrior/Take Hit.png",
    frameRate: 4,
    frameBuffer: 4,
  },
  Attack: {
    imageSrc: "../assets/warrior/Attack1.png",
    frameRate: 4,
    frameBuffer: 4,
  },
};

const player1 = new Player({
  position: {
    x: 100,
    y: 350,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: "../assets/warrior/Idle.png",
  frameRate: 8,
  animations,
});

const player2 = new Player({
  position: {
    x: 200,
    y: 350,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: "../assets/warrior/IdleLeft.png",
  frameRate: 8,
  animations,
});

const Keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
};

const camera = {
  position: {
    x: 0,
    y: -432 + scaledCanvas.height,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "../assets/background.png",
});

const bgMusic = new Audio("../assets/Music/jungle-style-videogame-190083.mp3");
bgMusic.volume = 0.1;
const runningMusic = new Audio("../assets/Music/running21.mp3");
const landEffect = new Audio("../assets/Music/jump.mp3");
landEffect.playbackRate = 2;
const breathing = new Audio("../assets/Music/breathing.mp3");
breathing.volume = 0.1;
const deathScream = new Audio("../assets/Music/death-21.mp3");
onAir = true;
falling = true;
running = false;

function animate() {
  console.log(player1.health.health);
  if (player1.health.health <= 0) {
    isDead = true;
    gameEnd();
    return;
  }
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  background.update();

  player1.update();

  player1.velocity.x = 0;

  // animation of player

  if (Keys.ArrowRight) {
    if (!onAir) {
      runningMusic.play();
    } else if (falling && player1.velocity.y === 0) {
      landEffect.play();
      player1.health.damage();
      falling = false;
    }
    if (!falling) {
      player1.health.energyChange();
    }

    player1.velocity.x = player1.speed;
    player1.switchSprite("Run");
    player1.lastDirection = "right";
    player1.changeCanvasToLeft({
      camera,
      scaledCanvas,
    });
    onAir = false;
    running = true;
  } else if (Keys.ArrowLeft) {
    if (!onAir) {
      runningMusic.play();
    } else if (falling && player1.velocity.y === 0) {
      landEffect.play();
      player1.health.damage();
      falling = false;
    }
    if (!falling) {
      player1.health.energyChange();
    }

    player1.velocity.x = -player1.speed;
    player1.switchSprite("RunLeft");
    player1.lastDirection = "left";
    player1.changeCanvasToRight({
      camera,
      canvas,
    });
    onAir = false;
    running = true;
  }

  if (player1.velocity.y === 0 && player1.velocity.x === 0) {
    if (falling) {
      landEffect.play();
      // player1.health.damage();
    }
    if (player1.lastDirection == "right") player1.switchSprite("Idle");
    else player1.switchSprite("IdleLeft");
    if (player1.health.health < 15) {
      breathing.play();
    }

    onAir = false;
    falling = false;
    player1.health.heal();
  }

  if (player1.velocity.y > 0) {
    player1.health.heal();
    falling = true;
    // console.log("down");
    player1.changeCanvasToUp({
      camera,
      scaledCanvas,
    });
    if (player1.lastDirection == "right") player1.switchSprite("Fall");
    else player1.switchSprite("FallLeft");
    onAir = true;
    running = false;
  } else if (player1.velocity.y < 0) {
    if (player1.lastDirection == "right") player1.switchSprite("Idle");
    else player1.switchSprite("IdleLeft");

    player1.health.damage();
    falling = false;
    player1.changeCanvasToDown({
      camera,
      scaledCanvas,
    });
    if (player1.lastDirection == "right") player1.switchSprite("Jump");
    else player1.switchSprite("JumpLeft");
    onAir = true;
    running = false;
  }

  c.restore();
  animationFrameId = window.requestAnimationFrame(animate);
}

document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("health-bar-container").classList.remove("hidden");

  bgMusic.play();
  bgMusic.addEventListener("ended", function () {
    bgMusic.play();
  });
  player1.health.health = 100;
  animationId = window.requestAnimationFrame(animate);
});

function deathAnimation() {
  player1.velocity.x = 0;
  console.log(player1.currentFrame);
  console.log(player1.velocity.y);

  if (player1.currentFrame <= 5) {
    c.save();
    c.scale(4, 4);
    c.translate(camera.position.x, camera.position.y);
    background.update();
    player1.switchSprite("Dead");

    player1.update();
    c.restore();
    if (player1.checkForVerticalCollision() && player1.currentFrame == 5) {
      console.log("dhum");
      return;
    }
  }

  deathAnimationId = window.requestAnimationFrame(deathAnimation);
}

function gameEnd() {
  cancelAnimationFrame(animationId);
  bgMusic.pause();
  deathScream.play();
  deathAnimationId = window.requestAnimationFrame(deathAnimation);
  deathScreen.classList.remove("hidden");
}

document.getElementById("restartButton").addEventListener("click", function () {
  deathScreen.classList.add("hidden");
  window.location.reload();
});

window.addEventListener("keydown", (event) => {
  // console.log(event);
  switch (event.key) {
    case "ArrowRight":
      if (player1.health.health <= 0) {
        event.preventDefault(); // Optionally prevent default behavior
        event.stopPropagation(); // Optionally stop propagation
        console.log(`Key "${event.key}" is disabled.`);
        return; // Exit the event listener if the condition is true
      }
      Keys.ArrowRight = true;
      break;
    case "ArrowLeft":
      if (player1.health.health <= 0) {
        event.preventDefault(); // Optionally prevent default behavior
        event.stopPropagation(); // Optionally stop propagation
        console.log(`Key "${event.key}" is disabled.`);
        return; // Exit the event listener if the condition is true
      }
      Keys.ArrowLeft = true;
      break;
    case "ArrowUp":
      if (player1.health.health <= 3) {
        event.preventDefault(); // Optionally prevent default behavior
        event.stopPropagation(); // Optionally stop propagation
        console.log(`Key "${event.key}" is disabled.`);
        return; // Exit the event listener if the condition is true
      }
      if (!Keys.ArrowUp) player1.velocity.y -= player1.jump;
      Keys.ArrowUp = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  // console.log(event);
  switch (event.key) {
    case "ArrowRight":
      Keys.ArrowRight = false;
      break;
    case "ArrowLeft":
      Keys.ArrowLeft = false;
      break;
    case "ArrowUp":
      Keys.ArrowUp = false;
  }
});
