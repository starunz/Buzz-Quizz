const URL = 'https://mock-api.driven.com.br/api/v4/buzzquizz'; //essa parte da url é sempre a mesma o que muda é a rota.
const Container = document.querySelector('.container'); //para facilitar a vida, a gente pode usar 1 unica main para todas telas
//já que vamos criar dinâmicamente, economiza css, html e tempo de ficar procurando :v mas cuidado nos fechamentos das divs :v

function basicQuizzInformation() {
    Container.innerHTML = `
    <div class="create-quiz">
        <div class="title">Comece pelo começo</div>
        <div class="creating">
            <input type="text" class="titulo" placeholder="Título do seu quizz">
            <input type="text" class="url" placeholder="URL da imagem do seu quizz">
            <input type="number" class="quantidade-perguntas" placeholder="Quantidade de perguntas do quizz">
            <input type="number" class="quantidade-niveis" placeholder="Quantidade de níveis do quizz">
        </div>
        <button class="next" onclick="createQuizzQuestions()">Prosseguir pra criar perguntas</button>
    </div>
    `
}

function validateOfBasicQuizzInfo() {
    // aqui ficará as validações 
}

function createQuizzQuestions() {
    // aqui vai ficar a função que criará a tela 3.2 
    // mas pra chamar ela preciso validar a tela 3.1

}