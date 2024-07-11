class Sprite {
  constructor({ imageSrc, position, frameRate = 1, scale = 1 }) {
    this.position = position;
    this.frameRate = frameRate;
    this.scale = scale;
    this.image = new Image();
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
    };
    this.image.src = imageSrc;
    this.currentFrame = 0;
    this.frameBuffer = 4;
    this.elapsedFrame = 0;
  }

  draw() {
    if (!this.image) return;

    const cropBox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    c.drawImage(
      this.image,
      cropBox.position.x,
      cropBox.position.y,
      cropBox.width,
      cropBox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.updateFrame();
  }

  updateFrame() {
    this.elapsedFrame++;
    if (this.elapsedFrame % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }
}
