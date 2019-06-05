(function () {
	var Scene = window.Scene = function () {
		//当前场景的编号
		this.sceneNumber = 1;
		this.i = 0;
		this.x = 0;
		this.k = 0;
		this.x1 = -560;
		this.Is = false;
		this.kn = 160;
		this.init(1);
		this.n = 0;
		this.xy = game.girl.y;
		this.bindEvent();

	}

	Scene.prototype.init = function (number) {
		switch (number) {
			case 1:
				//生成游戏的背景
				//
				game.map = new Map();
				game.map.image = game.res["kais"];
				// 修改教程的透明度
				this.tutorialOpacity = 1;
				// 透明度是降低的
				this.tutorialOpacityChange = "low";
				game.girl = new Girl();
				break;
			case 2:
				game.map = new Map();
				game.str -= 1;
				game.girl.y = this.xy + 7;
				game.map.image = game.res["bgt"];
				game.girl.y = this.xy + 7;//使得每次遇到怪后将自己位置向下移动，避免出来时再次遇到怪。
				game.atk = new Atk();
				break;
			case 3:
				//生成游戏背景
				game.map = new Map();
				game.girl.y = this.xy + 7;
				// game.girl =new Girl();
				game.tis = new Tis();

				break;
		}
	}
	Scene.prototype.render = function () {
		switch (this.sceneNumber) {
			case 1:
				game.map.render();
				game.ctx.save();
				if (this.tutorialOpacityChange == "low") {
					this.tutorialOpacity -= 0.02;
					if (this.tutorialOpacity <= 0.9) {
						this.tutorialOpacityChange = "high";
						this.Is = true;
					}
				} else if (this.tutorialOpacityChange == "high") {
					this.tutorialOpacity += 0.02;
					if (this.tutorialOpacity >= 1) {
						this.tutorialOpacityChange = "low";
						this.Is = false;
					}
				};
				game.ctx.globalAlpha = this.tutorialOpacity;
				game.ctx.drawImage(game.res["begin"], 695, 495, 295, 90, 614, 482, 295, 90);
				game.ctx.restore();
				break;
			case 2:
				document.querySelectorAll("audio")[0].load();
				game.map.render();
				game.ctx.drawImage(game.res["begin"], 692, 602, 70, 80, 614, 482, 70, 80);
				game.ctx.drawImage(game.res["begin"], 782, 602, 75, 80, 685, 482, 75, 80);
				game.ctx.drawImage(game.res["begin"], 869, 602, 75, 80, 795, 22, 75, 80);
				// document.querySelector("#gui").style.display="block";
				game.ctx.drawImage(game.res["jq"], 64 * this.k, 128 * this.i + 3, 64, 64, this.x + 160, 360, 64, 64);
				game.ctx.drawImage(game.res["sdd"], this.kn + 140, 340, 100, 143);
				game.atk.render();
				game.ctx.drawImage(game.res["g5"], 910, 0, 50, 50);
				break;
			case 3:
				//生成游戏背景
				//更新和渲染
				game.map.render();
				// //console.log(game.girl.live)//猪脚血量
				if (game.girl.Ismove) {
					game.girl.update();
				}
				game.girl.render();
				game.tis.render();
				game.ctx.drawImage(game.res["g5"], 910, 0, 50, 50);
				break;
		}
	}
	Scene.prototype.bindEvent = function () {
		var self = this;
		game.canvas.onmousedown = function (event) {
			self.kn = _.random(0, 9);
			switch (self.sceneNumber) {
				case 1:
					var zuo = 634.75;
					var you = 830;
					var shang = 500;
					var xia = 560;
					if (event.offsetX >= zuo && event.offsetX <= you && event.offsetY <= xia && event.offsetY >= shang) {
						// 点击进入到3号的场景
						game.sx = !game.sx;
						document.querySelectorAll("audio")[1].play()
						self.sceneNumber = 3;
						self.init(3);
					}
					break;
				case 2:
					var zuo = 600;
					var you = 690;
					var shang = 500;
					var xia = 560;
					if (event.offsetX >= zuo && event.offsetX <= you && event.offsetY <= xia && event.offsetY >= shang && game.atk.live > 0) {
						document.querySelectorAll("audio")[2].play()
						game.girl.live -= game.atk.atks - game.girl.fay;
						game.begin = true;
						game.begins = true;
						if (game.girl.live <= 0) {
							alert("游戏结束")
							//怪已经死亡
							clearInterval(game.timer)
						}
					}
					if (event.offsetX >= zuo + 120 && event.offsetX <= you + 120 && event.offsetY <= xia && event.offsetY >= shang && game.atk.live > 0) {
						game.girl.live -= game.atk.atks - game.girl.fay;
						document.querySelectorAll("audio")[1].play()
						game.beginn = true;
						game.begins = true;
						//console.log("女孩生命值"+game.girl.live)
						if (game.girl.live <= 0) {
							// var string = "江湖险恶，出师未捷身先死……"
							//       this.n+=3;
							//       game.drawText(string, 200,this.n,322);
							//    if(this.n>190){
							//    	this.n=190;
							//    }
							alert("游戏结束")
							//怪已经死亡
							clearInterval(game.timer)
						}
					}
					if (event.offsetX >= 790 && event.offsetX <= 890 && event.offsetY <= 100 && event.offsetY >= 33) {
						if (game.atk.live <= 0) {
							game.sxs = true;
							game.str = 1;
							self.sceneNumber = 3;
							self.init(3);
						}
					}
					if (event.offsetX >= 910 && event.offsetX <= 960 && event.offsetY <= 50 && event.offsetY >= 0) {
						// 点击展示人物属性
						document.querySelectorAll("audio")[3].load();
						document.querySelectorAll("audio")[3].play();
						game.sx = !game.sx;
					}
					break;
				case 3:
					if (event.offsetX >= 910 && event.offsetX <= 960 && event.offsetY <= 50 && event.offsetY >= 0) {
						// 点击展示人物属性
						document.querySelectorAll("audio")[3].load();
						document.querySelectorAll("audio")[3].play();
						game.sx = !game.sx;
					}
					break;
			}
		}
	};
	Scene.prototype.fs = function () {
		game.ctx.drawImage(game.res["jq"], 67 * this.k, 69 * this.i + 3, 63, 63, this.x + 160, 360, 63, 63);
		this.x += 36;
		if (game.f % 2 == 0) {
			this.i++;
			if (this.i == 4) {
				this.i = 1;
				this.k++;
				if (this.k == 2) {
					this.k = 0;
				}
			}
		}
		if (this.x > 500) {
			//攻击到达此处，
			game.atk.live -= game.girl.atk - game.atk.fay;

			game.begin = false;

			this.x = -10;
		} if (game.atk.live <= 0) {
			//怪已经死亡
			//console.log("wosil");
			game.sxs = false;
			this.atks = _.random(13, 56);
			this.lives = _.random(30, 50);
			this.fays = _.random(4, 12);
			game.girl.atk += this.atks;
			game.girl.live += this.lives;
			game.girl.fay += this.fays;

		}

	}
	Scene.prototype.fsn = function () {
		this.kn += 100;
		if (this.kn > 500) {
			game.atk.live -= game.girl.atk - game.atk.fay;
			this.kn = -20;
			game.beginn = false;
		} if (game.atk.live <= 0) {
			//怪已经死亡
			//console.log("wosil");
			game.sxs = false;
			this.atks = _.random(10, 28);
			this.lives = _.random(30, 50);
			this.fays = _.random(4, 12);
			game.girl.atk += this.atks;
			game.girl.live += this.lives;
			game.girl.fay += this.fays;

		}


	}
	//敌人的子弹
	Scene.prototype.sf = function () {
		game.ctx.drawImage(game.res["g4"], 63 * this.k, 63 * this.i + 3, 64, 64, -this.x1, 360, 63, 63);
		this.x1 += 56;
		this.i++;
		if (this.i == 4) {
			this.i = 1;
			this.k++;
			if (this.k == 2) {
				this.k = 0;
			}
		}
		if (this.x1 > -160) {
			this.x1 = -560;
			//攻击到达此处，

			game.begins = false;

		}

	}

})();