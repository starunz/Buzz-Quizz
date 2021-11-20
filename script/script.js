
function sucess(response){
    const quizzes = response.data;
    console.log(quizzes)
    const ulQuizzes = document.querySelector(".list-quizz-server");
    ulQuizzes.innerHTML = '';

       for (let i = 0; i < quizzes.length; i++){
            ulQuizzes.innerHTML += ` <li>
            <div class="quizz-header">
            
              <strong class="quizz-title">${quizzes[i].title}</strong>
            </div>
            <div class="quizz-question">
            <div class="layer">
              <img class="img" src="${quizzes[i].image}" width="340" height="181">     
            </div>
            </div>
            </li>`
        }
}
const promess = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

promess.then(sucess);


//button
