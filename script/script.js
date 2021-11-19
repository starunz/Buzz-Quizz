const URL = 'https://mock-api.driven.com.br/api/v4/buzzquizz'; //essa parte da url é sempre a mesma o que muda é a rota.
const Container = document.querySelector('.container'); //para facilitar a vida, a gente pode usar 1 unica main para todas telas
//já que vamos criar dinâmicamente, economiza css, html e tempo de ficar procurando :v mas cuidado nos fechamentos das divs :v


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

basicQuizzInformation();