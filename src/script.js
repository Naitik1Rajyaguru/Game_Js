let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

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
        new collisionBlock({
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
        new collisionBlock({
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

const player1 = new Player({
  position: {
    x: 100,
    y: 350,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: "../assets/warrior/Idle.png",
  frameRate: 8,
  animations: {
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
  },
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

function animate() {
  // console.log("debug-1");
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(animate);
  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  background.update();

  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update();
  // });

  // platformCollisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update();
  // });

  player1.checkForHorizontalCanvasCollision();
  player1.update();

  player1.velocity.x = 0;

  // animation of player

  if (Keys.ArrowRight) {
    player1.velocity.x = player1.speed;
    player1.switchSprite("Run");
    player1.lastDirection = "right";
    player1.changeCanvasToLeft({ camera, scaledCanvas });
  } else if (Keys.ArrowLeft) {
    player1.velocity.x = -player1.speed;
    player1.switchSprite("RunLeft");
    player1.lastDirection = "left";
    player1.changeCanvasToRight({ camera, canvas });
  } else if (player1.velocity.y === 0) {
    if (player1.lastDirection == "right") player1.switchSprite("Idle");
    else player1.switchSprite("IdleLeft");
  }

  if (player1.velocity.y > 0) {
    player1.changeCanvasToUp({ camera, scaledCanvas });
    if (player1.lastDirection == "right") player1.switchSprite("Fall");
    else player1.switchSprite("FallLeft");
  } else if (player1.velocity.y < 0) {
    player1.changeCanvasToDown({ camera, scaledCanvas });
    if (player1.lastDirection == "right") player1.switchSprite("Jump");
    else player1.switchSprite("JumpLeft");
  }

  c.restore();
}

animate();

window.addEventListener("keydown", (event) => {
  console.log(event);
  switch (event.key) {
    case "ArrowRight":
      Keys.ArrowRight = true;
      break;
    case "ArrowLeft":
      Keys.ArrowLeft = true;
      break;
    case "ArrowUp":
      if (!Keys.ArrowUp) player1.velocity.y -= player1.jump;
      Keys.ArrowUp = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  console.log(event);
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
