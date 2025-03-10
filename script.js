const formatarTelefone = (telefone) => {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  };
  
  const formatarDataNascimento = (data) => {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };
  
  const formCadastro = document.getElementById('formulario');
  if (formCadastro) {

    const input_id = document.querySelector('#input_id');
    const input_nome = document.querySelector('#input_nome');
    const input_telefone = document.querySelector('#input_telefone');
    const input_email = document.querySelector('#input_email');
    const input_data_nascimento = document.querySelector('#input_data_nascimento');
    const select_cargo = document.querySelector('#select-cargo');
    const input_senha = document.querySelector('#input_senha');
    const input_confirmar_senha = document.querySelector('#input_confirmar_senha');
    const botao_submit = document.querySelector('#btn-submit');
    const ul_funcionarios = document.getElementById('ul-funcionarios');
    const input_pesquisa = document.querySelector('#input_pesquisa');
  
    window.addEventListener('load', () => {
      setTimeout(() => {
        getCargos();
        getFuncionarios();
      }, 2000);
    });
  

    const verificarCampos = () => {
      if (
        input_nome.value &&
        input_telefone.value &&
        input_email.value &&
        input_data_nascimento.value &&
        select_cargo.value &&
        input_senha.value &&
        input_confirmar_senha.value
      ) {
        botao_submit.removeAttribute('disabled');
      } else {
        botao_submit.setAttribute('disabled', 'true');
      }
    };
  
    formCadastro.addEventListener('input', verificarCampos);
  
    formCadastro.addEventListener('submit', (event) => {
      event.preventDefault();

      if (input_id.value) {
        updateFuncionario(input_id.value);
      } else {
        postFuncionario();
      }
      limparCampos();
    });
  
    const limparCampos = () => {
      input_id.value = "";
      input_nome.value = '';
      input_telefone.value = '';
      input_email.value = '';
      input_data_nascimento.value = '';
      select_cargo.value = '';
      input_senha.value = '';
      input_confirmar_senha.value = '';
      verificarCampos();
    };
  
    const postFuncionario = () => {
      const nome = input_nome.value;
      const telefone = input_telefone.value;
      const email = input_email.value;
      const data_nascimento = input_data_nascimento.value;
      const cargoId = select_cargo.value;
      const senha = input_senha.value;
  
      if (senha !== input_confirmar_senha.value) {
        alert('As senhas não coincidem!');
        return;
      }
  
      const novo_funcionario = { nome, telefone, email, data_nascimento, senha };
      novo_funcionario.cargo = { id: cargoId };
  
      console.log("Novo funcionário:", novo_funcionario);
  
      fetch("http://localhost:3000/funcionarios", {
        body: JSON.stringify(novo_funcionario),
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => {
          console.log("Cadastro de funcionário:", res);
          getFuncionarios();
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    const updateFuncionario = (id) => {
      const nome = input_nome.value;
      const telefone = input_telefone.value;
      const email = input_email.value;
      const data_nascimento = input_data_nascimento.value;
      const cargoId = select_cargo.value;
      const senha = input_senha.value;
  
      if (senha !== input_confirmar_senha.value) {
        alert('As senhas não coincidem!');
        return;
      }
  
      const funcionarioAtualizado = { nome, telefone, email, data_nascimento, senha };
      funcionarioAtualizado.cargo = { id: cargoId };
  
      console.log("Atualizando funcionário:", funcionarioAtualizado);
  
      fetch(`http://localhost:3000/funcionarios/${id}`, {
        body: JSON.stringify(funcionarioAtualizado),
        method: "PUT", 
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => {
          console.log("Funcionário atualizado:", res);
          getFuncionarios();
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    function getCargos() {
      fetch("http://localhost:3000/cargos")
        .then((res) => res.json())
        .then((json) => {
          select_cargo.innerHTML = "<option value=''>Selecione um cargo</option>";
          json.forEach((cargo) => {
            select_cargo.innerHTML += `<option value="${cargo.id}">${cargo.nome}</option>`;
            const bs_cargos = document.querySelectorAll(`#b-cargo-${cargo.id}`);
            bs_cargos.forEach((b_cargo) => {
              b_cargo.innerText = cargo.nome;
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  
    function getFuncionarios() {
      fetch("http://localhost:3000/funcionarios")
        .then((res) => res.json())
        .then((json) => {
          console.log("Funcionários:", json);
          json.reverse();
          ul_funcionarios.innerHTML = "";
          json.forEach((funcionario) => {
            const telefoneFormatado = formatarTelefone(funcionario.telefone);
            const dataNascimentoFormatada = formatarDataNascimento(funcionario.data_nascimento);
            ul_funcionarios.innerHTML += `<li>
                <div><strong>ID:</strong> ${funcionario.id}</div>
                <div><strong>Nome:</strong> ${funcionario.nome}</div>
                <div><strong>Telefone:</strong> ${telefoneFormatado}</div>
                <div><strong>Email:</strong> ${funcionario.email}</div>
                <div><strong>Data de Nascimento:</strong> ${dataNascimentoFormatada}</div>
                <div><strong>Cargo:</strong> <span id="b-cargo-${funcionario.cargo.id}">Carregando ⏳️</span></div>
                <button onclick="deleteFuncionario('${funcionario.id}')">🗑️</button>
                <button onclick="editarFuncionario('${funcionario.id}')">✏️</button>
              </li>`;
          });
          getCargos();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  
    window.editarFuncionario = (id) => {
      fetch(`http://localhost:3000/funcionarios/${id}`)
        .then((res) => res.json())
        .then((funcionario) => {
          input_id.value = funcionario.id;
          input_nome.value = funcionario.nome;
          input_telefone.value = funcionario.telefone;
          input_email.value = funcionario.email;
          input_data_nascimento.value = funcionario.data_nascimento;
          select_cargo.value = funcionario.cargo.id;
          input_senha.value = funcionario.senha;
          input_confirmar_senha.value = funcionario.senha;
          input_nome.focus();
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    function deleteFuncionario (id){
      fetch(`http://localhost:3000/funcionarios/${id}`, {
        method: "DELETE"
      })
        .then((res) => {
          console.log("DELETE funcionário:", res);
          getFuncionarios();
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    function filtrarFuncionarios() {
      const termo = input_pesquisa.value.toLowerCase();
      const funcionarios = document.querySelectorAll("#ul-funcionarios li");
      funcionarios.forEach((funcionario) => {

        const nomeFuncionario = funcionario.querySelector("div:nth-child(2)").innerText.toLowerCase();
        if (nomeFuncionario.includes(termo)) {
          funcionario.style.display = "block";
        } else {
          funcionario.style.display = "none";
        }
      });
    }
  
    input_pesquisa.addEventListener("input", filtrarFuncionarios);
  }
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const input_email_login = document.querySelector('#login-email');
    const input_senha_login = document.querySelector('#login-senha');
  
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      login();
    });
  
    function login() {
      const email = input_email_login.value;
      const senha = input_senha_login.value;
      fetch("http://localhost:3000/funcionarios")
        .then((res) => res.json())
        .then((json) => {
          const funcionario = json.find(f => f.email === email && f.senha === senha);
          if (funcionario) {
            alert('Login bem-sucedido!');
            window.location.href = 'index.html';
          } else {
            alert('Credenciais incorretas!');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  