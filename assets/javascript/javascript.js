
// JS Table of Contents:
// Initialize Firebase
// Program Reset
// Event listener for clicking
// Form validation
// A chat logging function storing inputs to database, and clearing after 10 chats
// Login modal open and close

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
let userName = 'test';


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

// Program Reset

function resetingGame() {
  database.ref('chat/').remove();
  chatNumber = 0;
};

// Event listener for clicking
$(document).click(function(e) {
  e.preventDefault();
  let grabClass = '';
  let grabId = '';
  grabClass = e.target.className;
  grabId = e.target.id;
  if(grabId === 'chat_button') {
    chatFormValidation();
  };
  if(grabId === 'user_button') {
    loginFormValidation();
  }
});

// Validate the input before logging to chat
function chatFormValidation() {
  let chatCheck = document.forms['chat_box']['chat_input'].value;
  if(chatCheck === '') {
    console.log('You must type something');
  } else {
    chatLogger();
  };
};

// Validate login information before writing to variable

function loginFormValidation() {
  let loginCheck = document.forms['username']['user_input'].value;
  if(loginCheck === '') {
    console.log('Please enter a valid username');
  } else {
    userName = loginCheck;
    loginModalClose();
  }
};

// A chat logging function storing inputs to database, and clearing after 10 chats
function chatLogger() {
  let chat = document.forms['chat_box']['chat_input'];
  database.ref('chat/').push({
    UserName: userName,
    chat: chat.value,
    time: firebase.database.ServerValue.TIMESTAMP,
  });
  chatNumber += 1;
  chat.value = '';
};

// Messages posted to chat log
database.ref('chat/').on('child_added', function(snapshot) {
  console.log(userName);
  let lastAdded = snapshot.val();
  let chatPara = $('<p>').text(`${lastAdded.UserName} : ${lastAdded.chat}`);
  $('#chat_log').append(chatPara);
  if(chatNumber > 5) {
    chatLogClear();
  };
});

// Delete oldest message after 5


// Login modal
function loginModalDisplay() {
  $('#login_modal').css('visibility', 'visible');
};

function loginModalClose() {
  $('#login_modal').css('visibility', 'hidden');
};




resetingGame();
loginModalDisplay();