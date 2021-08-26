const readlineSync = require('readline-sync')

//chalk package for styling terminal text
const chalk = require('chalk')
//For localStorage functionality in node.js using text file
const {LocalStorage} = require('node-localstorage')
//Styling for terminal text by chalk
const error = chalk.bold.red;
const success = chalk.keyword('green');
const title = chalk.keyword('teal').bold;
const score_title = chalk.keyword('yellow').bold;
const log = console.log
const localStorage = new LocalStorage('./quiz_app_2')
var highScoreItem = localStorage.getItem("highScores")
let score = 0;

// data of high score
let highScores = [];

let userName = ""

//If the highScores.txt file is not created or has empty data
if(highScoreItem===null || highScoreItem==="")
{
  localStorage.setItem("highScores",highScores)
}
else{
highScores = JSON.parse(highScoreItem)
}

//Method to get your current highest score
const getYourHighScore = (userName) => {
 highScoreItem = localStorage.getItem("highScores")
 if(highScoreItem==="")
 return undefined
 let _highScore = JSON.parse(highScoreItem)
 if(_highScore.find((_score)=>_score.userName===userName))
 {
 return JSON.parse(highScoreItem).filter((_score)=>_score.userName===userName)[0].score
 }
 else{
   return undefined;
 }
}
//Function to get the top scorer with score and username.
const getHighestScore = () => {
highScoreItem = localStorage.getItem("highScores")

return JSON.parse(highScoreItem).reduce((a,b)=>a.score>b.score?a:b); 
}

//To update the highest score for a particular user.
const updateHighScore = (userName)=>{
highScoreItem = localStorage.getItem("highScores")

if(getYourHighScore(userName)===undefined)
  {
  localStorage.setItem("highScores",JSON.stringify([...highScores,{userName,score}]))
  }
  else{
     const newHighScores = JSON.parse(localStorage.getItem("highScores")).filter((_score)=>_score.userName!==userName)
     localStorage.setItem("highScores",JSON.stringify([...newHighScores,{userName,score}]))
  }
  }

//Function to suffle the answers array
const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// array of objects
var questions = [{
  question: "What year was the first Iron Man movie released, kicking off the Marvel Cinematic Universe ?",
  wrongAnswers:["2005","2007","2012"],
  correctAnswer: "2008"
}, {
  question: "Which Avenger does Thor team up with in Thor: Ragnarok ?",
  wrongAnswers:["HawkEye","Loki","Captain America"],
  correctAnswer: "Hulk"
},
{
  question: "In which fictional country is Black Panther set ? ",
  wrongAnswers:["Latveria","Freedonia","Genosha"],
  correctAnswer: "Wakanda"
},
{
  question: "In which film did Black Widow first appear ?",
  wrongAnswers:["The Incredible Hulk","The Avenger Assemble","Captain America"],
  correctAnswer: "Iron Man 2"
},
{
  question: "What is the Falcon’s real name?",
  wrongAnswers:["Elijah Bradley","Alexander Pierce","Scott Lang"],
  correctAnswer: "Sam Wilson"
}];


function welcome() {
 log(title("What is your name ?"))
 userName = readlineSync.question();

  log(`
Welcome ${title(userName)}
to
How well do you know the Marvel movies?
  `);
}



function play(question, wrongAnswers,correctAnswer) {
  log(title(question))
  const _questions = [...wrongAnswers,correctAnswer]
  var userAnswer = readlineSync.keyInSelect(shuffle(_questions));
log(userAnswer)
  if (_questions[userAnswer].toLowerCase() === correctAnswer.toLowerCase()) { 
    log(success("\nYou are correct!"));
    score = score + 1;
    
  } else {
    log(error("\nYou are wrong!"));
    log(success("\nCorrect answer is "),score_title(correctAnswer));
   
  }

  log(title("Current Score: "), score_title(score));
  log(title("-------------\n"))
}

function game() {
  for (var i=0; i<questions.length; i++) {
    var currentQuestion = questions[i];
    play(currentQuestion.question,
    currentQuestion.wrongAnswers,
    currentQuestion.correctAnswer)
  }
}



function showScores() {

  if(getYourHighScore(userName)===undefined)
  {
    updateHighScore(userName)
  }
  if(score>getYourHighScore(userName))
  {
    updateHighScore(userName)
  }
  log(title(`Your Final Score is ${score}`))
  log(title(`Your Highest Score is ${getYourHighScore(userName)}`))
  const overallHighestScore = getHighestScore()
  log(title("Overall Highest Score is "),overallHighestScore.score," by ",success(overallHighestScore.userName))

  
}


welcome();
game();
showScores();