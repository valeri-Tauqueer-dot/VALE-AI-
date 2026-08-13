
// VALE AI Trading Interface Engine

const protectedPages = [

    "index.html",

    "command.html",

    "market.html",

    "strategy.html",

    "shield.html",

    "core.html",

    "intelligence.html"

];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {

    const token = localStorage.getItem("vale_token");

    if (!token) {

        window.location.href = "login.html";

    }

}

document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"VALE Intelligence System Activated"
);





// ENTER VALE BUTTON


const launchButton =
document.querySelector("button");



if(launchButton){


launchButton.addEventListener(
"click",
()=>{


launchButton.innerHTML =
"ACCESSING VALE...";


setTimeout(()=>{


launchButton.innerHTML =
"VALE ONLINE";


},1500);



});

}




// AI STATUS SYSTEM


const status =
document.querySelector(".panel-top span");



if(status){


const states=[

"ONLINE",

"ANALYZING",

"LEARNING",

"READY"

];


let index=0;



setInterval(()=>{


index++;


if(index >= states.length){

index=0;

}



status.textContent =
states[index];



},3000);



}






// CARD INTERACTION


const cards =
document.querySelectorAll(".card");



cards.forEach(card=>{


card.addEventListener(
"mouseenter",
()=>{


card.style.transition =
"0.4s";


}
);



});






// SMALL AI PULSE EFFECT


const energy =
document.querySelector(
".energy-ring"
);



if(energy){


setInterval(()=>{


energy.style.boxShadow =
"0 0 40px #00E5FF";


setTimeout(()=>{


energy.style.boxShadow =
"none";


},700);



},2000);



}




});
function logout(){

    localStorage.removeItem("vale_token");

    window.location.href = "login.html";

}