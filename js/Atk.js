(function () {
  var atk = window.Atk = function () {
    this.arr = ["g3", "g11"];
    this.image = game.res[this.arr[_.random(0, 1)]];
    this.x = 0;
    this.live = _.random(110, 200);
    this.atks = _.random(50, 70);
    this.fay = 50;
    this.n = 640;
  }
  Atk.prototype.render = function () {
    if (this.live <= 0) {
      game.ctx.drawImage(game.res["g1"], 640, 390, 55, 55);
    } else {
      game.f % 8 == 0 && this.n++;
      if (this.n > 642) {
        this.n = 640;
      }
      game.ctx.drawImage(this.image, this.n, 320, 100, 143);
    }
  };

})();