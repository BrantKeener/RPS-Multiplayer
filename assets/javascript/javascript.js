
// JS Table of Contents:
// Firebase Initialization
// 1-Click listener
// 1-write chat into the database
// 2-control chat window opening and closing
    // chatbox has a form with submit
// 3-delete the most distant chat of 10. This stores 10 chats form each player
// 4-decrease line opacity as the chat log gets farther back
// 5-Each player has their 'character displayed on the left
// 6-The left display will have the choices
// 7-The right display will obfuscate the other player's choices
// 8-Choices are stored in a closure client side
// 9-Signal is sent form both sides when choices are made
// 10-When both sides send the 'chosen' signal, each closure is released, and they are evaluated
// 11-Winner is determined
// 12-Win/loss is updated on both sides
// 13-Reset so that a new round can be played
// 14-Login that allows players to input their name
// 15-Name is used for chat, and displayed above corresponding character on both sides
// 16-Logout that disconnects session, and displays winner
// 17-Winner is displayed after 10 rounds
// Animated fanfare upon winning

let chatNumber = 0;



// Initialize Firebase
var config = {
  apiKey: "AIzaSyC88VWTxZ8bT_lApnGOVR-Rr2zuNSY-qss",
  authDomain: "bootcamp-a18e5.firebaseapp.com",
  databaseURL: "https://bootcamp-a18e5.firebaseio.com",
  projectId: "bootcamp-a18e5",
  storageBucket: "bootcamp-a18e5.appspot.com",
  messagingSenderId: "995593097318"
};
firebase.initializeApp(config);

let database = firebase.database();

document.addEventListener('click', function(e) {
  e.preventDefault();
  let grabClass = '';
  let grabId = '';
  grabClass = e.target.className;
  grabId = e.target.id;
  if(grabId === 'chat_send_button') {
    chatLogger();
  };
});

function chatLogger() {
  database.ref('chat/' + chatNumber).set({
    chatNumber: document.getElementsByName('chat_input').text,
  });
};