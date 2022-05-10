const textContainer = document.getElementById("text-container");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const textCorrect = document.getElementById("text-correct");
const textWrong = document.getElementById("text-wrong")
const startButton = document.getElementById("start-btn");
const audio = new Audio('./stonecutters-song.mp3');
const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2')

let partida = 1;
let questions = [];
let correctAnswers = 0;
let currentQuestionIndex;
let myChart;
let myChart2;
let chartOptions;

const getApi = async () => {
  const response = await axios.get("../questions.json")
  questions = response.data.results;
}
getApi();

function setStatusClass(element, correct) {
  if (correct) {
    element.classList.remove("myButton");
    element.classList.add("correct");
  } else {
    element.classList.remove("myButton");
    element.classList.add("wrong");
  }
}

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
}

function showGraph(arrLocalStorageKeys, arrLocalStorageValues) {
  if (myChart || myChart2) {
    myChart.destroy()
    myChart2.destroy()
  }

  chartOptions = {
    type: 'bar',
    data: {
      labels: arrLocalStorageKeys,
      datasets: [{
        label: "",
        data: arrLocalStorageValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              display: true,
              stepSize: 2,
              min: 0,
              max: 10,
            },
          },
        ],
      },
      legend: {
        display: false
      }
    }
  }
}

function correcta() {
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    if (correctAnswers !== 10) {
      questionContainerElement.classList.add("hide");
      textCorrect.classList.add("hide");
      textWrong.classList.remove("hide");
      startButton.innerText = "Vuelve a intentarlo";
      startButton.classList.remove("hide");
      localStorage.setItem(partida, JSON.stringify(correctAnswers));

      let partidas = []
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let valor = localStorage.getItem(key);
        let resultado = {
          numeroPartida: key,
          resultadoPartida: valor
        }
        partidas.push(resultado)
      }

      let partidasOrdenadas = partidas.sort((a, b) => a.numeroPartida - b.numeroPartida)
      let arrLocalStorageKeys = partidasOrdenadas.map(partida => partida.numeroPartida)
      let arrLocalStorageValues = partidasOrdenadas.map(partida => partida.resultadoPartida)
      showGraph(arrLocalStorageKeys, arrLocalStorageValues)
      myChart = new Chart("myChart", chartOptions);
      myChart2 = new Chart("myChart2", chartOptions);

    } else {
      audio.play();
      questionContainerElement.classList.add("hide")
      textCorrect.classList.remove("hide");
      startButton.innerText = "Vuelve a intentarlo";
      startButton.classList.remove("hide");
      localStorage.setItem(partida, JSON.stringify(correctAnswers));

      let partidas = []
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let valor = localStorage.getItem(key);
        let resultado = {
          numeroPartida: key,
          resultadoPartida: valor
        }
        partidas.push(resultado)
      }

      let partidasOrdenadas = partidas.sort((a, b) => a.numeroPartida - b.numeroPartida)
      let arrLocalStorageKeys = partidasOrdenadas.map(partida => partida.numeroPartida)
      let arrLocalStorageValues = partidasOrdenadas.map(partida => partida.resultadoPartida)
      showGraph(arrLocalStorageKeys, arrLocalStorageValues)
      myChart = new Chart("myChart", chartOptions);
      myChart2 = new Chart("myChart2", chartOptions);
    }

    correctAnswers = 0;
    partida++;
  }
}

function selectAnswer() {
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  })
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

    button.addEventListener("click", () => {
      selectAnswer()
      if (button.dataset.correct) {
        correctAnswers++
      }
      correcta()
    });

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
  audio.pause();
  audio.currentTime = 0;
  setNextQuestion();
}

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});