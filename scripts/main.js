const textContainer = document.getElementById("text-container");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const textCorrect = document.getElementById("text-correct");
const textWrong = document.getElementById("text-wrong")
const startButton = document.getElementById("start-btn");
const ctx = document.getElementById('myChart');
//const laMierdaDeLaGráfica = getElementById('contenedor');
const audio = new Audio('./stonecutters-song.mp3');
let partida = 1;
let questions = [];
let correctAnswers = 0;
let currentQuestionIndex;
let myChart;
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


function correcta () {
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    if (correctAnswers !== 10) {    
      questionContainerElement.classList.add("hide")
      textCorrect.classList.add("hide")
      textWrong.classList.remove("hide")
      startButton.innerText = "Vuelve a intentarlo";
      startButton.classList.remove("hide");
      //ctx.classList.remove("hide");
      localStorage.setItem(partida, JSON.stringify(correctAnswers));
      const arrLocalStorageKeys = [];
      const arrLocalStorageValues = [];
      for (let i=0; i<localStorage.length; i++){
        let key = localStorage.key(i);
        let valor = localStorage.getItem(key);
        arrLocalStorageKeys.push(key);
        arrLocalStorageValues.push(valor);
      }
      console.log(arrLocalStorageKeys, arrLocalStorageValues);
      // const arrLocalStorageKeys = Object.keys({ ...localStorage });
      // const arrLocalStorageValues = Object.values({ ...localStorage });
      //console.log(arrLocalStorageKeys,  arrLocalStorageValues);
      // if (myChart){
      //   myChart.destroy()
      // }
      myChart = new Chart("myChart", {
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
                    stepSize: 1,
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
       
      });
    } else {
        audio.play();
        questionContainerElement.classList.add("hide")
        textCorrect.classList.remove("hide");
        startButton.innerText = "Vuelve a intentarlo";
        startButton.classList.remove("hide");
        //ctx.classList.remove("hide");
        localStorage.setItem(partida, correctAnswers);
        const arrLocalStorageKeys = Object.keys({ ...localStorage });
        const arrLocalStorageValues = Object.values({ ...localStorage });
        console.log(arrLocalStorageKeys , arrLocalStorageValues);
        // new Chart(ctx, {
        //   type: 'bar',
        //   data: {
        //       labels: arrLocalStorageKeys,
        //       datasets: [{
        //           data: arrLocalStorageValues,
        //           backgroundColor: [
        //               'rgba(255, 99, 132, 0.2)',
        //               'rgba(54, 162, 235, 0.2)',
        //               'rgba(255, 206, 86, 0.2)',
        //               'rgba(75, 192, 192, 0.2)',
        //               'rgba(153, 102, 255, 0.2)',
        //               'rgba(255, 159, 64, 0.2)'
        //           ],
        //           borderColor: [
        //               'rgba(255, 99, 132, 1)',
        //               'rgba(54, 162, 235, 1)',
        //               'rgba(255, 206, 86, 1)',
        //               'rgba(75, 192, 192, 1)',
        //               'rgba(153, 102, 255, 1)',
        //               'rgba(255, 159, 64, 1)'
        //           ],
        //           borderWidth: 1
        //       }]
        //   },
        //   options: {
        //       scales: {
        //           y: {
        //               beginAtZero: true
        //           }
        //       }
        //   }
        // });
        //addData(myChart,arrLocalStorageKeys, arrLocalStorageValues);
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
    button.addEventListener("click", ()=>{
      selectAnswer()
      if(button.dataset.correct) {
        correctAnswers++
      }
      correcta()
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
  //ctx.classList.add("hide");
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

// GRÁFICA
// const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];

//   const data = {
//     labels: labels,
//     datasets: [{
//       label: 'Mi primera gráfica',
//       backgroundColor: 'rgb(255, 99, 132)',
//       borderColor: 'rgb(255, 99, 132)',
//       data: [0, 10, 5, 2, 20, 30, 45],
//     }]
//   };

//   const config = {
//     type: 'bar',
//     data: data,
//     options: {}
//   };

// const myChart = new Chart('myChart', config);

// IMÁGENES RÁNDOM para cada pregunta
// Dejo esto comentado hasta que vuelva a funcionar la página porque no sé dónde ponerlo

// const imgs = ['./assets/Number_1', './assets/Number_2', './assets/Number_5', './assets/Number_12', './assets/Number_14', './assets/Number_21', './assets/Number_22', './assets/Number_29', './assets/Number_36', './assets/Number_50', './assets/Number_51', './assets/Number_59', './assets/Number_66', './assets/Number_67', './assets/Number_79', './assets/Number_85', './assets/Number_111', './assets/Number_314', './assets/Number_600', './assets/Number_908']

// for (let imagen of imgs){
//     button.addEventListener('click', changeImg);
//     function changeImg (){
//         imagen.setAttribute('src', getRandom(imgs))
//     }
// }