(function(){
		var Tis = window.Tis = function(){
       this.image = game.res["bos"];
       this.y  =90;
       this.x =380;
    	//攻击力
    	this.atk = 100;
    	//防御
    	this.fay = 50;
    	//生命值
    	this.live = 100;
    	this.deg=0;
        this.n=0;
        this.move=true;
    }
    Tis.prototype.render = function(){
        

    	  if(game.str==1){
            document.querySelector("#shizhi").style.display="block";
    	// game.ctx.drawImage(this.image,this.x, this.y); 
         } 
    	else if(game.str==3){
        game.ctx.drawImage(game.res["fei"],340,100,220,163); 
         game.f%8==0&&this.n++;
            if(this.n>10){
                this.n=6;
            }
         }
         else if(game.str ==4){
            game.ctx.drawImage(game.res["nvs"],this.x, 130+this.n,220,210);
            game.f%8==0&&this.n++;
            if(this.n>10){
                this.n=6;
            }
         }
         if(game.str ==2){
            document.querySelector("#shizhi").style.display="none";
            game.ctx.drawImage(game.res["wq"],340,80,35,125)
             game.f%8==0&&this.n++;
            if(this.n>10){
                this.n=1;
            }
         }
    };
    Tis.prototype.say = function(){
    	if(game.str ==1)
           { 
        if(game.girl.x>820&&game.girl.y>290){
            if(this.move){
                  var string = "前方禁止通行！";
            game.drawText(string, 630,470,322);
                game.girl.x=820;}
            }
              if(game.girl.y<290){
                if(game.girl.atk<200){
            var string = "十八年过去了，你该出去历练一番…，然后去取得前方洞窟中的伏魔剑";
                game.drawText(string, 490,70,322);}
               this.move=false;
               if(game.girl.atk==600){
           var string = "不错，你已经拿到了伏魔剑，但这只是未解封的，近日邪气蔓延，你前往咸阳城一探究竟！";
                game.drawText(string, 490,70,322);
            }
          }
        }
    	if(game.str ==2&&game.girl.y<290){
            if(game.girl.atk<500){
        game.ctx.fillText("你现在并没有资格掌控他", 280,this.y );}
        
        if(game.girl.atk>500){
            game.ctx.fillText("原来你就是这个真正的主人。。。。。", 280,this.y );
            game.girl.atk=600;
        }}
        if(game.str ==3&&game.girl.y<290){
            if(game.girl.live<200){
        game.ctx.fillText("少侠去找右边的药郎恢复吧。。。。。", 280,this.y );
       
        if(game.girl.x1>480){
    	game.girl.live+=10;}//此时是保护期，可以自动的把血量恢复到200；
        game.girl.x=510;
         }
       if(game.girl.live>=200){
        game.ctx.fillText("当少侠的血量低于200才能恢复。。。。。", 280,this.y );
        game.ctx.x=520;
       }
    if(game.girl.atk>300){
          game.ctx.fillText("接下来的路需要你自己去闯。。。。。", 350,240 );
       }
    }
     if(game.str ==3&&game.girl.x>820&&game.girl.atk<1599){
        if(game.str ==3&&game.girl.x>820&&game.girl.atk==600){
         game.ctx.fillText("总算是有了一些自保之力!", 580,420 ); 
      }else{game.girl.x=820;
        game.ctx.fillText("江湖险恶，还是先磨炼一番才出去,先去取伏魔剑!", 580,420 );}
      }
    if(game.str ==4&&game.girl.y<=390){
                game.girl.y=390;
        game.ctx.fillText("欢迎来到竞技场!", 280,220 );
            }
      if(game.str ==5&&game.girl.x>=790&&game.girl.y>=246){
                game.girl.y=250;
        game.ctx.fillText("前往客栈休息一夜!", 810,220 );
         
            }
    };
})()