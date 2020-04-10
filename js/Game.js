(function() {
  var game = (window.Game = function Game() {
    //自己的dom树
    this.f = 0; //帧编号
    //移动的状态
    //设置初始方向
    this.direction = null;
    this.str = -1;
    this.gindex = 0;
    this.begin = false;
    this.beginn = false;
    this.begins = true;
    // this.Ismove =true;
    //初始化
    this.init();
    this.bindEvent();
  });
  Game.prototype.init = function() {
    this.canvas = document.getElementById("mycanvas");
    //	使用上下文，得到一个2D画布
    this.ctx = this.canvas.getContext("2d");
    //图片加载器
    this.res = {
      "1": "images/bg.jpg",
      girl: "images/sas.png",
      fei: "images/fei.png",
      "5": "images/5.jpg",
      "2": "images/2.jpg",
      bos: "images/shizhi.gif",
      "4": "images/4.jpg",
      "3": "images/3.jpg",
      nvs: "images/nvs.png",
      kais: "images/kais.png",
      begin: "images/begin2.png",
      s1: "images/s1.png",
      s2: "images/s2.png",
      s3: "images/s3.png",
      g1: "images/gui.png",
      g2: "images/guai.png",
      g3: "images/g3.png",
      wq: "images/wq.png",
      bgt: "images/bgt.jpg",
      sdd: "images/121.png",
      sd: "images/sd.png",
      jq: "images/jianqi.png",
      g4: "images/w2.png",
      g5: "images/shuxing.png",
      sx: "images/sx.png",
      vct: "images/vct.png",
      fas: "images/fs.png",
      g11: "images/g11.png"
    };
    var length = Object.keys(this.res).length;
    var count = 0;
    var self = this;
    for (var i in this.res) {
      var image = new Image();
      image.src = this.res[i];
      this.res[i] = image;
      image.onload = function() {
        count++;
        //清屏
        self.clear();
        self.ctx.save(); //保存之前的状态
        self.ctx.font = "20px 微软雅黑";
        self.ctx.fillStyle = "skyblue";
        self.ctx.textAlign = "center";
        self.ctx.fillText(
          `加载中${count}/${length}`,
          self.canvas.width / 2,
          80
        );
        self.ctx.restore(); //再次创建一个状态，里面的不会影响外面的
        if (count == length) {
          //当加载完成，可以开始游戏啦
          self.start();
        }
      };
    }
  };
  Game.prototype.changeDirection = function(str) {
    this.girl.direction = str;
  };
  // 清屏的方法
  Game.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  Game.prototype.bindEvent = function() {
    //备份上下文
    var self = this;
    document.onkeydown = function(event) {
      var stt = window.event ? window.event.keyCode : event.keyCode;
      if (stt != 0) {
        self.girl.Ismove = true;
      }
      let direction = "";
      switch (stt) {
        case 38:
        case 87:
          direction = "U";
          break;
        case 40:
        case 83:
          direction = "D";
          break;
        case 39:
        case 68:
          direction = "R";
          break;
        case 37:
        case 65:
          direction = "L";
        case 69:
          direction = "E";
        case 81:
          direction = "Q";
          break;
        case 70:
          direction = "F";
          break;
        case 32:
          direction = "S";
          break;

        default:
          break;
      }
      self.changeDirection(direction);
    };
  };
  //封装一个方法，让他能文字换行
  Game.prototype.drawText = function(t, x, y, w) {
    var chr = t.split("");
    var temp = "";
    var row = [];

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.textBaseline = "middle";
    for (var a = 0; a < chr.length; a++) {
      if (this.ctx.measureText(temp).width < w) {
      } else {
        row.push(temp);
        temp = "";
      }
      temp += chr[a];
    }
    row.push(temp);
    for (var b = 0; b < row.length; b++) {
      this.ctx.font = "14px 微软雅黑";
      this.ctx.fillStyle = "cyan";
      this.ctx.fillText(row[b], x, y + (b + 1) * 20);
    }
  };
  Game.prototype.start = function() {
    var self = this;
    self.n = 0;
    self.sx = true;
    self.sxs = true;
    this.scene = new Scene(); //场景管理器
    document.onkeyup = function(event) {
      self.girl.Ismove = false;
    };
    this.timer = setInterval(function begin() {
      self.f++;
      //清屏
      self.clear();
      //场景器
      self.scene.render();
      if (self.begin) {
        self.scene.fs();
      }
      if (self.beginn) {
        self.scene.fsn();
      }
      if (self.begins == true && self.begin == false) {
        self.scene.sf();
      }
      if (self.sx) {
        self.n += 12;
        self.ctx.drawImage(self.res["sx"], 275, self.n, 460, 400);
        if (self.n > 220) {
          self.n = 220;
        }
        self.ctx.save();
        self.ctx.font = "19px 微软雅黑";
        self.ctx.fillStyle = "#fff";
        self.ctx.fillText(self.girl.atk, 688, 296);
        self.ctx.fillText(self.girl.live, 688, 349);
        self.ctx.fillText(self.girl.fay, 688, 414);
        self.ctx.restore();
      }
      if (!self.sxs) {
        document.querySelectorAll("audio")[4].play();

        self.n += 12;
        self.ctx.drawImage(self.res["vct"], 275, self.n, 460, 400);
        if (self.n > 180) {
          self.n = 180;
        }
        self.ctx.save();
        self.ctx.font = "19px 微软雅黑";
        self.ctx.fillStyle = "#fff";
        self.ctx.fillText(self.scene.atks, 488, 452);
        self.ctx.fillText(self.scene.lives, 488, 497);
        self.ctx.fillText(self.scene.fays, 488, 542);
        self.ctx.restore();
      }
      //console.log(self.girl.x,self.girl.y)
      // self.foe.render();
      // self.ctx.fillText(self.scene.sceneNumber,300,20)
      //设置帧的样式
      // self.ctx.font = "16px 微软雅黑";
      // self.ctx.fillText(self.f,10,20);
    }, 50);
  };
})();
