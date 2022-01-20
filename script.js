// Primeiro, eu pego todos os elementos HTML que eu irei utilizar no programa.

const message = document.querySelector('.message');
const btnNovaPartida = document.querySelector('.btn');
const guessValue = document.querySelector('.guess-value');
const guessBtn = document.querySelector('.guess-btn');

let RANDOM_NUMBER;
const form = document.getElementById('form');

const hundreds = document.getElementById('hundreds');
const tens = document.getElementById('tens');
const units = document.getElementById('units');

// Chamo a função para gerar o número aleatório, que está definida na linha 39.
getRandomNumber();

// Essa função é para lidar com o erro de requisição e colocar o código para mostrar nos LEDs
// Como utilizei 7 SVGs para cada segmento do LED, precisei usar um loop para cada um dos segmentos de cada número para poder mudar para a cor certa
function handleErrors(response) {
  if (!response.ok) {
    displayNumber(response.status);
    message.innerHTML = 'Erro de servidor';
    message.style.color = 'red';

    document.getElementById('number').disabled = true;
    document.querySelector('.guess-btn').disabled = true;

    for (let i = 0; i < 7; i++) {
      hundreds.children[i].children[0].classList.add('wrong');
      tens.children[i].children[0].classList.add('wrong');
      units.children[i].children[0].classList.add('wrong');
    }

    btnNovaPartida.style.visibility = 'visible';
  }
  return response.json();
}

// Essa função é para fazer a requisição utilizando o endpoint fornecido pelo desafio. Utilizei a Fetch API do próprio JavaScript para fazer a requisição.
// Nela, eu faço o uso da função para lidar com erros definida mais cedo e depois utilizo o dado obtido e o coloco na variaável RANDOM_NUMBER para ser usado posteriormente
function getRandomNumber() {
  fetch('https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300')
    .then(handleErrors)
    .then(data => {
      RANDOM_NUMBER = data.value;
    })
    .catch(error => console.error(error));
}

// Essa função é para checar se o número digitado pelo usuário é igual ao número aleatório obtido através da requisição. Se for, mostra a mensagem de acerto e muda as cores dos LEDs para verde. Se for maior, mostra a mensagem que é menor. Se for maior, mostra a mensagem que é menor. No fim, limpo o input e retorno um booleano para saber se o usuário acertou ou não.
function checkNumberIsCorrect(inputNumber) {
  if (Number(inputNumber) === RANDOM_NUMBER) {
    message.innerHTML = 'Na mosca!';
    message.style.color = 'green';

    for (let i = 0; i < 7; i++) {
      hundreds.children[i].children[0].classList.add('correct');
      tens.children[i].children[0].classList.add('correct');
      units.children[i].children[0].classList.add('correct');
    }

    document.getElementById('number').disabled = true;
    document.querySelector('.guess-btn').disabled = true;
    btnNovaPartida.style.visibility = 'visible';
  } else if (Number(inputNumber) > RANDOM_NUMBER) {
    message.innerHTML = 'É menor';
  } else if (Number(inputNumber) < RANDOM_NUMBER) {
    message.innerHTML = 'É maior';
  }

  document.getElementById('number').value = '';

  return inputNumber === RANDOM_NUMBER;
}

// Aqui, adiciono um evento de click no botão "Nova partida", para que ele faça uma nova requisição e limpe os LEDs e a mensagem e desative os botões.
btnNovaPartida.addEventListener('click', () => {
  getRandomNumber();

  btnNovaPartida.style.visibility = 'hidden';

  for (let i = 0; i < 7; i++) {
    hundreds.children[i].children[0].classList.remove('correct');
    hundreds.children[i].children[0].classList.remove('wrong');
    tens.children[i].children[0].classList.remove('correct');
    tens.children[i].children[0].classList.remove('wrong');
    units.children[i].children[0].classList.remove('correct');
    units.children[i].children[0].classList.remove('wrong');
  }

  message.innerHTML = '';
  message.style.color = '#FF6600';

  hundreds.style.display = 'none';
  tens.style.display = 'none';
  units.className = 'digit zero';

  guessBtn.disabled = false;
  guessValue.disabled = false;
});

// Aqui, adiciono um evento de submit no formulário. Primeiro, ele faz a checagem se o valor digitado pelo usuário é válido e de acordo com as regras do desafio. Se for, coloca esse número no display de LEDs, utilizando a função displayNumber, que defini logo abaixo. E então, faz a checagem se o número digitado é igual ao número aleatório.
form.addEventListener('submit', e => {
  e.preventDefault();

  if (
    !e.target[0].value ||
    isNaN(e.target[0].value) ||
    Number(e.target[0].value) < 0 ||
    Number(e.target[0].value) > 300
  ) {
    return;
  }
  displayNumber(e.target[0].value);
  checkNumberIsCorrect(e.target[0].value);
});

// Essa função é para mostrar o número digitado pelo usuário no display de LEDs. Primeiro, criei um array com os nomes dos digitos escritos por extenso, para poder transformar o número digitado pelo usuário em uma string, que será usada como nome de classe no CSS e no HTML.
// Ela recebe o número como parâmetro. E então, faço a conversão desse número que é recebido para String, para que possa ser manipulado como se fosse um array. Depois, faço a checagem para ver se o número possui apenas um dígito. Se tiver, os outros 2 dígitos são removidos do display de LEDs. E então adiciono a classe correspondente ao número digitado pelo usuário. Faço isso para a casa das dezenas e centenas também.
function displayNumber(number) {
  const writtenNumbers = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
  ];

  const numStr = number.toString();

  if (numStr.length === 1) {
    tens.style.display = 'none';
    hundreds.style.display = 'none';

    units.className = `digit ${writtenNumbers[numStr[0]]}`;
  } else if (numStr.length === 2) {
    tens.style.display = 'block';
    hundreds.style.display = 'none';

    tens.className = `digit ${writtenNumbers[numStr[0]]}`;
    units.className = `digit ${writtenNumbers[numStr[1]]}`;
  } else if (numStr.length === 3) {
    tens.style.display = 'block';
    hundreds.style.display = 'block';

    hundreds.className = `digit ${writtenNumbers[numStr[0]]}`;
    tens.className = `digit ${writtenNumbers[numStr[1]]}`;
    units.className = `digit ${writtenNumbers[numStr[2]]}`;
  }
}
