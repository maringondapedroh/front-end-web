// ----- Saudação -----
const inputNome = document.getElementById("nome");
const btnSaudar = document.getElementById("btn-saudar");
const saudacao = document.getElementById("saudacao");

btnSaudar.addEventListener("click", function () {
  const nome = inputNome.value.trim();

  if (nome === "") {
    saudacao.textContent = "Por favor, digite seu nome.";
  } else {
    saudacao.textContent = "Olá, " + nome + "! Bem-vindo(a)!";
  }
});

// ----- Contador -----
let contagem = 0;
const contador = document.getElementById("contador");

function atualizarContador() {
  contador.textContent = contagem;
}

document.getElementById("btn-mais").addEventListener("click", function () {
  contagem++;
  atualizarContador();
});

document.getElementById("btn-menos").addEventListener("click", function () {
  contagem--;
  atualizarContador();
});

document.getElementById("btn-zerar").addEventListener("click", function () {
  contagem = 0;
  atualizarContador();
});

// ----- Tema escuro -----
document.getElementById("btn-tema").addEventListener("click", function () {
  document.body.classList.toggle("escuro");
});
