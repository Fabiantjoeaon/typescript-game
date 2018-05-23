/// <reference path="../characters/Walker.ts"/>

class Game extends GameObject {
  private bomber: Bomber;
  private walkers: Array<Walker> = new Array<Walker>();
  private bullets: Array<Bullet> = new Array<Bullet>();
  private static instance: Game;

  constructor() {
    super();
    this.bomber = new Bomber();
    this.walkers.push(new Walker());
    setInterval(() => {
      this.walkers.push(new Walker());
    }, 7000);
    this.gameLoop();
  }

  private gameLoop(): void {
    this.bomber.update();
    this.walkers.forEach(walker => {
      walker.update();
    });

    this.bomber.getHealth();
    this.removeObjectsHandler();
    this.damageHandler();

    requestAnimationFrame(() => this.gameLoop());
  }

  public addBulletsToArray(bullet: Bullet) {
    this.bullets.push(bullet);
  }

  private removeObjectsHandler() {
    this.removeObjectsFromArrayIfNotVisible([this.bullets, this.walkers]);
  }

  private damageHandler() {
    // decrease bomber health on collision walker
    for (const walker of this.walkers) {

      // check collision Bomber | Walker
      if (this.collision(this.bomber, walker)) {
        this.bomber.damage(walker.getAttackPower());
      }

      // check collision Bullet | Walker
      for(const bullet of this.bullets) {
        if(this.collision(bullet, walker)) {
          walker.damage(this.bomber.getAttackPower())
        }
      }

    };
  }

  private removeObjectsFromArrayIfNotVisible(arrays: any) {
    arrays.map((array: any) => {
      array.map((item: GameObject, index: number) => {
        if (!item.getVisibility()) {
          array.splice(index, 1);
        }
      });
    })
  }

  public getBulletsArray() {
    return this.bullets;
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }
}
