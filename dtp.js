class init {
	constructor(){}
	pen(){
		this.canvas = document.getElementById('myCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.wid = this.canvas.width;
		this.hei = this.canvas.height;
		this.paper = document.getElementById('paper');
		this.paper.setAttribute('class','hpaper')
		this.saveRound = 0;
		this.bord()
	}
	//线段
	drawDashLine(ctx, x1, y1, x2, y2, dashLength){
	    var dashLen = dashLength === undefined ? 5 : dashLength,
		    xpos = x2 - x1, 
		    ypos = y2 - y1,
	      	numDashes = Math.floor(xpos / dashLen); 
	    for(var i=0; i<numDashes; i++){
	        if(i % 2 === 0){
	            ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i); 
	        }else{
	            ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
	        }
	    }
	    ctx.stroke();
    }
    //兼容事件
    addEvent(elem, type, handler){
	    if (elem.addEventListener) {
	        elem.addEventListener(type, handler, false);
	    }else if (elem.attachEvent) {
	        elem['temp' + type + handler] = handler;
	        elem['temp' + type] = function () {
	            handler.call(elem);
	        }
	        elem.attachEvent('on' + type, elem['temp' + type]);
	    }else {
	        elem['on' + type] = handler;
	    }
	}
	removeEvent(elem, type, handler) {
	    if (elem.removeEventListener) {
	        elem.removeEventListener(type, handler, false);
	    }else if (elem.detachEvent) {
	        elem.detachEvent('on' + type,handler);
	    }else {
	        elem['on' + type] = false;
	    }
	}
	//随机事件
	GetRandomNum(min,max){
		let num = max - min;
		let random = Math.random();
		return (min + Math.round(num * random))
	}
	//角度
	corner(){
		const cor = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,-0.5,-0.6,-0.7,-0.8,-0.9,-1,-1.1-1.2,-1.3-1.4];
		const num = this.GetRandomNum(0,17);
		return cor[num]
	}
	//运动速度
    move(who){
		if(who == 'ctxball'){
			let y = this.hei/2;
			let x = this.wid/2
			let speeds = this.corner();
			const ra = this.GetRandomNum(0,1);
			const arr = [-1,1];
			let dir = arr[ra];
			let lock = 1;
			let ys ;
			this.ball(x,y);
	    	let timer = setInterval(()=>{
				this.ctxball.clearRect(0,0,this.wid,this.hei)
				this.ball(x,y);
				if(speeds>1.2||speeds<-1.2){
					ys = 1.3
				}else if(1.2>speeds&&speeds>0.9||speeds<-1.2&&speeds<-0.9){
					ys = 2
				}else if(speeds < 0.8 && speeds > -0.8){
					ys = 3
				}else{
					ys = 2.5
				}
				if(lock == 1){
					y+= ys*speeds;
				}else{
					y-= ys*speeds;
				}
				if (dir == 1) {
					x += 2.3;
					if (x >= this.wid-3||x <= 6) {
						dir = -dir
					};
				}else if(dir == -1){
					x -= 2.3;
					if (x >= this.wid-3||x <= 6) {
						dir = -dir
					};
				}
				if (this.p1x-6<=x&&x<=this.p1x+56 && y<=(this.hei-28) &&y>=(this.hei-31)
					||this.comx-6<=x&&x<=this.comx+56 && y>=28&&y <= 31
					||this.p2x-6<=x&&x<= this.p2x+56 && y>=28&&y <= 31) {
					lock = -lock;
				};
				if (y > this.hei+12 || y < -12) {
			        clearInterval(timer);
			        if(y < 0){
			        	this.t = this.t-1
			        	this.score(this.t,this.b)
			        }else if(y > 600){
			        	this.b = this.b-1
			        	this.score(this.t,this.b)
			        }
			        this.win()	        
			        
			    }
			},16)
	    }else if(who == 'ctxplayer1'){
	    	this.player(this.hei-30)
    	}else if(who == 'ctxcomputer'){
    		let x = this.wid/2-25;
    		let timer = setInterval(()=>{
    			this.ctxcom.clearRect(0,20,this.wid,10)
    			if(this.by > 0&&this.by < 600){
					if (this.comx+25 < this.bx) {
	    				x +=2 
	    			}else if(this.comx+25 > this.bx){
	    				x -= 2
	    			}
    			}
    			this.computer(x)
    		},16)
    	}else if(who == 'ctxplayer2'){
    		this.player(20)
    	}
   	}
   	player(where){
   		let timer;
   		let time;
	   	let key = true;
	   	let lock = true;
	   	let up = (e)=>{
	   		if (e.keyCode == 39 || e.keyCode == 37) {
	   			key = true;
	   			clearInterval(timer);
	   		}else if(e.keyCode == 65 || e.keyCode == 68){
	   			clearInterval(time);
	   			lock = true
	   		}
	   	}
	   	let x1 = this.wid/2-25;
	   	let x2 = this.wid/2-25;
	   	let down = (e)=>{
	   		if (e.keyCode == 39) {
	   			if(key){
	   				key = false;
	   				timer = setInterval(()=>{
	    				this.ctxplayer1.clearRect(0,where,this.wid,10);
	    				x1 += 2.5;
	    				this.player1(x1)
	    				if (x1 >= 410) {
	    					clearInterval(timer)
	    				};
	   				},16)
	   			}	    			
	   		}else if(e.keyCode == 37){
	   			if (key) {
	   				key = false
	    			timer = setInterval(()=>{
	    				this.ctxplayer1.clearRect(0,where,this.wid,10);
	    				x1 -= 2.5;
	    				this.player1(x1)
	    				if (x1 <= -10) {
	    					clearInterval(timer)
	    				};
	    			},16)
	   			}
	   		}else if (e.keyCode == 68) {
	   			if(lock){
	   				lock = false;
	   				time = setInterval(()=>{
	    				this.ctxplayer2.clearRect(0,where,this.wid,10);
	    				x2 += 2.5;
	    				this.player2(x2)
	    				if (x2 >= 410) {
	    					clearInterval(time)
	    				};
	   				},16)
	   			}	    			
	   		}else if(e.keyCode == 65){
	   			if (lock) {
	   				lock = false
	    			time = setInterval(()=>{
	    				this.ctxplayer2.clearRect(0,where,this.wid,10);
	    				x2 -= 2.5;
	    				this.player2(x2)
	    				if (x2 <= -10) {
	    					clearInterval(time)
	    				};
	    			},16)
	   			}
	   		}	   			   		
	   	}
	   	this.addEvent(document,'keydown',down)
	   	this.addEvent(document,'keyup',up)
   	}
    //画底板
	bord(){
		//大圆
		this.ctx.beginPath();
		this.ctx.strokelStyle='#000';
		this.ctx.lineWidth=5;
		this.ctx.arc(this.wid/2,this.hei/2,this.wid/2-60,0,Math.PI*2)
		this.ctx.stroke()
		//线
		this.ctx.beginPath();
		this.drawDashLine(this.ctx,60,this.hei/2,this.wid-40,this.hei/2,10)
		this.ctx.strokStyle='#000';
		this.ctx.lineWidth= 4;
		this.ctx.stroke();
		
		//player1
		this.ctxplayer1 = this.canvas.getContext('2d');

		//computer
		this.ctxcom = this.canvas.getContext('2d');
		this.cli()
	}
	//回合
	Round(round,score){
		this.ctx.clearRect(this.wid/2-100,this.hei/2-50,250,40)
		this.ctx.beginPath();
		this.ctx.textAlign="center";
    	this.ctx.fillStyle = "rgba(255,255,255,0.8)";
    	this.ctx.font="40px Arial"
		this.ctx.fillText('Round'+round+'   '+score,this.wid/2,this.hei/2-20) 
	}
	//选择玩家数量
	cli(){
		let text;
		this.addEvent(this.paper,'click',(e)=>{
			if (e.path.length == 5) {
				return ''
			}else if(e.path.length == 6){
				text = e.path[0].children[0].innerText
			}else if(e.path.length == 7){
				text = e.path[0].innerText
			}
			this.paper.setAttribute('class','npaper')
			this.txt = text;
			this.start(text)
		})
	}
	//分数
	score(score1,score2){
		//scoreBord
		this.ctx.clearRect(10,60,40,40);
		this.ctx.clearRect(10,500,40,40);
		this.ctx.beginPath();
		this.ctx.fillStyle="rgba(255,255,255,0.5)"
		this.ctx.moveTo(50, 100);
		this.ctx.arcTo(10, 100, 10, 60, 10);
		this.ctx.arcTo(10, 60, 50, 60, 10);
		this.ctx.arcTo(50, 60, 50, 100, 10);
		this.ctx.arcTo(50, 100, 10, 100, 10);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.moveTo(10, 500);
		this.ctx.arcTo(10, 540, 50, 540, 10);
		this.ctx.arcTo(50, 540, 50, 500, 10);
		this.ctx.arcTo(50, 500, 10, 500, 10);
		this.ctx.arcTo(10, 500, 10, 540, 10);
		this.ctx.closePath();
		this.ctx.fill(); 
		//score1
		this.ctx.beginPath();
		this.ctx.textAlign="center";
    	this.ctx.fillStyle = "rgba(0,0,0,0.8)";
    	this.ctx.font="30px Arial"
		this.ctx.fillText(score1,30,90)
		//score2
		this.ctx.beginPath();
		this.ctx.textAlign="center";
    	this.ctx.fillStyle = "rgba(0,0,0,0.8)";
    	this.ctx.font="30px Arial"
		this.ctx.fillText(score2,30,this.hei-70)
	}
	//小球
	ball(x,y){
		this.ctxball.beginPath()
		this.ctxball.arc(x,y,6,0,Math.PI*2)
		this.ctxball.fill()
		this.bx = x;
		this.by = y;
	}
	//玩家1
	player1(x){
		this.ctxplayer1.beginPath();
		this.ctxplayer1.fillStyle = "#000";
		this.p1x = x;
		this.ctxplayer1.fillRect(x,this.hei-30,50,10)
	}
	//玩家2
	player2(x){
		this.ctxplayer2.beginPath();
		this.ctxplayer2.fillStyle = "#000";
		this.p2x = x
		this.ctxplayer2.fillRect(x,20,50,10)
	}
	//电脑
	computer(x){
		this.ctxcom.beginPath();
		this.ctxcom.fillStyle = "#FFF";
		this.comx = x;
		this.ctxcom.fillRect(x,20,50,10)
	}
	//备注
	cstart(){
		this.newcanvas = document.createElement('canvas')
		let body = document.getElementsByTagName('body')[0];
		body.appendChild(this.newcanvas)
		this.newcanvas.setAttribute('class','newcanvas');
		this.newcanvas.width = this.wid;
		this.newcanvas.height = this.hei;
		this.ctxstart = this.newcanvas.getContext('2d')
		this.ctxstart.beginPath()
		this.ctxstart.fillStyle="#9b59b6"
		this.ctxstart.fillRect(this.wid/2-100,this.hei/2-70,200,80);
		this.ctxstart.beginPath()
		this.ctxstart.textAlign="center";
		this.ctxstart.fillStyle="#000"
		this.ctxstart.font='20px Arial';
		this.ctxstart.fillText('按下任意按键开始游戏',this.wid/2,this.hei/2+5)
	}
	cball(){
		this.ballcanvas = document.createElement('canvas');
		this.body = document.getElementsByTagName('body')[0];
		this.body.appendChild(this.ballcanvas)
		this.ballcanvas.setAttribute('class','ballcanvas')
		this.ballcanvas.width=this.wid;
		this.ballcanvas.height=this.hei;
		this.ctxball = this.ballcanvas.getContext('2d');
		this.ctxball.fillStyle='yellow';
	}
	cplayer2(){
		//player2
		this.player2canvas = document.createElement('canvas');
		this.body.appendChild(this.player2canvas);
		this.player2canvas.setAttribute('class','newcanvas')
		this.player2canvas.width=this.wid;
		this.player2canvas.height=this.hei;
		this.ctxplayer2 = this.player2canvas.getContext('2d');
	}
	//游戏开始
	start(number){
		this.cball()
		let key;
		this.setLife = [5,4,3,2,1]
		this.classname = ['','round2','round3','round4','round5']
		this.Round(this.saveRound+1,this.setLife[this.saveRound])
		this.t = this.setLife[this.saveRound];
		this.b = this.setLife[this.saveRound]
		this.score(this.t,this.b)
		this.cstart()
		if (number == '1') {
			this.computer(this.wid/2-25)
			this.player1(this.wid/2-25)
			key = true;
		}else if(number == '2'){
			this.player1(this.wid/2-25)
			this.cplayer2()
			this.player2(this.wid/2-25)
			key = false;
		}
		let up =()=>{
			this.newcanvas.setAttribute('class','npaper')
			if (key) {
				this.move('ctxball')
				this.move('ctxcomputer')
				this.move('ctxplayer1')
			}else{
				this.move('ctxball')
				this.move('ctxplayer1')
				this.move('ctxplayer2')
			}
			this.removeEvent(document,'keyup',up)
		}
		this.addEvent(document,'keyup',up)
	}
	//win
	win(){
		if (this.txt == '1') {
		   	if(this.b>0&&this.t>0){
		      	setTimeout(()=>this.move('ctxball'),1000)	
		    }else if(this.b == 0){
		       	setTimeout(()=>alert('Game Over'),500)
		    }else if(this.t == 0){
		      	this.saveRound++
				this.Round(this.saveRound+1,this.setLife[this.saveRound])
				this.t = this.setLife[this.saveRound];
				this.b = this.setLife[this.saveRound]
				this.score(this.t,this.b)
				this.canvas.setAttribute('class',this.classname[this.saveRound])
			  	setTimeout(()=>{this.move('ctxball')},1000)
			}
			if (this.saveRound == 4&&this.t == 0) {
				alert('you win~~~')
			};
		}else if(this.txt == '2'){
		 	if(this.b>0&&this.t>0){
	        	setTimeout(()=>this.move('ctxball'),1000)	
	        }else if(this.b == 0){
	        	setTimeout(()=>alert('player1 Game Over'),500)
	        }else if(this.t == 0){
	        	setTimeout(()=>alert('player2 Game Over'),500)
	        }
        }	
	}

}
var ini = new init()
ini.pen()