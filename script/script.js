
function sucess(response){
    const quizzes = response.data;
    const ulQuizzes = document.querySelector(".list-quizz-server");
    ulQuizzes.innerHTML = '';
    
    
    for (let i = 0; i < quizzes.length; i++){
           
            ulQuizzes.innerHTML += ` <li>
            <div class="quizz-server" onclick="showScreenTwo(${quizzes[i].id})" >
            
              <strong class="quizz-title">${quizzes[i].title}</strong>
              <div class="quizz-question">
              <div class="layer">
              <img class="img" src="${quizzes[i].image}" width="340" height="181">     
              </div>
            </div>
            </div>
            </li>`
        }
}
const promess = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

promess.then(sucess);


    function showScreenTwo(quizzId){
    const screenOne = document.querySelector(".tela-01");
    screenOne.classList.add("hide");

    callScreen2(quizzId)
    }


const URL = 'https://mock-api.driven.com.br/api/v4/buzzquizz'; //essa parte da url é sempre a mesma o que muda é a rota.
const Container = document.querySelector('.container'); //para facilitar a vida, a gente pode usar 1 unica main para todas telas
//já que vamos criar dinâmicamente, economiza css, html e tempo de ficar procurando :v mas cuidado nos fechamentos das divs :v

// ------ tela 02 ------ 

let answersCorret = 0;
let dataQuiz;
let numberOfResponses = 0;
let data;
let scren2;

function callScreen2(idQuizz){
    const promise = axios.get(URL+"/quizzes/"+idQuizz);
    promise.then(loadQuizz);
    promise.catch(handleError);
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
    Container.innerHTML = scren2;
}


function selectAnswer(answer, isCorrectAnswer){
    const select = answer.parentNode;
    const parent = select.parentNode;
    const questionAtual = (parent.parentNode).parentNode;
    console.log(parent.children[1].style.opacity)
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
        <button class="home" onclick="home()">Voltar pra home</button>
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
function handleError(erro){
    console.log(erro)
} 
//-------fim tela 02----------
// ------ tela 03 ------ 

let quizzInfo = {} // guardar as informações que eu preciso em um objeto para validar os campos
function basicQuizzInformation() {
    quizzInfo = {
        title: '',
        image: '',
        numberQuestions: 0,
        numberLevels: 0
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
    } else if (!checkURL(quizzInfo.image)) {
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
    }
    // aqui vai ficar a função que criará a tela 3.2 
    // mas pra chamar ela preciso validar a tela 3.1

}

function checkURL (url) {
    const regexUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    return regexUrl.test(url);
}

//basicQuizzInformation();

