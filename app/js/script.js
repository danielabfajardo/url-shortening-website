//Modified a bit https://github.com/riyakushwaha/URLShortener 's code 
//I'm a beginner and used her code to learn and understand how js works
//ALL THE CREDIT FOR THEIR CODE GOES TO THEM

"use strict";

const inputLink = document.querySelector(".shorten__text");
const errorLabel = document.querySelector(".shorten__label");
const submitButton = document.querySelector(".submit__btn");
const outputBox = document.querySelector(".shorten__output");

function isInputALink(url) {    
    var isValid = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return isValid.test(url);    
}

class URLShortener {

    #API_URL = "https://api.shrtco.de/v2/shorten?url=";
    #flag = 0;

    constructor(){
        submitButton.addEventListener("click", this.getShortenUrl.bind(this));
        outputBox.addEventListener("click", this.copyText.bind(this));
    }
    
    getShortenUrl(e){
        e.preventDefault();

        const inputURL = inputLink.value;
        if(inputURL === "" || isInputALink(inputURL) === false){ 
            inputLink.classList.add("invalid-input");
            errorLabel.classList.add("invalid-msg");
            this.#flag = 1;
            inputLink.value = "";
            if(inputURL === "") {
                errorLabel.innerHTML = "Please add a new link";
            } else {
                errorLabel.innerHTML = "Not a valid link. Please try again";
            }
        } else if(inputURL!== ""){
            if(this.#flag === 1){
                inputLink.classList.remove("invalid-input");
                errorLabel.classList.remove("invalid-msg");
                this.#flag = 0;
            }
            inputLink.value = "";
            this.callAPI(inputURL);
        };
    }

    callAPI(inputURL){

        const request = fetch(`${this.#API_URL+inputURL}`);
        request.then((response) => response.json()).then((data) => this.renderOutput(inputURL, data.result.full_short_link));

    }

    renderOutput(inputLink, shortenUrl){
        const html = `<div class="shorten__output-box">
        <div class="input__link">
            <p>${inputLink}</p>
          </div>
          <div class="line hide-for-desktop"></div>
          <div class="output__link">
            <p class="final__link">${shortenUrl}</p>
            <button type="button" class="button copy-btn">Copy</button>
          </div>
        </div>`;

      outputBox.insertAdjacentHTML("afterbegin", html);
    }

    copyText(e){
        if(!e.target.classList.contains("copy-btn")) return;

        const text = e.target.closest(".shorten__output-box").querySelector(".output__link").querySelector(".final__link").innerText;
        
        const inputElement = document.createElement('input');
        inputElement.setAttribute("value", text);
        document.body.appendChild(inputElement);
        inputElement.select();
        document.execCommand("copy");
        inputElement.parentNode.removeChild(inputElement);
        inputElement.value = "";

        e.target.innerHTML = "Copied!";
        e.target.style.backgroundColor = "hsl(257, 27%, 26%)";

        setTimeout(() => {
            e.target.innerHTML = "Copy";
            e.target.style.backgroundColor = "hsl(180, 66%, 49%)";
        }, 5000);
    }
}

const app = new URLShortener();