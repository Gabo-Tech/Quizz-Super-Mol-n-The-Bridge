const textContainer = document.getElementById("text-container");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const textCorrect = document.getElementById("text-correct");
const textWrong = document.getElementById("text-wrong")

let questions = [];
const getApi = async () => {
  const response = await axios.get("../questions.json")
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
    if (correctAnswers == 10) {
        questionContainerElement.classList.add("hide")
        textCorrect.classList.remove("hide");
        startButton.innerText = "Vuelve a intentarlo";
        startButton.classList.remove("hide");
      } else {
        questionContainerElement.classList.add("hide")
        textCorrect.classList.add("hide")
        textWrong.classList.remove("hide")
        startButton.innerText = "Vuelve a intentarlo";
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

// IMÁGENES RÁNDOM para cada pregunta
// Dejo esto comentado hasta que vuelva a funcionar la página porque no sé dónde ponerlo

const imgs = ['./assets/Number_1', './assets/Number_2', './assets/Number_5', './assets/Number_12', './assets/Number_14', './assets/Number_21', './assets/Number_22', './assets/Number_29', './assets/Number_36', './assets/Number_50', './assets/Number_51', './assets/Number_59', './assets/Number_66', './assets/Number_67', './assets/Number_79', './assets/Number_85', './assets/Number_111', './assets/Number_314', './assets/Number_600', './assets/Number_908']

for (let imagen of imgs){
    button.addEventListener('click', changeImg);
    function changeImg (){
        imagen.setAttribute('src', getRandom(imgs))
    }
}