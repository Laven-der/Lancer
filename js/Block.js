(function () {
	var Block = window.Block = function (row, col, type) {
		this.row = row;
		this.col = col;
		//类型1、2、3、4
		this.type = type;
		this.n = _.random(2, 5);
		this.init();
		this.render();
		//渲染
	};
	Block.prototype.init = function () {
		//行列
		//位置
		this.x = this.col * 46;
		this.y = this.row * 46;
		//自己的图片
		this.image = game.res["22"];
		//自己的切片位置
		this.cutX = (this.type - 1) * 66 * this.n;
	}
	Block.prototype.render = function () {
		if (game.str == 1) {
			// 	if(this.type ==1){
			// game.ctx.drawImage(game.res["g1"],2,0,61,61,this.x,this.y+20,61,59);}
			if (this.type == 1) {
				game.ctx.drawImage(game.res["g2"], 2, 0, 61, 61, this.x, this.y, 61, 59);
			}
			if (this.type == 2) {
				game.ctx.drawImage(game.res["g1"], 2, 0, 61, 61, this.x, this.y, 61, 59);
			}
		}
		if (game.str == 2) {

			if (this.type == 2) {
				// 更新管子的包围盒
				this.x1 = parseInt(this.x - 30);
				this.x2 = parseInt(this.x + 30);
				this.y1 = parseInt(this.y - 30);
				this.y2 = parseInt(this.y + 30);
				//判断怪是否相遇
				if (game.girl.x2 > this.x1 && game.girl.y1 < this.y1 && game.girl.x1 < this.x2) {
					game.scene.sceneNumber = 2;
					game.scene.init(2);
				}
				game.ctx.drawImage(game.res["g1"], 2, 0, 61, 61, this.x, this.y, 61, 59);
			}
		}
	}
	//不同的图来不同的怪
})();