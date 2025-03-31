"use strict";



// Returns an array of file names for us to put unique images on cards
function makeFileNamesList (numberOfCards) {
  let numberOfPictures = (numberOfCards - (numberOfCards % 2)) / 2

  // Fisher-Yates shuffle
  // We need to shuffle the cards, don't we?
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Creating the array itself
  let fileNames = new Array(numberOfCards);
  for (let i = 0; i < numberOfCards; i++){
    if (i < numberOfPictures) {
      fileNames[i] = `img/${i.toString().padStart(2, "0")}.png`;
    } else {
      fileNames[i] = 
        `img/${(i - numberOfPictures).toString().padStart(2, "0")}.png`;
    }
  }
  return shuffle(fileNames);
}

function getTheDialogWindow (){
  // Maybe we should use "id" to get the window instead of
  // querying around with classes
  let dialogWindow = document.querySelector(".dialogWindow_nonExistent");
  if (dialogWindow === null) {
    dialogWindow = document.querySelector('.dialogWindow_hidden');
  }
  return dialogWindow;
}

function makeADeck(numberOfCards) {

  let fileNames = makeFileNamesList(numberOfCards);
  // let gamingTable = document.getElementById("gamingTable");
  let gamingTable = document.createElement("div");
  gamingTable.setAttribute("class", "gamingTable");
  // let body = document.getElementById("body");
  // let dialogWindow = getTheDialogWindow();
  // body.insertBefore(gamingTable, dialogWindow);
  const slidingWindow = createSlidingWindow("Left");
  slidingWindow.appendChild(gamingTable);

  for (let i = 0; i < numberOfCards; i++) {
    let flipcard = document.createElement("div");
    let flipcard__frontSide = document.createElement("div");
    let flipcard__backSide = document.createElement("div");
    let flipcard__picture = document.createElement("img");
  
    flipcard.className = "flipcard";
    //flipcard.setAttribute("id", `flipcard${i}`);
    flipcard__frontSide.className = "flipcard__frontSide_obscure";
    flipcard__backSide.className = "flipcard__backSide_obscure";
    flipcard__picture.className = "flipcard__picture";
    flipcard__picture.setAttribute("src", fileNames[i]);
    flipcard__picture.setAttribute('draggable', false);
  
    flipcard__frontSide. appendChild(flipcard__picture);
    flipcard.appendChild(flipcard__frontSide);
    flipcard.appendChild(flipcard__backSide);
    gamingTable.appendChild(flipcard);
  }
}

function flipACard (flipcard) {
  let flipcard__frontSide = flipcard.firstElementChild;
  let flipcard__backSide = flipcard.lastElementChild;
  if (flipcard__frontSide.className === "flipcard__frontSide_obscure"){
    flipcard__frontSide.className = "flipcard__frontSide_exposed"
    flipcard__backSide.className = "flipcard__backSide_exposed"
  } else {
    flipcard__frontSide.className = "flipcard__frontSide_obscure"
    flipcard__backSide.className = "flipcard__backSide_obscure"
  }
}

// function createADialogWindow (){
//   let dialogWindow = document.createElement("div");
//   dialogWindow.setAttribute("class", "dialogWindow");
//   // dialogWindow.setAttribute("class", "dialogWindow_hidden");

//   let paragraph = document.createElement("p");
//   let paragraphText = document.createTextNode("Congratulations!! In kanji");
//   paragraph.appendChild(paragraphText);
//   let tryAgainButton = document.createElement("button");
//   let tryAgainButtonText = document.createTextNode("Try again! In kanji");
//   tryAgainButton.appendChild(tryAgainButtonText);
  
//   dialogWindow.appendChild(paragraph);
//   dialogWindow.appendChild(tryAgainButton);

//   let body = document.getElementById("body");
//   body.appendChild(dialogWindow);
// }



function showTheDialogWindow (){
  // document.querySelector('.dialogWindow').setAttribute("class", "dialogWindow");
   getTheDialogWindow().setAttribute("class", "dialogWindow");
  

  // dialogWindow.setAttribute("class", "dialogWindow");
}

function hideTheDialogWindow (){
  try {
    let dialogWindow = document.querySelector('.dialogWindow');
    dialogWindow.setAttribute("class", "dialogWindow dialogWindow_hidden");
  } catch (error) {
    
  }
  // getTheDialogWindow().setAttribute("class", "dialogWindow dialogWindow_hidden");
}

function fadeTheGamingTable (){
  let gamingTable = document.querySelector(".gamingTable");
  gamingTable.setAttribute("class", "gamingTable_faded");
}

function cardLogic (){
  flipACard(this);
  let prevPicture = "";
  try {
    prevPicture = prevOpenedCard.firstElementChild.
      firstElementChild.getAttribute("src");
  } catch {}
  let currPicture = this.firstElementChild.
    firstElementChild.getAttribute("src");

  if (prevOpenedCard === null){
    prevOpenedCard = this;
  } else if (prevOpenedCard === this){
    console.log("same card");
    prevOpenedCard = null;
  } else if (prevPicture === currPicture){
    // Later we should probably add an aura thing there
    console.log("same picture!");
    // Make it impossible to flip already discovered cards
    prevOpenedCard.removeEventListener("click", cardLogic);
    this.removeEventListener("click", cardLogic);
    window.numberOfCards = window.numberOfCards - 2;
    if (window.numberOfCards === 0) {
      console.log("Pat yourself on a back!");
      fadeTheGamingTable();
      // createADialogWindow();
      showTheDialogWindow();
    }
    prevOpenedCard = null;
  } else {
    // Here we copy the last two cards
    // to let the player to continue to flip cards
    let copy1 = this;
    let copy2 = prevOpenedCard;
    setTimeout(() => {
      flipACard(copy1);
      flipACard(copy2);
    }, 900);
    prevOpenedCard = null;
  }
}

function makeFlipcardsAlive(){
  window.prevOpenedCard = null; // the variable is sort of global at this point
  const flipcards = document.querySelectorAll(".flipcard");
  flipcards.forEach(function(flipcard){
    flipcard.addEventListener("click", cardLogic)
  })
}

// function eradicateTheScreen(selector){
//   let theScreen = document.querySelector(selector);
//   theScreen.classList.add("eradicated");
//   setTimeout(()=>{
//     theScreen.remove();
//   }, 800); // #gamingTable.remove() equal to CSS animation-duration for gamingTable
// }

function computeAnimationDuration(element) {
  let animationDuration = getComputedStyle(element).
    getPropertyValue("animation-duration");
  animationDuration = animationDuration.slice(0, -1);
  console.log(animationDuration);
  return parseFloat(animationDuration) * 1000;
}

function destroySlidingWindow(direction){
  // later, we should probably make sure the direction starts with an upper case
  const slidingWindow = document.querySelector(".slidingWindow");
  slidingWindow.setAttribute("class",
    `slidingWindow slidingWindow_destroyToThe${direction}`);
  setTimeout(()=>{
    slidingWindow.remove();
  }, computeAnimationDuration(slidingWindow)); // #gamingTable.remove() equal to CSS animation-duration for gamingTable
}

function createSlidingWindow(direction){
  // later, we should probably make sure the direction starts with an upper case
  let slidingWindow = document.createElement("div");
  slidingWindow.setAttribute("class",
    `slidingWindow slidingWindow_comingToThe${direction}`);
  let body = document.getElementById("body");
  let dialogWindow = document.querySelector(".dialogWindowContainer");
  body.insertBefore(slidingWindow, dialogWindow);
  // const header = document.querySelector(".header")
  // body.insertAfter(slidingWindow, header);
  return slidingWindow;
}

function createWelcomeScreen(direction) {
  const welcomeScreen = document.createElement("div");
  welcomeScreen.setAttribute("class", "welcomeScreen");

  const logoPicture = document.createElement("img");
  logoPicture.setAttribute("class", "pokemonLogo")
  logoPicture.setAttribute("src", "img/Pokémon_logo.png")
  welcomeScreen.appendChild(logoPicture);
  
  const welcomePicture =document.createElement("img");
  welcomePicture.setAttribute("class", "welcomePicture");
  welcomePicture.setAttribute("src", "img/wel_pok_02.png");
  welcomeScreen.appendChild(welcomePicture);

  const letsPlayBtn = document.createElement("button");
  letsPlayBtn.setAttribute("id", "letsPlayBtn");
  const letsPlayBtnText = document.createTextNode("をもたらし➤➤");
  letsPlayBtn.appendChild(letsPlayBtnText);
  letsPlayBtn.addEventListener("click", letsPlayBtnHandler);
  // const letsPlayBtnContainer = document.createElement("div");
  // letsPlayBtnContainer.appendChild(letsPlayBtn);
  // welcomeScreen.appendChild(letsPlayBtnContainer);
  welcomeScreen.appendChild(letsPlayBtn);
  
  const slidingWindow = createSlidingWindow(direction);
  slidingWindow.appendChild(welcomeScreen);
}

function letsPlayBtnHandler() {
  destroySlidingWindow("Left");
  window.numberOfCards = initialNumberOfCards;
  makeADeck(window.initialNumberOfCards);
  makeFlipcardsAlive();
  setTimeout(()=>{
    document.getElementById("goBackBtn").addEventListener("click",
      goBackBtnHandler);
  }, computeAnimationDuration(document.querySelector(".slidingWindow")));
  
}

function goBackBtnHandler() {
  document.getElementById("goBackBtn").
    removeEventListener("click", goBackBtnHandler);
  hideTheDialogWindow();
  destroySlidingWindow("Right");
  createWelcomeScreen("Right");
}

function tryAgainBtnHandler() {
  // Prevent goBackBtn from running wild. We should do the same for tryAgainBtn
  document.getElementById("goBackBtn").
  removeEventListener("click", goBackBtnHandler);
  setTimeout(()=>{
    document.getElementById("goBackBtn").addEventListener("click",
      goBackBtnHandler);
  }, computeAnimationDuration(document.querySelector(".slidingWindow")));

  hideTheDialogWindow();
  letsPlayBtnHandler();
}

window.onload = function() {
  // document.querySelector(".dialogWindow_hidden").style.setProperty("animation-duration", "0.001s");
  // document.querySelector(".dialogWindow_hidden").style.setProperty("animation-duration", "0.8s");
  window.initialNumberOfCards = 24;
  // window.numberOfCards = initialNumberOfCards;
  createWelcomeScreen("Left");
  document.getElementById("tryAgainBtn").addEventListener("click",
    tryAgainBtnHandler);
  // document.getElementById("goBackBtn").addEventListener("click",
  //   goBackBtnHandler);
  };