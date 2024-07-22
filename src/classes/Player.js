class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.3,
    animations,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    // this.width = 25;
    // this.height = 25;
    this.gravity = 0.15;
    this.speed = 2;
    this.jump = 4;
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitbox = {
      position: {
        x: this.position.x + 50,
        y: this.position.y,
      },
      width: 20,
      height: 20,
    };
    this.cameraBox = {
      position: {
        x: this.position.x - 90,
        y: this.position.y - 30,
      },
      width: 250,
      height: 100,
    };
    this.animations = animations;

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;
      this.animations[key].image = image;
    }
    this.lastDirection = "right";
    this.health = new Health();
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image) return;
    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameRate = this.animations[key].frameRate;
    this.frameBuffer = this.animations[key].frameBuffer;
  }

  updateHitBox() {
    this.hitbox = {
      position: {
        x: this.position.x + 20,
        y: this.position.y + 16,
      },
      width: 10,
      height: 16,
    };
  }
  updateCamreBox() {
    this.cameraBox = {
      position: {
        x: this.position.x - 90,
        y: this.position.y - 30,
      },
      width: 250,
      height: 100,
    };
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  changeCanvasToLeft({ camera, scaledCanvas }) {
    const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;

    if (cameraBoxRightSide >= 576) return;
    if (
      cameraBoxRightSide >=
      scaledCanvas.width + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  changeCanvasToRight({ camera, scaledCanvas }) {
    if (this.cameraBox.position.x <= 0) return;
    if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  changeCanvasToDown({ camera, scaledCanvas }) {
    if (this.cameraBox.position.y + this.velocity.y <= 0) return;
    if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  changeCanvasToUp({ camera, scaledCanvas }) {
    if (
      this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >=
      432
    )
      return;
    if (
      this.cameraBox.position.y + this.cameraBox.height >=
      Math.abs(camera.position.y) + scaledCanvas.height
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (detectCollision({ object1: this.hitbox, object2: collisionBlock })) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  checkForVerticalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (detectCollision({ object1: this.hitbox, object2: collisionBlock })) {
        if (this.velocity.y >= 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          return true;
          break;
        }
        if (this.velocity.y <= 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          return true;
          break;
        }
      }
    }

    // for platform collision
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];
      if (
        detectPlatformCollision({
          object1: this.hitbox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y >= 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          return true;
          break;
        }
      }
    }
    return false;
  }

  update() {
    this.updateFrame();
    this.updateHitBox();
    this.updateCamreBox();

    // // draw hitbox
    // c.fillStyle = "rgba(255,0,0,0.2)";
    // c.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );

    // draw player (using sprite image class)
    this.draw();
    this.checkForHorizontalCanvasCollision();
    this.position.x += this.velocity.x;
    this.updateHitBox();
    this.checkForHorizontalCollision();
    this.applyGravity();
    this.updateHitBox();
    this.checkForVerticalCollision();
  }
}
