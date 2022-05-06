const API = "https://opentdb.com/api.php?amount=10&category=17&difficulty=hard&type=multiple";
const textContainer = document.getElementById("text-container");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
<<<<<<< HEAD
const textContainer = document.getElementById("text-container");
let questions = [];
=======
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const textCorrect = document.getElementById("text-correct");
const textWrong = document.getElementById("text-wrong")

>>>>>>> b7af66739a7b36dec328223c231a06f5e885eae3
const getApi = async () => {
  const response= await axios.get("../questions.json")
  questions = response.data.results; 
  console.log(questions)
}
getApi();

let currentQuestionIndex;


function setStatusClass(element, correct) {
  if (correct) {
    element.classList.remove("myButton");
    element.classList.add("correct");
  } else {
    element.classList.remove("myButton");
    element.classList.add("wrong");
  }
}
let correctAnswers = 0;

function correcta () {
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    if (correctAnswers == 3) {
        questionContainerElement.classList.add("hide")
        textCorrect.classList.remove("hide");
        startButton.innerText = "Restart";
        startButton.classList.remove("hide");
      } else {
        questionContainerElement.classList.add("hide")
        textCorrect.classList.add("hide")
        textWrong.classList.remove("hide")
        startButton.innerText = "Restart";
        startButton.classList.remove("hide");
      }
      correctAnswers = 0;

  }
}

function selectAnswer() {
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
    
  });

  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } 
  // } else if (correctAnswers == 3) {
  //   questionContainerElement.classList.add("hide")
  //   textCorrect.classList.remove("hide");
  //   startButton.innerText = "Restart";
  //   startButton.classList.remove("hide");
  // } else {
  //   questionContainerElement.classList.add("hide")
  //   textCorrect.classList.add("hide")
  //   textWrong.classList.remove("hide")
  //   startButton.innerText = "Restart";
  //   startButton.classList.remove("hide");
  // }
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("myButton");
    if (answer.correct) {
      button.dataset.correct = true;
    }
    button.addEventListener("click", ()=>{
      selectAnswer()
      if(button.dataset.correct) {
        console.log(correctAnswers)
        correctAnswers++
        console.log(correctAnswers) 

  correcta()
      }
    } );
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  nextButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
  

}

function setNextQuestion() {
  
  resetState();
  showQuestion(questions[currentQuestionIndex]);
}

function startGame() {
  startButton.classList.add("hide");
  textContainer.classList.add("hide");
  textCorrect.classList.add("hide");
  textWrong.classList.add("hide");
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
}

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});