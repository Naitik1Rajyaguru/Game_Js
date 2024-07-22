class Health {
  constructor() {
    this.health = 100;
    this.lastHealTime = Date.now();
    this.lastDamageTime = Date.now();
    this.lastEnergyTime = Date.now();
  }

  damage() {
    const currentTime = Date.now();
    if (currentTime - this.lastDamageTime >= 1500) {
      this.health -= 4;
      this.lastDamageTime = currentTime;
    }
    this.updateHealthBar();
  }
  heal() {
    const currentTime = Date.now();
    if (currentTime - this.lastHealTime >= 1000) {
      // 3000 milliseconds = 3 seconds
      if (this.health < 100) {
        this.health += 1;
      }
      if (this.health > 100) {
        this.health = 100;
      }
      this.lastHealTime = currentTime;
    }
    this.updateHealthBar();
  }
  energyChange() {
    const currentTime = Date.now();
    if (currentTime - this.lastEnergyTime >= 2000) {
      this.health -= 2;
      this.lastEnergyTime = currentTime;
    }
    this.updateHealthBar();
  }

  updateHealthBar(health) {
    const healthBar = document.getElementById("health-bar");
    healthBar.style.width = `${this.health}%`;
  }
}
