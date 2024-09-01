import { getRandomWord } from "./words.js";


const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");
const cw = canvas.width;
const ch = canvas.height;


class DrawHangman{

    drawGallow(){
        let x = cw*0.75;
        let lw = 5;
        let speed = 5;
        let isEnd = false;
        const drawGallow = {
            currentState: null,
            
            states: {
                bottom: {
                    draw() {
                        ctx.beginPath();
                        ctx.lineWidth = lw;
                        ctx.moveTo(cw * 0.75, ch - lw);
                        ctx.lineTo(x, ch - lw);
                        ctx.stroke();
                        x += speed;
                        if (x >= cw - lw) {
                            drawGallow.transitionTo('stick');
                        }
                    }
                },
                stick: {
                    draw() {
                        ctx.beginPath();
                        ctx.lineWidth = lw;
                        ctx.moveTo(cw * 0.875 - lw / 2, ch - lw);
                        ctx.lineTo(cw * 0.875 - lw / 2, x);
                        ctx.stroke();
                        x -= speed;
                        if (x <= lw) {
                            x = cw * 0.875;
                            drawGallow.transitionTo('top');
                        }
                    }
                },
                top: {
                    draw() {
                        ctx.beginPath();
                        ctx.lineWidth = lw;
                        ctx.moveTo(cw * 0.875, 1.5 * lw);
                        ctx.lineTo(x, 1.5 * lw);
                        ctx.stroke();
                        x -= speed;
                        if (x <= cw / 2) {
                            x = lw;
                            drawGallow.transitionTo('smallStick');
                        }
                    }
                },
                smallStick: {
                    draw() {
                        ctx.beginPath();
                        ctx.lineWidth = lw;
                        ctx.moveTo(cw / 2, lw);
                        ctx.lineTo(cw / 2, x);
                        ctx.stroke();
                        x += speed;
                        if (x >= ch/2-20) {
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
                function animate() {
                    if(isEnd) return;
                    drawGallow.currentState.draw();
                    requestAnimationFrame(animate);
                }
                
                animate();
            }
        };
        drawGallow.animate();
    }
    drawHead() {
        let lw = 3;
        let x = 0;
        return function animate() {
          ctx.beginPath();
          ctx.lineWidth = lw;
          ctx.arc(cw / 2, ch / 2, 25, 0, x * Math.PI);
          ctx.stroke();
          ctx.closePath();
          x += 0.03;
          if(x>= 2.1) return;
          requestAnimationFrame(animate);
        };
    }
    drawBody(){
        let lw = 3;
        let x = ch/2+25;
        return function animate(){
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.moveTo(cw/2,ch/2+25);
            ctx.lineTo(cw/2,x);
            ctx.stroke();
            ctx.closePath();
            x += 1;
            if(x >= ch*0.8) return;
            requestAnimationFrame(animate);
        }
    }
    drawLeftHand(){
        let lw = 3;
        let x = cw/2;
        let y = ch/2+25;
        return function animate(){
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.moveTo(cw/2,ch/2+25);
            ctx.lineTo(x,y);
            x-=1;
            y+=1;
            ctx.stroke();
            ctx.closePath();
            if(x<=cw*0.35) return;
            requestAnimationFrame(animate);
        }
    }
    drawRightHand(){
        let lw = 3;
        let x = cw/2;
        let y = ch/2+25;
        return function animate(){
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.moveTo(cw/2,ch/2+25);
            ctx.lineTo(x,y);
            x+=1;
            y+=1;
            ctx.stroke();
            ctx.closePath();
            if(x>=cw*0.65) return;
            requestAnimationFrame(animate);
        }
    }
    drawLeftLeg(){
        let lw = 3;
        let x = cw/2;
        let y = ch*0.8;
        return function animate(){
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.moveTo(cw/2,ch*0.8);
            ctx.lineTo(x,y);
            x-=1;
            y+=1;
            ctx.stroke();
            ctx.closePath();
            if(x<=cw*0.35) return;
            requestAnimationFrame(animate);
        }
    }
    drawRightLeg(){
        let lw = 3;
        let x = cw/2;
        let y = ch*0.8;
        return function animate(){
            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.moveTo(cw/2,ch*0.8);
            ctx.lineTo(x,y);
            x+=1;
            y+=1;
            ctx.stroke();
            ctx.closePath();
            if(x>=cw*0.65) return;
            requestAnimationFrame(animate);
        }
    }
}

class HangmanGame{
    constructor(){
        this.arr = [
            'а', 'б', 'в', 'г', 'ґ', 'д', 'е', 'є', 'ж', 'з', 'и', 'і', 'ї', 'й', 'к', 'л', 'м',
            'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ю', 'я'
        ];
        this.btnWrapper = document.querySelector('.buttons');
        this.wordWrapper = document.querySelector('.word');
        this.attemptsText = document.querySelector('.attempts');
        this.winsText = document.querySelector('.score__wins');
        this.losesText = document.querySelector('.score__loses');

        this.d = new DrawHangman();

        this.wins = 0;
        this.loses = 0;
        this.attemptsCount = 6;
        this.attempts = this.attemptsCount;
        this.word = getRandomWord();
        this.guessWord = [];
        this.remainingLetters = this.word.length;
    }
    resetButns(){
        this.btnWrapper.innerHTML = '';
        for (let i = 0; i < this.arr.length; i++) {
            let btn = document.createElement('button');
            btn.classList.add('btn-key');
            btn.innerText = this.arr[i];
            this.btnWrapper.append(btn);
        }
    } 
    resetAttemps(){
        this.attemps = this.attemptsCount;
        this.attemptsText.innerHTML = "Спроб: " + this.attemps;
    }
    resetWord(){
        this.word = getRandomWord();
        this.guessWord = [];
        this.remainingLetters = this.word.length;
        for (let i = 0; i < this.word.length; i++) {
            this.guessWord.push("_");
        }
        this.wordWrapper.innerHTML = this.guessWord.join(" ");
    }
    resetScore(){
        this.winsText.innerHTML = "Виграшів: " + this.wins;        
        this.losesText.innerHTML = "Програшів: " + this.loses;    
    }
    initialize(){
        this.resetButns();
        this.resetAttemps();
        this.resetWord();
        this.resetScore();
        this.d.drawGallow();
    }
    drawPart(){
        switch(this.attemps){
            case 5:
                this.d.drawHead()();
                break;
            case 4:
                this.d.drawBody()();
                break;
            case 3:
                this.d.drawLeftHand()();
                break;
            case 2:
                this.d.drawRightHand()();
                break;
            case 1:
                this.d.drawLeftLeg()();
                break;
            case 0:
                this.d.drawRightLeg()();
                break;
        }
    }
    start(){
        this.initialize();
        const btns = document.querySelectorAll('.buttons .btn-key');
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', (e) => {
                e.preventDefault();
                let isWrong = true;
                for (let i = 0; i < this.word.length; i++) {
                    if (e.target.innerText == this.word[i]) {
                        this.guessWord[i] = this.word[i];
                        this.remainingLetters--;
                        isWrong = false;
                    }
                }
                if (isWrong) {
                    this.attemps--;
                    this.attemptsText.innerHTML = "Спроб: " + this.attemps;

                    this.drawPart();
                    if (this.attemps == 0) {
                        this.loses++;
                        
                        setTimeout(() => {ctx.clearRect(0,0,cw,ch);}, 1000);
                        setTimeout(() => {this.start();}, 3000);
                    } 
                } else {
                    this.wordWrapper.innerHTML = this.guessWord.join(" ");
                    if(this.remainingLetters == 0){
                        this.wins++;
                        setTimeout(() => {ctx.clearRect(0,0,cw,ch);}, 1000);
                        setTimeout(() => {this.start();}, 3000);
                    }
                }
                btns[i].style.visibility = "hidden";
            });
        }
    }
}
let game = new HangmanGame();
game.start(); 





