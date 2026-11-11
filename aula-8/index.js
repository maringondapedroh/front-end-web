const API_URL = "https://postman-echo.com/post";

const form = document.querySelector("#cadastro");
form.addEventListener("submit", executar);

// Máscaras (celular, CPF e CEP)
document.querySelector("#celular").addEventListener("input", mascararCelular);
document.querySelector("#cpf").addEventListener("input", mascararCpf);
document.querySelector("#cep").addEventListener("input", mascararCep);

function executar(evento) {
  evento.preventDefault();
  limparForm();
  if (!validarForm()) {
    return;
  }
  chamarApi();
}

// ---------- Envio para a API ----------

async function chamarApi() {
  const dados = {
    nome: valor("nome"),
    email: valor("email"),
    cpf: somenteNumeros(valor("cpf")),
    nascimento: valor("nascimento"),
    celular: somenteNumeros(valor("celular")),
    cep: somenteNumeros(valor("cep")),
    cidade: valor("cidade"),
    estado: valor("estado"),
    // a senha é validada, mas não é enviada
  };

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    const resultado = await resposta.json();
    alert(
      "Cadastro realizado com sucesso!\n\nRetorno da API:\n" +
        JSON.stringify(resultado.json, null, 2)
    );
    form.reset();
  } catch (erro) {
    alert("Não foi possível enviar o cadastro: " + erro.message);
  }
}

// ---------- Validação ----------

function validarForm() {
  const campos = [
    ["nome", validarNome],
    ["email", validarEmail],
    ["cpf", validarCpf],
    ["nascimento", validarNascimento],
    ["celular", validarCelular],
    ["cep", validarCep],
    ["cidade", validarCidade],
    ["estado", validarEstado],
    ["senha", validarSenha],
    ["confirmar-senha", validarConfirmarSenha],
    ["termos", validarTermos],
  ];

  campos.forEach(([id, validador]) => {
    const mensagem = validador();
    if (mensagem) mostrarErro(id, mensagem);
  });

  const valido = document.querySelectorAll("p.erro:not(#concluido)").length === 0;

  if (!valido) {
    const concluido = document.querySelector("#concluido");
    concluido.textContent = "Corrija os erros antes de prosseguir!";
    concluido.classList.add("erro");
    concluido.classList.remove("oculto");
  }

  return valido;
}

// Cada validador devolve a mensagem de erro, ou "" se estiver tudo certo.

function validarNome() {
  const nome = valor("nome");
  if (nome === "") return "Nome não pode estar vazio!";
  if (nome.split(/\s+/).length < 2) return "Informe nome e sobrenome!";
  if (!/^[A-Za-zÀ-ÿ' ]+$/.test(nome)) return "Nome deve conter apenas letras!";
  return "";
}

function validarEmail() {
  const email = valor("email");
  if (email === "") return "Email não pode estar vazio!";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(email)) return "Email inválido!";
  return "";
}

function validarCpf() {
  const cpf = somenteNumeros(valor("cpf"));
  if (cpf === "") return "CPF não pode estar vazio!";
  if (!cpfValido(cpf)) return "CPF inválido!";
  return "";
}

function validarNascimento() {
  const nascimento = valor("nascimento");
  if (nascimento === "") return "Data de nascimento não pode estar vazia!";

  const data = new Date(nascimento + "T00:00:00");
  const hoje = new Date();
  if (data > hoje) return "Data de nascimento não pode estar no futuro!";

  let idade = hoje.getFullYear() - data.getFullYear();
  const jaFezAniversario =
    hoje.getMonth() > data.getMonth() ||
    (hoje.getMonth() === data.getMonth() && hoje.getDate() >= data.getDate());
  if (!jaFezAniversario) idade--;

  if (idade < 18) return "É necessário ter 18 anos!";
  return "";
}

function validarCelular() {
  const celular = somenteNumeros(valor("celular"));
  if (celular === "") return "Celular não pode estar vazio!";
  if (!/^\d{2}9\d{8}$/.test(celular)) return "Celular inválido! Use (DD) 9XXXX-XXXX.";
  return "";
}

function validarCep() {
  const cep = somenteNumeros(valor("cep"));
  if (cep === "") return "CEP não pode estar vazio!";
  if (cep.length !== 8) return "CEP deve ter 8 dígitos!";
  return "";
}

function validarCidade() {
  if (valor("cidade") === "") return "Cidade não pode estar vazia!";
  return "";
}

function validarEstado() {
  if (valor("estado") === "") return "Selecione um estado!";
  return "";
}

function validarSenha() {
  const senha = document.querySelector("#senha").value;
  if (senha === "") return "Senha não pode estar vazia!";
  if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres!";
  if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
    return "A senha deve conter letras e números!";
  }
  return "";
}

function validarConfirmarSenha() {
  const senha = document.querySelector("#senha").value;
  const confirmar = document.querySelector("#confirmar-senha").value;
  if (confirmar === "") return "Confirme a senha!";
  if (senha !== confirmar) return "As senhas não coincidem!";
  return "";
}

function validarTermos() {
  if (!document.querySelector("#termos").checked) {
    return "É preciso aceitar os termos!";
  }
  return "";
}

function cpfValido(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (tamanho) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return calcularDigito(9) === Number(cpf[9]) && calcularDigito(10) === Number(cpf[10]);
}

// ---------- Mensagens de erro ----------

function mostrarErro(id, mensagem) {
  const erro = document.querySelector(`#erro-${id}`);
  erro.textContent = mensagem;
  erro.classList.add("erro");
  erro.classList.remove("oculto");

  document.querySelector(`#${id}`).classList.add("campo-erro");
}

function limparForm() {
  document.querySelectorAll("p.erro").forEach((item) => {
    item.classList.remove("erro");
    item.classList.add("oculto");
  });
  document.querySelectorAll(".campo-erro").forEach((campo) => {
    campo.classList.remove("campo-erro");
  });
}

// ---------- Máscaras ----------

function mascararCelular(evento) {
  const campo = evento.target;
  const numeros = somenteNumeros(campo.value).slice(0, 11);

  const ddd = numeros.slice(0, 2);
  const inicio = numeros.slice(2, 7);
  const fim = numeros.slice(7);

  if (numeros.length > 7) {
    campo.value = `(${ddd}) ${inicio}-${fim}`;
  } else if (numeros.length > 2) {
    campo.value = `(${ddd}) ${inicio}`;
  } else if (numeros.length > 0) {
    campo.value = `(${ddd}`;
  } else {
    campo.value = "";
  }
}

function mascararCpf(evento) {
  const campo = evento.target;
  const n = somenteNumeros(campo.value).slice(0, 11);

  if (n.length > 9) {
    campo.value = `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
  } else if (n.length > 6) {
    campo.value = `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  } else if (n.length > 3) {
    campo.value = `${n.slice(0, 3)}.${n.slice(3)}`;
  } else {
    campo.value = n;
  }
}

function mascararCep(evento) {
  const campo = evento.target;
  const n = somenteNumeros(campo.value).slice(0, 8);
  campo.value = n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n;
}

// ---------- Utilitários ----------

function valor(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function somenteNumeros(texto) {
  return texto.replace(/\D/g, "");
}
