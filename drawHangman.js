const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");
const cw = canvas.width;
const ch = canvas.height;

export class DrawHangman {
    constructor(){
        this.duration = 1000;
        this.lw = 5;
        this.data = {
            gallow: {
                bottom: {start_x:cw*0.75,start_y:ch-this.lw,end_x:cw - this.lw,end_y:ch - this.lw},
                stick: {start_x:cw * 0.875 - this.lw / 2,start_y:ch - this.lw,end_x:cw * 0.875 - this.lw / 2,end_y:this.lw},
                top: {start_x:cw * 0.875 - this.lw / 2,start_y:this.lw,end_x:cw/2,end_y:this.lw},
                smallStick: {start_x:cw/2,start_y:this.lw,end_x:cw/2,end_y:ch/2-20},
            },
            head: {lw:3,xc:cw/2,yc:ch/2,r:25,sangle:0,eangle:2},
            body: {start_x:cw/2,start_y:ch / 2 + 25,end_x:cw / 2,end_y:ch * 0.8},
            leftHand: {start_x:cw / 2,start_y:ch / 2 + 25,end_x:0.4*cw,end_y:ch*0.7},
            rightHand: {start_x:cw / 2,start_y:ch / 2 + 25,end_x:0.6*cw,end_y:ch*0.7},
            leftLeg: {start_x:cw / 2,start_y:ch * 0.8,end_x:0.4*cw,end_y:ch*0.9},
            rightLeg: {start_x:cw / 2,start_y:ch * 0.8,end_x:0.6*cw,end_y:ch*0.9},
        }
    }
    drawLineAnimation(start_x,start_y,end_x,end_y,duration=this.duration){
        const startTime = performance.now(); 
        let x = start_x;
        let y = start_y;
        const animate = currentTime => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration,1);
            const dx = Math.abs(start_x-end_x);
            const dy = Math.abs(start_y-end_y);
            const x_dir = start_x < end_x ? 1 : -1;
            const y_dir = start_y < end_y ? 1 : -1;
            x = start_x + dx*progress*x_dir; 
            y = start_y + dy*progress*y_dir;
            ctx.beginPath();
            ctx.moveTo(start_x, start_y);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
            if (elapsedTime < duration) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }
    drawGallow() {
        let isEnd = false;
        const startTime = performance.now(); 
        
        const drawGallow = {
            currentState: null,
            states: {
                bottom: {
                    draw: (elapsedTime) => {
                        const {start_x,start_y,end_x,end_y} = this.data.gallow.bottom;
                        this.drawLineAnimation(start_x,start_y,end_x,end_y,this.duration/4);
                        if (elapsedTime-this.duration/4 > 0) {
                            drawGallow.transitionTo('stick');
                        }
                    }
                },
                stick: {
                    draw: (elapsedTime) => {
                        const {start_x,start_y,end_x,end_y} = this.data.gallow.stick;
                        this.drawLineAnimation(start_x,start_y,end_x,end_y,this.duration/4);
                        if (elapsedTime-this.duration/2 > 0) {
                            drawGallow.transitionTo('top');
                        }
                    }
                },
                top: {
                    draw: (elapsedTime) => {
                        const {start_x,start_y,end_x,end_y} = this.data.gallow.top;
                        this.drawLineAnimation(start_x,start_y,end_x,end_y,this.duration/4);
                        if (elapsedTime-0.75*this.duration > 0) {
                            drawGallow.transitionTo('smallStick');
                        }
                    }
                },
                smallStick: {
                    draw: (elapsedTime) => {
                        const {start_x,start_y,end_x,end_y} = this.data.gallow.smallStick;
                        this.drawLineAnimation(start_x,start_y,end_x,end_y,this.duration/4);
                        if (elapsedTime-this.duration > 0) {
                            isEnd = true;
                        }
                    }
                }
            },

            transitionTo(newState) {
                this.currentState = this.states[newState];
            },

            animate() {
                this.transitionTo('bottom');
                
                function animate(currentTime) {
                    if (isEnd) return;
                    
                    const elapsedTime = currentTime - startTime;
                    drawGallow.currentState.draw(elapsedTime);
                    
                    requestAnimationFrame(animate);
                }
                requestAnimationFrame(animate);
            }
        };
        drawGallow.animate();
    }
    drawHead() {
        const {lw,xc,yc,r,sangle,eangle} = this.data.head;
        let x;
        const startTime = performance.now(); 
        const animate = currentTime => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(Math.abs(elapsedTime / this.duration), 1);

            x = progress * eangle;
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.arc(xc, yc, r, sangle, x * Math.PI);
            ctx.stroke();
            ctx.closePath();
            if (elapsedTime < this.duration) {
                requestAnimationFrame(animate);
            }

        };
        requestAnimationFrame(animate);

    }
    drawBody() {
        const {start_x,start_y,end_x,end_y} = this.data.body;
        this.drawLineAnimation(start_x,start_y,end_x,end_y);
    }
    drawLeftHand() {
        const {start_x,start_y,end_x,end_y} = this.data.leftHand;
        this.drawLineAnimation(start_x,start_y,end_x,end_y);
    }
    drawRightHand() {
        const {start_x,start_y,end_x,end_y} = this.data.rightHand;
        this.drawLineAnimation(start_x,start_y,end_x,end_y);
    }
    drawLeftLeg() {
        const {start_x,start_y,end_x,end_y} = this.data.leftLeg;
        this.drawLineAnimation(start_x,start_y,end_x,end_y);
    }
    drawRightLeg() {
        const {start_x,start_y,end_x,end_y} = this.data.rightLeg;
        this.drawLineAnimation(start_x,start_y,end_x,end_y);
    }
    clearHangman(){
        ctx.clearRect(0,0,cw,ch);
    }
    progressBar(){
        ctx.fillStyle = 'green';
        ctx.lineWidth = 5;
        let width = 0;
        const startTime = performance.now(); 
        
        const animate = currentTime => {
            const elapsedTime = currentTime - startTime;
            width = (elapsedTime / this.duration) * 100; 

            ctx.fillRect(10, 10, width, 20);
            ctx.strokeRect(10, 10, 100, 20);

            if (elapsedTime < this.duration) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(10, 10, 100, 20);
            }
        }

        requestAnimationFrame(animate);
    }
}



