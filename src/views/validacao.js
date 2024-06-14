function buscarEndereco() {
    let cep = document.getElementById('formCep').value
    let urlAPI = 'https://viacep.com.br/ws/' + cep + '/json/'

    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            document.getElementById('formLogradouro').value = dados.logradouro
            document.getElementById('formBairro').value = dados.bairro
            document.getElementById('formCidade').value = dados.localidade
            document.getElementById('formUf').value = dados.uf;
        })
        .catch(error => console.error('Erro ao buscar o endereço:', error));
}
document.getElementById('formCep').addEventListener('blur', buscarEndereco);

//Validação de CNPJ
function validaCNPJ (cnpj) {
    var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
    var c = String(cnpj).replace(/[^\d]/g, '')
    
    if(c.length !== 14)
        return document.getElementById("validation").src = "../public/img/errado.png"

    if(/0{14}/.test(c))
        return document.getElementById("validation").src = "../public/img/errado.png"

    for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
    if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
        return document.getElementById("validation").src = "../public/img/errado.png"

    for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
    if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
        return document.getElementById("validation").src = "../public/img/errado.png"

    return document.getElementById("validation").src = "../public/img/correto.png"
    
}


//Validação de E-mail
let email = document.querySelector('#formEmail')
let validationEmail = document.querySelector('#validationEmail')

//Dar um aviso ao digitar o formato do Email
email.addEventListener("keyup", ()=>{
    if(validarEmail(email.value) !== true){
        validationEmail.src = "../public/img/errado.png"
    } else {
        validationEmail.src = "../public/img/correto.png"
    }
})

//Função de validação de e-mail
function validarEmail(email){
    let emailPadrao = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailPadrao.test(email)
}



//Validaçao de CPF
let cpf = document.querySelector('#formCpf')
let validationCPF = document.querySelector('#validationCPF')

function CpfValido(cpf){
    if (cpf.length !== 11 || cpf === "00000000000" || cpf === "11111111111" || cpf === "22222222222" || cpf === "33333333333" || cpf === "44444444444" || cpf === "55555555555" || cpf === "66666666666" || cpf === "77777777777" || cpf === "88888888888" || cpf === "99999999999") return false;
    if (cpf.length != 11) return false;

    var soma = 0;
    var resto;

    for (i = 1; i <= 9; i++) {
        soma = soma + (parseInt(cpf.substring(i - 1, i)) * (11 - i));
    }

    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
        resto = 0;

    if (resto != parseInt(cpf.substring(9, 10)))
        return false;

    soma = 0;
    for (i = 1; i <= 10; i++) {
        soma = soma + (parseInt(cpf.substring(i - 1, i)) * (12 - i))
    };

    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
        resto = 0;

    if (resto != parseInt(cpf.substring(10, 11)))
        return false;

    return true;
}

//Evento de validação de CPF ao digitar no campo
cpf.addEventListener("keyup", () => {
    if( CpfValido(cpf.value) !== true){
        validationCPF.src = "../public/img/errado.png"
    } else {
        validationCPF.src = "../public/img/correto.png"
    }
})
 