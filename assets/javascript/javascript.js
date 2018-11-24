
// JS Table of Contents:
// Initialize Firebase
// Program Reset
// Event listener for clicking
// Form validation
// A chat logging function storing inputs to database, and clearing after 10 chats
// Posts chats to html
// Login modal open and close
// Player number assign
// RPS choices are stored in a closure client side!!!Not yet working!
// Monitor how many players are in a session, and use this information to decide how to clear stored players.
// When the client's connection state changes...






// 2-control chat window opening and closing
    // chatbox has a form with submit
// 3-delete the most distant chat of 10. This stores 10 chats form each player
// 4-decrease line opacity as the chat log gets farther back
// 7-The right display will obfuscate the other player's choices
// 17-Winner is displayed after 10 rounds
// Animated fanfare upon winning
// Ready button for round complete

let chatNumber = 0;
let userName = '';
let opponentName = '';
let playerNumber = false;
let playerChoice = '';
let playerChoiceDB = '';
let opponentChoiceDB = '';
let winCount = 0;
let tieCount = 0;
let lossCount = 0;
let roundCount = 1;
let loginplayer2 = false;
let loginAlerts = {
  noname: 'Please enter a username to login',
  duplicate: 'That username is already in use. Try a different username',
}

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

// Firebase variables
let database = firebase.database();
let connectedRef = database.ref('.info/connected');
let connectionsRef = database.ref('RPSMP/connections');

connectedRef.on("value", function(snapshot) {
  if (snapshot.val()) {
    let userCon = connectionsRef.push(true);
    userCon.onDisconnect().remove();
  };
});

// Change login modal based on number of players
connectionsRef.on('value', function(snapshot) {
  let necessaryPlayers = 2 - snapshot.numChildren();
  let enough = $('#online_counterhead').data('enough');
  if(necessaryPlayers <= 0) {
    $('#online_counterhead').text(enough);
    newGameReset();
    setTimeout(loginLoad, 1500);
  };
});

// Newgame Reset
function newGameReset() {
  database.ref().update({
    choicemade: false,
  });
  database.ref('RPSMP').child('chosen/').remove();
  database.ref('RPSMP').child('chat/').remove();
  database.ref('RPSMP').child('player/').remove();
  chatNumber = 0;
  userName = '';
  opponentName = '';
  playerNumber = false;
  playerChoice = '';
  playerChoiceDB = '';
  opponentChoiceDB = '';
  winCount = 0;
  tieCount = 0;
  lossCount = 0;
  roundCount = 1;
};

// Midgame Reset
function midGameReset() {
  database.ref().update({
    choicemade: false,
  });
  database.ref('RPSMP').child('chosen/').remove();
  playerChoice = '';
  playerChoiceDB = '';
  opponentChoiceDB = '';
  $('#username_chosen_status').text(userName);
  $('#opponent_username_chosen_status').text(opponentName);
  $('#player_choice_area').css('overflow-y', 'scroll');
  $('#player_choice_area').scrollTop(0);
  $('#opponent_image').attr('src', 'assets/images/RPS.jpg');
};

// Allow players to login
function loginLoad() {
  let login = $('#online_counterhead').data('login');
  $('#online_counterhead').text(login);
  $('#user_form').css('visibility', 'visible');
  $('#logged_players').css('visibility', 'visible');
};

// Event listener for clicking
$(document).click(function(e) {
  e.preventDefault();
  let grabClass = '';
  let grabId = '';
  grabClass = e.target.className;
  grabId = e.target.id;
  switch(grabId) {
    case 'chat_button':
      chatFormValidation();
      break;
    case 'user_button':
      loginFormValidation()
      break;
    case 'rock':
      $('#player_choice_area').css('overflow', 'hidden');
      playerChoice = 'rock';
      choiceMadeChecker();
      break;
    case 'paper':
      $('#player_choice_area').css('overflow', 'hidden');
      playerChoice = 'paper';
      choiceMadeChecker();
      break;
    case 'scissor':
      $('#player_choice_area').css('overflow', 'hidden');
      playerChoice = 'scissor';
      choiceMadeChecker();
      break;
    };
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
  let loginCheck = document.forms['user_form']['user_input'].value;
  let loginAlert = $('#no_or_duplicate_login_alert');
  if(loginCheck === '') {
    loginAlert.text(loginAlerts.noname);
    loginAlert.css('visibility', 'visible');
  } else if(loginCheck === `${opponentName}`) {
    loginAlert.text(loginAlerts.duplicate);
    loginAlert.css('visibility', 'visible');
  } else {
    userName = loginCheck;
    playerNumberAssign();
    $('#user_form').remove();
    loginAlert.remove();
  };
};

// Posts username within player area
function userNamePost() {
  $('#username_chosen_status').text(userName);
};

// Posts opponents name within opponent area
database.ref('RPSMP/player/').on('child_added', function(snapshot) {
  database.ref('RPSMP/player/').once('value', function(snapshot) {
    console.log(snapshot.val().playernumber1);
    if(snapshot.val().playernumber1 !== userName) {
      $('#opponent_username_chosen_status').text(snapshot.val().playernumber1);
      opponentName = snapshot.val().playernumber1;
    } else if(snapshot.val().playernumber2 !== userName) {
      $('#opponent_username_chosen_status').text(snapshot.val().playernumber2);
      opponentName = snapshot.val().playernumber2;
    };
  });
});

// A chat logging function storing inputs to database, and clearing after 10 chats
function chatLogger() {
  let chat = document.forms['chat_box']['chat_input'];
  database.ref('RPSMP/chat/').push({
    username: userName,
    chat: chat.value,
    time: firebase.database.ServerValue.TIMESTAMP,
  });
  chatNumber += 1;
  chat.value = '';
};

// Messages posted to chat log
database.ref('RPSMP/chat/').on('child_added', function(snapshot) {
  let lastAdded = snapshot.val();
  let chatPara = $('<p>').text(`${lastAdded.username} : ${lastAdded.chat}`);
  $('#chat_log').append(chatPara);
  if(chatNumber > 5) {
    chatLogClear();
  };
});

// Login modal open and close
function loginModalDisplay() {
  $('#login_modal').css('visibility', 'visible');
};

function loginModalClose() {
  $('#login_modal').css('visibility', 'hidden');
  $('#logged_players').css('visibility', 'hidden');
};

// Player number assign
function playerNumberAssign() {
  database.ref('RPSMP/player/').once('value').then(function(snapshot) {
    if(snapshot.hasChild('playernumber1') === false) {
      playerNumber = 1;
      userNamePost();
      database.ref('RPSMP/player/').update({
        playernumber1: userName,
      });
    } else if(snapshot.hasChild('playernumber2') === false) {
      playerNumber = 2;
      userNamePost();
      database.ref('RPSMP/player/').update({
        playernumber2: userName,
      });
    } else {
      alert('There are too many players in this session');
    };
  });
};

// Logged players identifier
database.ref('RPSMP/player/').on('child_added', function(snapshot) {
  let playerWaiting = 'Player not Ready';
  let playerBase = database.ref('RPSMP/player/');
  if((playerNumber === 1 && $('#player1').text() === playerWaiting) || playerNumber === false) {
    playerBase.once('value', function(snapshot) {
      $('#player1').text(snapshot.val().playernumber1);
      $('#player1').removeClass();
    });
  } else {
    playerBase.once('value', function(snapshot) {
      $('#player2').text(snapshot.val().playernumber2);
      $('#player2').removeClass();
    });
    playerBase.update({
      loginplayer2: true,
    });
  };
  playerBase.once('value', function(snapshot) {
    loginPlayer2 = snapshot.val().loginplayer2;
  });
  if(loginPlayer2 === true) {
    loginModalClose();
  };
});



// Send a signal to the DB that a player has chosen
function choiceMadeChecker() {
  database.ref().once('value').then(function(snapshot) {
    if(snapshot.val().choicemade == false) {
      choiceMadeTrueifier();
      database.ref('RPSMP/chosen/').update({
        firstchoiceplayer: `${userName}`,
      });
    } else {
      database.ref('RPSMP/chosen/').update({
        secondchoiceplayer: `${userName}`,
      });
    };
  });
};

// Makes the choicemade key in the database true
function choiceMadeTrueifier() {
  database.ref().update({
    choicemade: true,
  });
};

// Update the DOM to indicate that either you have chosen, or your opponent has
database.ref('RPSMP/chosen').on('child_added', function() {
  database.ref('RPSMP/chosen/firstchoiceplayer').once('value', function(snapshot) {
    if(snapshot.val() === `${userName}`) {
      $('#username_chosen_status').text("You've chosen!")
    } else if(snapshot.val() ===`${opponentName}`){
      $('#opponent_username_chosen_status').text(`${opponentName} has chosen!`);
    };
  });
  database.ref('RPSMP/chosen/secondchoiceplayer').once('value', function(snapshot) {
    if(snapshot.val() === `${userName}`) {
      $('#username_chosen_status').text("You've chosen!");
    } else if(snapshot.val() === `${opponentName}`) {
      $('#opponent_username_chosen_status').text(`${opponentName} has chosen!`);
    };
  });
});

// This will handle the situation when both players have chosen. It sends the data to the DB so that both parties now have access
database.ref('RPSMP/chosen/').on('child_added', function(snapshot) {
  if(snapshot.key === 'secondchoiceplayer') {
    database.ref('RPSMP/chosen/').update({
      [userName]: playerChoice, 
    });
  };
  database.ref(`RPSMP/chosen/${userName}`).once('value', function(snapshot) {
    playerChoiceDB = snapshot.val();
  });
  database.ref(`RPSMP/chosen/${opponentName}`).once('value', function(snapshot) {
    opponentChoiceDB = snapshot.val();
  });
  if(playerChoiceDB !== null && opponentChoiceDB !== null) {
    choiceCompare();
  }
});

// Here we will compare both player's choices, and evaluate the outcome
function choiceCompare() {
  if(playerChoiceDB === 'rock') {
    switch (opponentChoiceDB) {
      case 'rock':
      tieAdder();
      opponentChoiceDisplay('rock');
      break;
      case 'paper':
      lossAdder();
      opponentChoiceDisplay('paper');
      break;
      case 'scissor':
      winAdder();
      opponentChoiceDisplay('scissor');
      break;
    };
  };
  if(playerChoiceDB === 'paper') {
    switch (opponentChoiceDB) {
      case 'rock':
      winAdder();
      opponentChoiceDisplay('rock');
      break;
      case 'paper':
      tieAdder();
      opponentChoiceDisplay('paper');
      break;
      case 'scissor':
      lossAdder();
      opponentChoiceDisplay('scissor');
      break;
    };
  };
  if(playerChoiceDB === 'scissor') {
    switch (opponentChoiceDB) {
      case 'rock':
      lossAdder();
      opponentChoiceDisplay('rock');
      break;
      case 'paper':
      winAdder();
      opponentChoiceDisplay('paper');
      break;
      case 'scissor':
      tieAdder();
      opponentChoiceDisplay('scissor');
      break;
    };
  };
};

// Three functions to handle win, loss, and tie
function winAdder() {
  ++winCount;
  ++roundCount;
  winDisplay();
};

function lossAdder() {
  ++lossCount;
  ++roundCount;
  lossDisplay();
};

function tieAdder() {
  ++tieCount;
  ++roundCount;
  tieDisplay();
};

// Change opponent's avatar based on their choice

function opponentChoiceDisplay(opponentchoice) {
  let oppimage = $('#opponent_image');
  let rock = oppimage.data('rock');
  let paper = oppimage.data('paper');
  let scissor = oppimage.data('scissor');
  switch(opponentchoice) {
    case 'rock':
    oppimage.attr('src', rock);
    break;
    case 'paper':
    oppimage.attr('src', paper);
    break;
    case 'scissor':
    oppimage.attr('src', scissor);
    break;
  };
};

// Update the win/loss/tie displays
function winDisplay() {
  $('#wins').text(`Wins: ${winCount}`);
  $('#round').text(`Round: ${roundCount}`);
  setTimeout(midGameReset, 1000);
  howManyRounds();
};

function lossDisplay() {
  $('#losses').text(`Losses: ${lossCount}`);
  $('#round').text(`Round: ${roundCount}`);
  setTimeout(midGameReset, 1000);
  howManyRounds();
};

function tieDisplay() {
  $('#ties').text(`Ties: ${tieCount}`);
  $('#round').text(`Round: ${roundCount}`);
  setTimeout(midGameReset, 1000);
  howManyRounds();
};

// 10 round completion 
function howManyRounds() {
  if(roundCount === 3) {
    gameComplete();
  };
};

function gameComplete() {
  let gc = $('#online_counterhead').data('game_complete');
  $('#online_counterhead').text(gc);
  $('#login_modal').css('visibility', 'visible');
};

winDisplay();
tieDisplay();
lossDisplay();
loginModalDisplay();