const url = 'https://mock-api.driven.com.br/api/v4/buzzquizz';
const container = document.querySelector('.container');

function sucess(response) {
  const quizzes = response.data;
  const ulQuizzes = document.querySelector(".list-quizz-server");
  const ulUserQuizz = document.querySelector(".user-quizz");
  ulQuizzes.innerHTML = "";
  ulUserQuizz.innerHTML = "";

  const userQuizzStorage = catchQuizzesLocalStorage();
  for (let i = 0; i < quizzes.length; i++) {
    userQuizzStorage.forEach((userQuizz) => {
      if (quizzes[i].id === userQuizz.id) {
        ulUserQuizz.innerHTML += ` <li class="user-list"> 
            <div class="quizz-server" onclick="showScreenTwo(${quizzes[i].id})" >
            <strong class="quizz-title">${quizzes[i].title}</strong>
            <div class="quizz-question">
                <div class="layer">
                    <img class="img" src="${quizzes[i].image}" width="340" height="181">     
                </div>
            </div>
        </div>
            </li>`;
            showUserQuizz ()
      } else {
        ulQuizzes.innerHTML += ` 
            <li>
                <div class="quizz-server" onclick="showScreenTwo(${quizzes[i].id})" >
            
                    <strong class="quizz-title">${quizzes[i].title}</strong>
                    <div class="quizz-question">
                        <div class="layer">
                            <img class="img" src="${quizzes[i].image}" width="340" height="181">     
                        </div>
                    </div>
                </div>
            </li>`;
      } 
    });
  }
}

const promess = axios.get(`${url}/quizzes`);
promess.then(sucess);


function showScreenTwo(quizzId){
    const screenOne = document.querySelector(".tela-01");
    screenOne.classList.add("hide");

    callScreen2(quizzId)
}

function showUserQuizz (){
    const showUser = document.querySelector(".userStorage");
    const showUserHeader = document.querySelector(".quizzes");
    const removeNone = document.querySelector('.noneStorage');
    
    removeNone.classList.add('hide');
    showUser.classList.remove('hide');
    showUserHeader.classList.remove('hide');

}

// ------ tela 02 ------ 

let answersCorret = 0;
let dataQuiz;
let numberOfResponses = 0;
let data;
let scren2;

function callScreen2(idQuizz){
    const promise = axios.get(`${url}/quizzes/${idQuizz}`);
    promise.then(loadQuizz);
}


function loadQuizz(answer){
    data = answer;
    const quizzSelect = answer.data;
    dataQuiz = quizzSelect   
   // questionQuiz.innerHTML = `
    scren2 = `
    <div class="selectQuiz">
        <div class="titleQuizz">
            <img src= ${quizzSelect.image}>
            <div class=opacity>${quizzSelect.title}</div>
        </div>`;
    quizzSelect.questions.forEach(sortAnswer);
}


function sortAnswer(item){
    let answers = item.answers; //array com as respostas "cada resposta é um objeto"
    answers.sort(() => Math.random() - 0.5);
    let html= `
    <div class="questionQuiz">
        <div class="titleQuestion" style="background-color: ${item.color}">
            <span>${item.title}</span>
        </div>
        <div class="answers" >
        `;
    answers.forEach(loadAnswers)
    html+=`
        </div>
    </div>`
   // questionQuiz.innerHTML += html;
   scren2 +=html;
    function loadAnswers(answerOption){
        html += `
                <div class="answerOption">
                    <img src=${answerOption.image} onclick="selectAnswer(this,${answerOption.isCorrectAnswer})">
                    <span onclick="selectAnswer(this)">${answerOption.text}</span>
                </div>`;
    }
    container.innerHTML = scren2;
}


function selectAnswer(answer, isCorrectAnswer){
    const select = answer.parentNode;
    const parent = select.parentNode;
    const questionAtual = (parent.parentNode).parentNode;

    if(parent.children[1].style.opacity <="0.1"){
        numberOfResponses++;
        if(isCorrectAnswer == true){
             select.children[1].style.color =  '#009C22';
             answersCorret++;
        }else{
            select.children[1].style.color =  '#FF4B4B';
        }
        for(let i=0; i<parent.children.length;i++){
            if(parent.children[i]!==select){
                parent.children[i].style.opacity = "0.5"
            }
        }
        if((numberOfResponses+1) < questionAtual.children.length){
            setTimeout(() => { questionAtual.children[numberOfResponses+1].scrollIntoView();},2000);
        }else{
            endQuiz();
        }
    }
}

function calcPorcent(){
    let porcent = Math.ceil((answersCorret*100)/(dataQuiz.questions.length));
    for(let i=dataQuiz.levels.length-1;i=>0;i--){
        if(porcent >= dataQuiz.levels[i].minValue){
            return [dataQuiz.levels[i], porcent];
        }
    }                      
}

function endQuiz(){
    const questionQuiz = document.querySelector('.selectQuiz');
    const values = calcPorcent();
    const end = values[0];
    const porcent = values[1];
    const title= porcent + "% de acerto: "+ end.title;
    questionQuiz.innerHTML +=`
        <div class=endQuiz>
            <div class="titleEndQuiz" >
                <span>${title}</span>
            </div>
            <div class="feedback">
                <img src=${end.image}>
                <div class="text" >${end.text}</div>
            </div>
        </div>`
    const feedback = document.querySelector('.endQuiz');
    setTimeout(() => { feedback.scrollIntoView();},2000);
    setTimeout(() => { postQuizNavigation();},2000);
}
function postQuizNavigation(){
    const questionQuiz = document.querySelector('.selectQuiz');
    questionQuiz.innerHTML +=`
        <button class="restart" onclick="restart()">Reiniciar Quiz</button>
        <div class="home" onclick="home()">Voltar pra home</div>
    `
}
function restart(){
    answersCorret = 0;
    numberOfResponses = 0;
    const init = document.querySelector('.titleQuizz');
    init.scrollIntoView();
    loadQuizz(data);   
}
function home(){
    window.location.reload()
}

//-------fim tela 02----------
// ------ tela 03 ------------

let quizzInfo = {}
function basicQuizzInformation() {
    quizzInfo = {
        title: '',
        image: '',
        numberQuestions: 0,
        numberLevels: 0,
        questions: [],
        levels: []
    }

    container.innerHTML = `
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
    saveValuesBasicQuizzInformation();

    if (quizzInfo.title.length < 20 || quizzInfo.title.length > 65 || quizzInfo.title.length === 0) {
        alert('O título do quizz deve conter no mínimo 20 caracteres e no máximo 65 🙂');
        return false;
    } 
    else if (!checkUrl(quizzInfo.image)) {
        alert('Insira uma url válida 🙂');
        return false;
    } 
    else if (quizzInfo.numberQuestions < 3 || isNaN(quizzInfo.numberQuestions)) {
        alert('O quizz deve conter no mínimo 3 perguntas 🙂');
        return false;
    } 
    else if (quizzInfo.numberLevels < 2 || isNaN(quizzInfo.numberLevels)) {
        alert('O quizz deve conter no mínimo 2 níveis 🙂');
        return false;
    }

    return true;
}

function createQuizzQuestions() {
    const validate = validateOfBasicQuizzInfo();

    if (!validate) return;

    let questions = ''; 
    for(let i = 0 ; i < quizzInfo.numberQuestions; i++){
        questions += createCardQuizzQuestions(i);
    }

    container.innerHTML = `
    <div class="create-quiz">
        <div class="title">Crie suas perguntas</div>
        ${questions}
        <button class="next" onclick="createQuizzLevels()">Prosseguir para criar níveis</button>
    </div>
    `
}

function createCardQuizzQuestions(index) {
    let cardClass = '';

    if (index === 0) cardClass = 'expand';

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
        const incorrectAnswer = {
            text: document.querySelector(`.answer-${i}-incorrect-${j} .answer`).value,
            image: document.querySelector(`.answer-${i}-incorrect-${j} .url`).value,
            isCorrectAnswer: false
        };
    
        if (incorrectAnswer.text.length === 0 && incorrectAnswer.image.length === 0 ) {
            continue;
        }
    
        question.answers.push(incorrectAnswer);
      }
  
      quizzInfo.questions.push(question);
    } 
}

function validateOfCreateQuizzQuestions() {
    saveValuesCreateQuizzQuestions();
  
    for (let i = 0; i < quizzInfo.questions.length; i++) {
      const question = quizzInfo.questions[i];
  
      if (question.title.length < 20 || question.title.length === 0) {
        alert('O título deve ter no mínimo 20 caracteres 🙂');
        return false;
      } 
      else if (!checkColor(question.color) || question.color.length === 0) {
        alert('A cor deve ser no formato hexadecimal 🙂 (ex: #000000 para black, #FF0000 para red, #0000FF para blue');
        return false;
      }
  
      if (question.answers.length < 2) {
        alert('O quizz deve conter 1 resposta correta e pelo menos 1 resposta incorreta 🙂');
        return false;
      }
  
      for (let j = 0; j < question.answers.length; j++) {
        const answer = question.answers[j];

        if (answer.text.length === 0 && answer.image.length !== 0) {
            alert('Preencha os campos vazios, por favor 🙂');
          return false;
        } 
        else if (!checkUrl(answer.image)) {
            alert('Insira uma url válida 🙂');
          return false;
        }
      }
    }
  
    return true;
}

function createQuizzLevels() {
    const validate = validateOfCreateQuizzQuestions()

    if(!validate) return;

    let levels = '';

    for(let i = 0; i < quizzInfo.numberLevels; i++ ){
        levels += createCardQuizzLevels(i)

    }

    container.innerHTML = `
    <div class="create-quiz">
        <div class="title">Crie suas perguntas</div>
        ${levels}
        <button class="next" onclick="finishedQuizz()">Prosseguir para criar níveis</button>
    </div>
    `
}

function createCardQuizzLevels(index) {
    let cardClass = '';

    if (index === 0) cardClass = 'expand';

    return `
    <div class="container-level creating ${cardClass}">
        <div class="title-card-question">
            <div class="subtitle">Nível ${index + 1} </div>
            <div class="expand" onclick="expandCard(this)">
                <ion-icon name="create-outline"></ion-icon>
            </div>
        </div>
        <div class="questions">
            <input type="text" class="level-${index}-title" placeholder="Título do nível" />
            <input type="number" class="level-${index}-success" placeholder="% de acerto mínima" />
            <input type="text" class="level-${index}-url" placeholder="URL da imagem do nível" />
            <input type="text" class="level-${index}-description" placeholder="Descrição do nível" />
        </div>
    </div>
    `
}

function saveValuesCreateQuizzLevels(){
    quizzInfo.levels = [];

    for (let i = 0; i < quizzInfo.numberLevels; i++) {
        const level = {
          title: document.querySelector(`.level-${i}-title`).value,
          image: document.querySelector(`.level-${i}-url`).value,
          text: document.querySelector(`.level-${i}-description`).value,
          minValue: parseInt(document.querySelector(`.level-${i}-success`).value),
        };
    
        quizzInfo.levels.push(level);
    }
}

function validateOfCreateQuizzLevels(){
    saveValuesCreateQuizzLevels();
    let containZeroLevel = false;
  
    for (let i = 0; i < quizzInfo.levels.length; i++) {
      const level = quizzInfo.levels[i];
  
      if (level.minValue === 0) {
        containZeroLevel = true;
      }

      if (level.title.length < 10) {
        alert('O título deve ter pelo menos 10 caracteres 🙂');
        return false;
      }
      else if (level.minValue < 0 || level.minValue > 100 || isNaN(level.minValue)) {
        alert('A % de acerto mínima deve ser entre 0 e 100 🙂');
        return false;
      }
      else if (!checkUrl(level.image)) {
        alert('Insira uma url válida 🙂');
        return false;
      } 
      else if (level.text.length < 30) {
        alert('A descrição do nível deve ter no mínimo 30 caracteres 🙂');
        return false;
      }
    }

    if(!containZeroLevel) {
        alert('O quizz deve conter pelo menos um nível com % 0 🙂');
        return false; 
    }
  
    return containZeroLevel;
}

function finishedQuizz() {
    const validate = validateOfCreateQuizzLevels();
    if (!validate) return;

    postFinishedQuizz();
}

function postFinishedQuizz() {
    const info = {
        title: quizzInfo.title,
        image: quizzInfo.image,
        questions: quizzInfo.questions,
        levels: quizzInfo.levels
    };
    
    const promise = axios.post(`${url}/quizzes`, info);
    promise.then(saveQuizzLocalStorage);
}

function saveQuizzLocalStorage (response) {
    const quizz = response.data;
    const dataLocal = catchQuizzesLocalStorage();
  
    dataLocal.push({
      id: quizz.id,
      key: quizz.key
    });
  
    localStorage.setItem('quizz', JSON.stringify(dataLocal));
  
    createQuizzSuccess(quizz.id);
}

function catchQuizzesLocalStorage () {
    let data = localStorage.getItem('quizz');
  
    if(data !== null) {
      const objectData = JSON.parse(data);
      return objectData;
    } else {
      return [];
    }
}

function createQuizzSuccess (id) {
    container.innerHTML = `
    <div class="create-quiz">
        <div class="title">Seu quizz está pronto!</div>
        <div class="quizz" onclick="(${id})">
            <img src="${quizzInfo.image}">
            <div class="overlay"></div>
            <div class="title">${quizzInfo.title}</div>
        </div>
        <button class="next" onclick="callScreen2(${id})">Acessar Quizz</button>
        <div class="home" onclick="home()">Voltar pra home</div>
    </div>
    `;
}//chamar a função da tela 2 e tela 1 

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