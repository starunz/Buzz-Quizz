const Url = 'https://mock-api.driven.com.br/api/v4/buzzquizz'; //essa parte da url é sempre a mesma o que muda é a rota.
const Container = document.querySelector('.container'); //para facilitar a vida, a gente pode usar 1 unica main para todas telas
//já que vamos criar dinâmicamente, economiza css, html e tempo de ficar procurando :v mas cuidado nos fechamentos das divs :v


// ------ tela 03 ------ 

let quizzInfo = {} // guardar as informações que eu preciso em um objeto para validar os campos
function basicQuizzInformation() {
    quizzInfo = {
        title: '',
        image: '',
        numberQuestions: 0,
        numberLevels: 0,
        questions: []
    }

    Container.innerHTML = `
    <div class="create-quiz">
        <div class="title">Comece pelo começo</div>
        <div class="creating">
            <input type="text" class="title-quizz" placeholder="Título do seu quizz">
            <input type="text" class="url" placeholder="URL da imagem do seu quizz">
            <input type="number" class="number-questions" placeholder="Quantidade de perguntas do quizz">
            <input type="number" class="number-levels" placeholder="Quantidade de níveis do quizz">
        </div>
        <button class="next" onclick="createQuizzQuestions()">Prosseguir pra criar perguntas</button>
    </div>
    `
}

function saveValuesBasicQuizzInformation() {
    const title = document.querySelector(".title-quizz").value;
    const image = document.querySelector(".url").value;
    const numberQuestions = document.querySelector(".number-questions").value;
    const numberLevels = document.querySelector(".number-levels").value;

    quizzInfo.title = title;
    quizzInfo.image = image;
    quizzInfo.numberQuestions = parseInt(numberQuestions);
    quizzInfo.numberLevels = parseInt(numberLevels);
}

function validateOfBasicQuizzInfo() {
    // aqui ficará as validações 
    // antes disso preciso salvar o valor dos inputs

    saveValuesBasicQuizzInformation();

    if (quizzInfo.title.length < 20 || quizzInfo.title.length > 65) {

        return false;
    } else if (!checkUrl(quizzInfo.image)) {
        return false;
    } else if (quizzInfo.numberQuestions < 3) {
        return false;
    } else if (quizzInfo.numberLevels < 2) {
        return false;
    }
    return true;
}

function createQuizzQuestions() {
    const validate = validateOfBasicQuizzInfo();
    if (!validate) {
      alert('Preencha os campos corretamente para prosseguir, por favor 🙂');
      return;
    }
    
    let questions = ''; 
    for(let i = 0 ; i < quizzInfo.numberQuestions; i++){
        questions += createCardQuizzQuestions(i);
    }

    Container.innerHTML = `
    <div class="create-quiz">
        <div class="title">Crie suas perguntas</div>
        ${questions}
        <button class="next" onclick="createQuizzLevels()">Prosseguir para criar níveis</button>
    </div>
    `
}

function createCardQuizzQuestions(index) {

    let cardClass = ''; //assim as perguntas não começam abertas

    if (index === 0) {
      cardClass = 'expand'
    }//assim a primeira começa aberta 

    return `
        <div class="container-questions creating ${cardClass}">
            <div class="title-card-question">
                <div class="subtitle">Pergunta ${index + 1}</div>
                <div class="expand" onclick="expandCard(this)">
                    <ion-icon name="create-outline"></ion-icon>
                </div>
            </div>

            <div class="questions">
                <input type="text" class="answer-${index}-text" placeholder="Texto da pergunta" />
                <input type="text" class="answer-${index}-color" placeholder="Cor de fundo da pergunta" />

                <div class="subtitle">Resposta correta</div>

                <div class="answers">
                    <input type="text" class="answer-correct-${index}" placeholder="Resposta correta" />
                    <input type="text" class="answer-correct-url-${index}" placeholder="URL da imagem" />
                </div>

                <div class="subtitle">Respostas incorretas</div>

                <div class="answers answer-${index}-incorrect-0">
                    <input type="text" class="answer" placeholder="Resposta incorreta 1" />
                    <input type="text" class="url" placeholder="URL da imagem 1" />
                </div>

                <div class="answers answer-${index}-incorrect-1">
                    <input type="text" class="answer" placeholder="Resposta incorreta 2" />
                    <input type="text" class="url" placeholder="URL da imagem 2" />
                </div>

                <div class="answers answer-${index}-incorrect-2">
                    <input type="text" class="answer" placeholder="Resposta incorreta 3" />
                    <input type="text" class="url" placeholder="URL da imagem 3" />
                </div>
            </div>
        </div>
    `
}

function saveValuesCreateQuizzQuestions() {
    quizzInfo.questions = [];
  
    for (let i = 0; i < quizzInfo.numberQuestions; i++) {
      const question = {};
  
      question.title = document.querySelector(`.answer-${i}-text`).value;
      question.color = document.querySelector(`.answer-${i}-color`).value;
  
      question.answers = [];
  
      const correctAnswer = {
        text: document.querySelector(`.answer-correct-${i}`).value,
        image: document.querySelector(`.answer-correct-url-${i}`).value,
        isCorrectAnswer: true
      };
  
      question.answers.push(correctAnswer);
  
      for (let j = 0; j < 3; j++) {
        console.log(`.answer-${i}-incorrect-${j} .answer`)
        const incorrectAnswer = {
            text: document.querySelector(`.answer-${i}-incorrect-${j} .answer`).value,
            image: document.querySelector(`.answer-${i}-incorrect-${j} .url`).value,
            isCorrectAnswer: false
        };
    
        if (incorrectAnswer.text.length === 0) {
            continue;
        }
    
        question.answers.push(incorrectAnswer);
      }
  
      quizzInfo.questions.push(question);
    } console.log(quizzInfo.questions)
}

function validateOfCreateQuizzQuestions() {
    saveValuesCreateQuizzQuestions();
  
    for (let i = 0; i < quizzInfo.questions.length; i++) {
      const question = quizzInfo.questions[i];
  
      if (question.title.length < 20 || question.title.length === 0) {
        alert('preencha corretamente o titulo')
        return false;
      } else if (!checkColor(question.color) || question.color.length === 0) {
        alert('preencha corretamente a cor ')
        return false;
      }
  
      if (question.answers.length < 2) {
        alert('preencha corretamente pelo menos 1 resposta certa e outra errada')
        return false;
      }
  
      for (let j = 0; j < question.answers.length; j++) {
        const answer = question.answers[j];
  
        if (answer.text.length === 0) {
            alert('preencha corretamente o campo de texto')
          return false;
        } else if (!checkUrl(answer.image)) {
            alert('preencha corretamente a url')
          return false;
        }
      }
    }
  
    return true;
}

function createQuizzLevels() {
    const validate = validateOfCreateQuizzQuestions()

    if(!validate) {
        alert('preencha os campos corretamente');
        return;
    }
}
createQuizzLevels()





function expandCard (element) {
    const card = document.querySelector(".expand");
    card.classList.remove("expand");
    
    element.parentNode.parentNode.classList.add("expand");
}
  
function checkUrl (url) {
    const regexUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    return regexUrl.test(url);
}

function checkColor (color) {
    const regexColor = /^\#([0-9]|[A-F]|[a-f]){6}$/;
    return regexColor.test(color);
}

basicQuizzInformation();