/*--------------------------------------------------------------
# Global variables
--------------------------------------------------------------*/

// Keep track of which quiz is currently active
var quizActive = [false, false, false];

// Keep track of the current questions
var currQuestion = [0, 0, 0];
var correctAnswer = [0, 0, 0];

// Keep track of the score
var score = [
  [0, 0],
  [0, 0],
  [0, 0]
];

// Wait for the page to load first
window.onload = function() {
  
  /*--------------------------------------------------------------
  # Quiz elements
  --------------------------------------------------------------*/
  
  // Navbar elements
  const homeLink = document.getElementById("home")
  const scoreText = [
    document.getElementById("score1"),
    document.getElementById("score2"),
    document.getElementById("score3")
  ];
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
  // Menu elements  
  const menuCard = document.getElementById("menu");
  const quizLink = [
    document.getElementById("link1"),
    document.getElementById("link2"),
    document.getElementById("link3")
  ];
  
  // Quiz elements  
  const quizCard = [
    document.getElementById("quiz1"),
    document.getElementById("quiz2"),
    document.getElementById("quiz3")
  ];
  
  // Question elements
  const questionText = [
    document.getElementById("question1"),
    document.getElementById("question2"),
    document.getElementById("question3")
  ];
  
  // Answer elements
  const answerText = [
    $('#answer1'),
    $('#answer2'),
    $('#answer3')
  ];
  
  // Submit elements
  const quizSubmit = [
    document.getElementById("submit1"),
    document.getElementById("submit2"),
    document.getElementById("submit3")
  ];
  
  // Alerts elements
  const alert = {
    correct: document.getElementById("correct"),
    incorrect: document.getElementById("incorrect"),
  };
  const alertText = {
    correct: document.getElementById("correct-text"),
    incorrect: document.getElementById("incorrect-text"),
  };
  const alertButtons = document.getElementsByClassName("alert-close");
  
  /*--------------------------------------------------------------
  # Quiz set-up
  --------------------------------------------------------------*/
  
  // Navbar set-up - Home button
  homeLink.onclick = function() { 
    hideAlerts();
    noQuizActive();
    updateVisible();
    return false;
  }
  
  // Navbar set-up - Score
  updateScore();  
  
  // Menu set-up
  for (var i=0; i<quizLink.length; i++) (function(i){ 
    quizLink[i].onclick = function() { 
      noQuizActive();
      quizActive[i] = true;
      updateVisible();
      return false;
    }
  })(i); 

  // Question set-up
  for (var i=0; i<questionText.length; i++) { 
    generateQuestion(i);
  }
  
  // Answer set-up
  for (var i=0; i<answerText.length; i++) (function(i){ 
    answerText[i].select2({
      placeholder: "Choose an answer",
      width: "100%",
      data: transformAnswer(answers[i]),
      "language": {
        "noResults": function(){
          return "No results found";
        }
      },
      escapeMarkup: function (markup) { return markup; }
    }).select2("val",0);
  })(i);
   
  // Submit set-up
  for (var i=0; i<quizSubmit.length; i++) (function(i){ 
    quizSubmit[i].onclick = function() {   
      
      // Hide all previous alerts
      hideAlerts();
      
      // Give feedback
      if (answerText[i].val() == correctAnswer[i]) {
        score[i][0] = score[i][0] + 1;
        var q = questions[i][currQuestion[i]][0];
        var a = answers[i][correctAnswer[i]];;
        alertText.correct.innerHTML = q + " = " + a;
        show(alert.correct);
      } else {
        var q = questions[i][currQuestion[i]][0];
        var a = answers[i][correctAnswer[i]];;
        alertText.incorrect.innerHTML = q + " = " + a;
        show(alert.incorrect);
      }      
      score[i][1] = score[i][1] + 1;
      updateScore();
      
      // Generate new question
      generateQuestion(i);
      
      return false;
    }
  })(i);
  
  // Alert set-up
  for (var i=0; i<alertButtons.length; i++) (function(i){ 
    alertButtons[i].onclick = function() { 
      hideAlerts();
    }
  })(i);
  
  /*--------------------------------------------------------------
  # Helper functions - Quiz logic
  --------------------------------------------------------------*/

  // Update the score
  function updateScore() {
    for (var i=0; i<scoreText.length; i++) { 
      scoreText[i].innerHTML = score[i][0] + " / " + score[i][1];
    }
  }
  
  // Hide all alerts
  function hideAlerts() {
    hide(alert.correct);
    hide(alert.incorrect);
  }
  
  // Generate new question for a given quiz
  function generateQuestion(i) {  
    var q = questions[i].length;
    var r = Math.floor((Math.random() * q));
    currQuestion[i] = r;
    correctAnswer[i] = questions[i][r][1]
    questionText[i].innerHTML = questions[i][r][0];
  }
  
  // Set all quizzes to not be visible
  function noQuizActive() {
    for (var i=0; i<quizActive.length; i++) {
      quizActive[i] = false;
    }
  }
  
  // Update the visibility of the menu and all quizzes
  function updateVisible() {
    
    // Show all quizzes that are active
    noneActive = true;
    for (var i=0; i<quizActive.length; i++) {
      if (quizActive[i]) {
        show(quizCard[i]);
        noneActive = false;
      } else {
        hide(quizCard[i]);
      }
    }
    
    // Show menu if no quizzes are active
    if (noneActive) {
      show(menuCard);    
    } else {
      hide(menuCard);
    }    
  }
  
}

/*--------------------------------------------------------------
# Helper functions - Data transformation
--------------------------------------------------------------*/

// Transform answer array to match syntax of dropdown
function transformAnswer(answer) {
  var newAnswer = [];
  for (var i=0; i<answer.length; i++) {
    newAnswer.push({id:i, text:answer[i]});
  }
  return newAnswer;
}

/*--------------------------------------------------------------
# Helper functions - Visibility
--------------------------------------------------------------*/

// Make DOM element visible
function show(elem) {
  elem.style.display = "block";
}

// Hide DOM element
function hide(elem) {
  elem.style.display = "none";
}

// Toggle visibility of DOM element
function toggle(elem) {
  if (elem.style.display === "none") {
    show(elem);
  } else {
    hide(elem);
  }
}