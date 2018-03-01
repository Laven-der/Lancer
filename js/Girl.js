(function(){

	var Girl = window.Girl = function(){
		this.image = game.res["girl"]
       this.y  =460;
       this.x =200;
    	this.i = 0;      //切换图片的标志  
       console.log(this.image)
    	this.w = this.image.width / 12,  
    	this.h = this.image.height / 4;  
       	console.log(this.h);
    	this.flag = 0;   //方向的标志  
    	this.direction = null;
    	this.Ismove=false;
    	//攻击力
    	this.atk =100;
    	//防御
    	this.fay = 50;
    	//生命值
    	this.live = 100;
    	this.n=0;
    }
    Girl.prototype.render = function(){
    	game.ctx.drawImage(this.image, this.w * this.i-4, this.h * this.flag, this.w, this.h,this.x,this.y,95,100.75);
    	// game.ctx.drawImage(this.image,this.w*this.i, 1, 87, 96,this.x,this.y, 87, 96);  
    	
    	var string = "传说，有一把名为“太昊”的神剑，多年前被一个不知名的冶铁师所打造，拥有开天辟地、重分六界的力量。后来这位冶铁师和太昊刀一起消失于人间，有人说魔尊杀人多刀，正准备侵略人间；有人说五帝怕此刀落入恶人之手，将其封印在极北之地——神寂渊中……各有各的说法。数千年后的今天，一直沉默的星司大师发出了预言：“太昊出，混沌生”，皇宫内众人大惊。太昊乃伏羲的别称，所以都认为将会有什么大恶魔想借伏羲之力破坏六界秩序。于是颁布密令，密切留意一切与伏羲有关的任何事，即使是名字有个“昊”字，也要监视一番。预言发出后，寻常人间并不知情。玩家扮演一名在山上修炼的仙门门徒，天资聪敏，却只会一些基本的拳脚功夫。这一天，从主角在望山台偷懒开始……"
        this.n+=3;
        if(game.girl.x==200&&game.str==1&&game.girl.atk==100)
        game.drawText(string, 20,this.n,322);
     if(this.n>190){
     	this.n=190;
     }
     if(game.str==3){
     	 game.ctx.drawImage(game.res["sd"],530,215,120,124);
     	  game.f%8==0&&this.n++;
            if(this.n>10){
                this.n=6;
            }
     }
    
    		game.tis.say();
    
    	 if(game.str==4){
        if(this.y<350){
        	this.y==550;
        }
    	}
    };
	Girl.prototype.update = function(){
		//设置移动状态
		var n =10;
		var oldx = this.x;
 		var oldy = this.y;
 		if(game.map.image== game.res["kais"]) return;
		// game.td.style.display="none";
			switch (this.direction){
				case "R":
				this.x+=n;
				this.flag = 2;
				// this.image = arr[1];
				break;
				case "S":
				n++;
				if(n>14){
					n=10;
				}
				break;
				case "L":
				this.x-=n;
				this.flag = 1;
				// this.image = arr[0];
				break;
				case "F":
				this.td.style.display="block";
				h+=32;
				if(h>300){
					h=40;
				}this.td.style.left=h+"px";
				break;
				case "D":
				this.y+=n;
				this.flag = 0;
				// this.image = arr[1];
				break;
				case "U":
				this.y-=n;
				this.flag = 3;
				// this.image = arr[0];
				break;
				case "E":
				this.y-=n;
				this.x+=n;
				this.flag = 3;
				break;
				case "Q":
				this.y-=n;
				this.x-=n;
				this.flag = 1;
				break;
			}
			this.i++;  
        this.i = this.i % 8;
        // console.log(this.x,this.y)
	    if(this.x < 0 || this.x > 960 -60 || this.y < 250 || this.y > 600 - 100){
					this.x = oldx;
					this.y = oldy;
				}
				if(this.x>=860&&this.y>=480){
					game.map = new Map();
					game.map.render();
					this.y  =490;
       				this.x =250;
				}
				if(this.x<10&&this.y>=460){
					game.str-=2;
					if(game.str<0){
						game.str=0;
					}
					game.map = new Map();
					game.map.render();
					this.y  =490;
       				this.x =250;
				}
		this.x1 = parseInt(this.x - 30);
        this.x2 = parseInt(this.x + 30);
        this.y1 = parseInt(this.y - 32.5);
        this.y2 = parseInt(this.y + 32.5);
	}
})()

