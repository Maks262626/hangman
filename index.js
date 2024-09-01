import { getRandomWord } from "./words.js";
import { DrawHangman } from "./drawHangman.js";

const alphabet = 'abcdefghijklmnopqrstuvwxyz';


const btnWrapper = document.querySelector('.buttons');
const wordWrapper = document.querySelector('.word');
const attemptsText = document.querySelector('.attempts');
const winsText = document.querySelector('.score__wins');
const losesText = document.querySelector('.score__loses');

const delay = (fn, ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            fn();
            resolve();
        }, ms);
    });
}

class HangmanGame{
    #drawHangman = new DrawHangman();
    #maxAttempts = 6;
    #wins = 0;
    #loses = 0;
    
    #word;
    #guessWord;
    #remainingLetters;
    #attemps;

    resetBtns(){
        btnWrapper.innerHTML = '';
        [...alphabet].map(letter => {
            let btn = document.createElement('button');
            btn.classList.add('btn-key');
            btn.innerText = letter;
            btnWrapper.append(btn);
        })
    } 
    initialize(){
 
        this.#drawHangman.clearHangman();
        this.#drawHangman.progressBar();
        this.resetBtns();
        let btns = document.querySelectorAll('.buttons .btn-key');
        btns.forEach(btn => {
            btn.disabled = true;
        })
        delay(()=>{
            btns.forEach(btn => {
                btn.disabled = false;
            })
        },this.#drawHangman.duration);
        this.resetAttemps();
        this.resetScore();
        this.resetWord();
        this.#drawHangman.drawGallow();
    }
    resetAttemps(){
        this.#attemps = this.#maxAttempts;
        attemptsText.innerHTML = "Attemps: " + this.#maxAttempts;
    }
    resetWord(){
        this.#word = getRandomWord();
        this.#guessWord = new Array(this.#word.length).fill('_');
        this.#remainingLetters = this.#word.length;
        wordWrapper.innerHTML = this.#guessWord.join(" ");
    }
    resetScore(){
        winsText.innerHTML = "Wins: " + this.#wins;        
        losesText.innerHTML = "Loses: " + this.#loses;    
    }
    async restartGame(){
        let btns = document.querySelectorAll('.buttons .btn-key');
        btns.forEach(btn => {
            btn.disabled = true;
        })
        
        delay(()=>{
            this.game()
        },2000);


    }
    drawPart(){
        const drawParts = [
            () => {this.#drawHangman.drawRightLeg()},
            () => {this.#drawHangman.drawLeftLeg()},
            () => {this.#drawHangman.drawRightHand()},
            () => {this.#drawHangman.drawLeftHand()},
            () => {this.#drawHangman.drawBody()},
            () => {this.#drawHangman.drawHead()},
        ]
        drawParts[this.#attemps]();
        this.#drawHangman.progressBar();
        let btns = document.querySelectorAll('.buttons .btn-key');
        btns.forEach(btn => {
            btn.disabled = true;
        })
        if(this.#attemps <= 0) return;
        delay(()=>{
            btns.forEach(btn => {
                btn.disabled = false;
            })
        },this.#drawHangman.duration);
        
    }
    game(){
        this.initialize();
        
        const btns = document.querySelectorAll('.buttons .btn-key');
        btns.forEach(btn => {
            btn.addEventListener('click',(e)=>{
                e.preventDefault();
                let isWrong = true;
                this.#word.split('').forEach((letter,index) => {
                    if(e.target.innerHTML === letter){
                        this.#guessWord[index] = letter;
                        this.#remainingLetters--;
                        isWrong = false;
                    }
                })
                if(isWrong){
                    this.#attemps--;
                    attemptsText.innerHTML = "Спроб: " + this.#attemps;
                    this.drawPart();
                    if (this.#attemps == 0) {
                        this.#loses++;
                        this.restartGame();
                    } 
                }else{
                    wordWrapper.innerHTML = this.#guessWord.join(" ");
                    if(this.#remainingLetters == 0){
                        this.#wins++;
                        this.restartGame();
                    }
                }
                btn.style.visibility = "hidden";
            })
        })
    }
}
const hangman = new HangmanGame();
hangman.game();







