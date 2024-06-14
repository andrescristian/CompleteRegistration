const { app, BrowserWindow, Menu, dialog, ipcMain, nativeTheme, shell } = require('electron/main')
const path = require('node:path')

// ###################################################
//importar fs para trabalhar com os arquivos de imagens
const fs = require('fs')

// importar o módulo do banco de dados
const { conectar, desconectar } = require('./db')
//importar o Schema (models)
const Cadastros = require(`${__dirname}/src/models/Cadastros`)
const Fornecedor = require(`${__dirname}/src/models/Fornecedor`)
const Produto = require(`${__dirname}/src/models/Produtos`)

//Importante!
//janela principal
let win
const createWindow = () => {
  //forçar o modo escuro na janela do sistema 
  nativeTheme.themeSource = 'light' //O 'light' coloca em modo claro  

  win = new BrowserWindow({     //tirar a const e deixar só o win 
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: `${__dirname}/src/public/img/Cadastro.png`
  })

  //Carregar o menu personalizado
  const menuPersonalizado = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menuPersonalizado)

  win.loadFile(`${__dirname}/src/views/index.html`)
}
//fim da janela principal

//Janela (tela) cadastro
let winAbout
const aboutWindow = () => {
  winAbout = new BrowserWindow({
    width: 1024,
    height: 600,
    icon: `${__dirname}/src/public/img/Cadastro.png`,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  winAbout.loadFile(`${__dirname}/src/views/cadastro.html`)

}
//fim da janela cadastro

//cadastro fornecedor
let fornecedorCadastro
const telaFornecedor = () => {
  fornecedorCadastro = new BrowserWindow({
    width: 1024,
    height: 718,
    icon: `${__dirname}/src/public/img/Cadastro.png`,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  fornecedorCadastro.loadFile(`${__dirname}/src/views/fornecedor.html`)

}
//Janela de relatorio
const aboutWindow2 = () => {
  winAbout = new BrowserWindow({
    width: 1150,
    height: 768,
    icon: `${__dirname}/src/public/img/Cadastro.png`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }


  })
  const menuPersonalizado = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menuPersonalizado)
  winAbout.loadFile(`${__dirname}/src/views/editar.html`)
}
//fim do editar cadastro

let fornecedoresTabela
const tabelaFornecedores = () => {
  fornecedoresTabela = new BrowserWindow({
    width: 1465,
    height: 850,
    icon: `${__dirname}/src/public/img/Cadastro.png`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }


  })
  fornecedoresTabela.loadFile(`${__dirname}/src/views/tabelaFornecedor.html`)
}

let produtos
const telaProdutos = () => {
  produtos = new BrowserWindow({
    width: 1200,
    height: 700,
    icon: `${__dirname}/src/public/img/Cadastro.png`,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }


  })
  produtos.loadFile(`${__dirname}/src/views/produto.html`)
}

let relatorioProdutos
const relatorioProd = () => {
  relatorioProdutos = new BrowserWindow({
    width: 1265,
    height: 850,
    icon: `${__dirname}/src/public/img/Cadastro.png`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }


  })
  relatorioProdutos.loadFile(`${__dirname}/src/views/tabelaProdutos.html`)
}

//--------------------janela sobre----------------------------
let winAbout3
const aboutWindow3 = () => {
  if (!winAbout3) {
    winAbout3 = new BrowserWindow({
      width: 600,
      height: 300,
      icon: `${__dirname}/src/public/img/Cadastro.png`,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      }

    })
  }
  // Esconde o menu da janela
  winAbout3.setMenu(null)

  winAbout3.loadFile(`${__dirname}/src/views/sobre.html`)
  winAbout3.on('closed', () => {
    winAbout3 = null
  })
}

//----------------fim da janela sobre-------------------------
app.whenReady().then(() => {
  createWindow() //criar a janela
  //IMPORTANTE!!! Executar tambem a função novoArquivo() para criar o objeto file (mesmo comportamento do bloco de notas e editores de codigo)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//encerrar a conexão com o banco de dados antes do aplicativo for fechado
app.on('before-quit', async () => {
  await desconectar()
})

//acrescentar este processo (correção de bug reload icone status) - passo 2 slide
ipcMain.on('send-message', (event, message) => {
  console.log("<<<", message)
  statusConexao()
})

//status de conexão 
const statusConexao = async () => {
  try {
    await conectar()
    //enviar uma mensagem para a janela (renderer.js) informando o status da conexão e os erros caso ocorram
    win.webContents.send('db-status', "Banco de dados conectado")
  } catch (error) {
    win.webContents.send(`db-status', "Erro de conexão: ${error.message}`)
  }
}

//Sessão dos botões para abrir as telas
ipcMain.on('tela-cadastro', () => {
  aboutWindow()
})

ipcMain.on('tela-relatorio', () => {
  aboutWindow2()
})

ipcMain.on('tela-fornecedor', () => {
  telaFornecedor()
})
ipcMain.on('relatorio-fornecedor', () => {
  tabelaFornecedores()
})

ipcMain.on('tela-produtos', () => {
  telaProdutos()
})

ipcMain.on('relatorio-produtos', () => {
  relatorioProd()
})

//Template do menu 
const menuTemplate = [
  {
    label: 'Cadastro',
    submenu: [
      {
        label: 'Cadastro',
        click: aboutWindow
      },
      {
        label: 'Fornecedores',
        click: telaFornecedor
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4', //accelerator cria atalhos
        click: () => app.quit()
      }

    ]
  },
  {
    label: 'Relatório',
    submenu: [
      {
        label: 'Cliente',
        click: aboutWindow2
      },
      {
        label: 'Fornecedores',
        click: tabelaFornecedores
      },
    ]
  },
  {
    label: 'Editar',
    submenu: [
      {
        label: 'Desfazer',
        role: 'undo'
      },
      {
        label: 'Refazer',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recortar',
        role: 'cut'
      },
      {
        label: 'Copiar',
        role: 'copy'
      },
      {
        label: 'Colar',
        role: 'paste'
      }
    ]
  },
  {
    label: 'Exibir',
    submenu: [
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'Ferramentas do Desenvolvedor',
        role: 'toggleDevTools'
      },
      {
        type: 'separator'
      },
      {
        label: 'Aplicar Zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      }


    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Sobre',
        click: aboutWindow3

      }
    ]
  }
]


//CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('new-task', async (event, args) => {
  console.log(args) // teste de recebimento
  // Salvar no banco de dados os dados do formulario
  // validação dos campos obrigatorios
  if (args.nome === "") {
    dialog.showMessageBox(winAbout, {
      type: "info",
      message: 'Preencha o nome, campo obrigatorio',
      buttons: ['ok']
    })
  } else if (args.telefone === "") {
    dialog.showMessageBox(winAbout, {
      type: "info",
      message: 'Preencha o telefone, campo obrigatorio',
      buttons: ['ok']
    })

  } else {
    const novoCadastro = new Cadastros(args)
    await novoCadastro.save()

    //enviar uma confirmação para o renderer(front-end) - passo 4
    //passando a nova tarefa no formato JSON (Passo extra CRUD READ)
    event.reply('new-task-created', JSON.stringify(novoCadastro))
  }

})

ipcMain.on('new-fornecedor', async (event, args) => {
  console.log(args) // teste de recebimento
  // Salvar no banco de dados os dados do formulario
  // validação dos campos obrigatorios
  if (args.empresa === "") {
    dialog.showMessageBox(fornecedorCadastro, {
      type: "info",
      message: 'Preencha o nome da empresa, campo obrigatorio',
      buttons: ['ok']
    })
  } else if (args.telefone === "") {
    dialog.showMessageBox(fornecedorCadastro, {
      type: "info",
      message: 'Preencha o telefone, campo obrigatorio',
      buttons: ['ok']
    })

  } else {
    const novoCadastro = new Fornecedor(args)
    await novoCadastro.save()

    //enviar uma confirmação para o renderer(front-end) - passo 4
    //passando a nova tarefa no formato JSON (Passo extra CRUD READ)
    event.reply('new-fornecedor-created', JSON.stringify(novoCadastro))
  }

})

ipcMain.on('new-produto', async (event, args) => {
  console.log(args) // teste de recebimento
  // Salvar no banco de dados os dados do formulario
  // validação dos campos obrigatorios
  try {
    
     // ###################################################
        // se não existir um diretório chamado uploads, criar
        const uploadsDir = path.join(__dirname, 'uploads')
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir)
        }

        // ###################################################
        // gerar o nome do arquivo
        const fileName = `${Date.now()}_${path.basename(args.imagemProduto)}`
        console.log(fileName);
        // ###################################################
        // Obter o caminho de destino (armazenar em banco)
        const destination = path.join(uploadsDir, fileName)
        console.log(destination);
        // ###################################################
        // copiar o arquivo de imagem para pasta uploads
        fs.copyFileSync(args.imagemProduto, destination)

        const novoProduto = new Produto({
          codigo: args.codigo,
          produto: args.produto,
          empresa: args.empresa,
          estoque: args.estoque,
          valor: args.valor,
          imagemProduto: destination
      })

        // const novoProduto = new produtoModel(produto)
        dialog.showMessageBox(produtos, {
            type: 'info',
            title: 'CONEST',
            message: 'Produto cadastrado com sucesso',
            buttons: ['OK']
        })

    if (args.produto === "") {
      dialog.showMessageBox(produtos, {
        type: "info",
        message: 'Preencha o nome do produto, campo obrigatorio',
        buttons: ['ok']
      })
    } else if (args.fornecedorCadastro === "") {
      dialog.showMessageBox(produtos, {
        type: "info",
        message: 'Preencha o telefone, campo obrigatorio',
        buttons: ['ok']
      })
  
    } else {
      const novoCadastro = new Produto(args)
      await novoCadastro.save()
  
      //enviar uma confirmação para o renderer(front-end) - passo 4
      //passando a nova tarefa no formato JSON (Passo extra CRUD READ)
      event.reply('new-produto-created', JSON.stringify(novoCadastro))
    }
  } catch (error) {
    
  }
})

ipcMain.on('procurar-nome', async (event, args) => {
  const fornecedores = await Fornecedor.find() //.find faz a busca e como o "select no mysql"
  console.log(fornecedores) //passo 2 fins didaticos (teste)
  //passo 3(slide) enviar ao renderer(view) as tarefas pendentes
  event.reply('manda-nome', JSON.stringify(fornecedores))
})
// ipcMain.on('new-task-refresh', async (event, args) => {
//   event.reply('refresh-page', JSON.stringify(novoCadastro))
// })

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//CRUD READ
//passo 2(slide) fazer uma busca no banco de dados de todas as tarefas pendentes
ipcMain.on('get-tasks', async (event, args) => {
  const cadastrosPendentes = await Cadastros.find() //.find faz a busca e como o "select no mysql"
  console.log(cadastrosPendentes) //passo 2 fins didaticos (teste)
  //passo 3(slide) enviar ao renderer(view) as tarefas pendentes
  event.reply('pending-tasks', JSON.stringify(cadastrosPendentes))//JSON.stringify converte para o JSON
})



ipcMain.on('get-fornecedor', async (event, args) => {
  const cadastrosPendentes = await Fornecedor.find() //.find faz a busca e como o "select no mysql"
  console.log(cadastrosPendentes) //passo 2 fins didaticos (teste)
  //passo 3(slide) enviar ao renderer(view) as tarefas pendentes
  event.reply('pending-fornecedor', JSON.stringify(cadastrosPendentes))//JSON.stringify converte para o JSON
})

ipcMain.on('get-produto', async (event, args) => {
  const cadastrosPendentes = await Produto.find() //.find faz a busca e como o "select no mysql"
  console.log(cadastrosPendentes) //passo 2 fins didaticos (teste)
  //passo 3(slide) enviar ao renderer(view) as tarefas pendentes
  event.reply('pending-produto', JSON.stringify(cadastrosPendentes))//JSON.stringify converte para o JSON
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//CRUD Delete - excluir os dados do banco
//passo 2(slide) receber o pedido do renderer para excluir uma tarefa do banco de dados
ipcMain.on('delete-task', async (event, args) => {
  console.log(args) // teste de recebimentodo id (passo 2 slide)
  //exibir uma caixa de dialogo para confirma a exclusão
  const { response } = await dialog.showMessageBox(win, {
    type: 'warning',
    buttons: ['Cancelar', 'Excluir'],
    title: 'Confirmação de exclusão',
    message: 'Tem certeza que deseja excluir esta tarefa?'
  })
  console.log(response)// Apoio a Logica

  //passo 3 excluir a tarefa do banco e enviar uma resposta para o renderer
  if (response === 1) {
    const cadastroExcluido = await Cadastros.findByIdAndDelete(args)
    //passo 3 excluir a tarefa do banco e enviar uma resposta para o renderer atualizar a lista de tarefas pendentes
    event.reply('delete-task-success', JSON.stringify(cadastroExcluido))

  }
})

//Buscar um cliente especifico no banco de dados (Crud read)
//passo 3 recebimento do nome do cliente
ipcMain.on('search-client', async (event, nome) => {
  console.log(nome) //teste do passo 3
  //passo 4 - buscar o nome no banco de dados
  try {
    const dadosCliente = await Cadastros.find({
      nome: new RegExp(nome, 'i') //i ignore(letras maiuscula/minuscula)    
    })
    console.log(dadosCliente) //teste passo 4
    //validação (se não existir o cliente informar o usuario)
    if (dadosCliente.length === 0) {
      dialog.showMessageBox(winAbout, {
        type: 'question',
        message: 'Cliente não cadastrado.\nDeseja cadastrar este cliente?',
        buttons: ['Sim', 'Não']
      }).then((result) => {
        //verifica o botão pressionado (Sim = 0)
        // console.log(result)
        if (result.response === 0) {
          //setar o nome na caixa input
          event.reply('set-name')
        } else {
          //limpar a caixa input de busca
          event.reply('clear-search')
        }
      })

    } else {
      // se existir o cliente pesquisado, enviar os dados para o renderer (passo 5)
      event.reply('client-data', JSON.stringify(dadosCliente))
    }
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('sourch-alert', (event) => {
  dialog.showMessageBox(winAbout, {
    type: 'info',
    message: 'Preencha o nome do cliente',
    buttons: ['OK']
  })
  event.reply('search-focus')
})


//---------------------------------pesquisar fornecedor
ipcMain.on('search-fornecedor', async (event, empresa) => {
  console.log(empresa) //teste do passo 3
  //passo 4 - buscar o nome no banco de dados
  try {
    const dadosFornecedor = await Fornecedor.find({
      empresa: new RegExp(empresa, 'i') //i ignore(letras maiuscula/minuscula)    
    })
    console.log(dadosFornecedor) //teste passo 4
    //validação (se não existir o cliente informar o usuario)
    if (dadosFornecedor.length === 0) {
      dialog.showMessageBox(fornecedorCadastro, {
        type: 'question',
        message: 'Fornecedor não cadastrado.\nDeseja cadastrar este fornecedor?',
        buttons: ['Sim', 'Não']
      }).then((result) => {
        //verifica o botão pressionado (Sim = 0)
        // console.log(result)
        if (result.response === 0) {
          //setar o nome na caixa input
          event.reply('set-empresa')
        } else {
          //limpar a caixa input de busca
          event.reply('clear-search')
        }
      })

    } else {
      // se existir o cliente pesquisado, enviar os dados para o renderer (passo 5)
      event.reply('fornecedor-data', JSON.stringify(dadosFornecedor))
    }
  } catch (error) {
    console.log(error)
  }
})

//------------------------pesquisar produto------------------------------------------------------------

ipcMain.on('search-produto', async (event, produto) => {
  console.log(produto) //teste do passo 3
  //passo 4 - buscar o nome no banco de dados
  try {
    const dadosProdutos = await Produto.find({
      codigo: new RegExp(produto, 'i') //i ignore(letras maiuscula/minuscula)    
    })
    console.log(dadosProdutos) //teste passo 4
    //validação (se não existir o cliente informar o usuario)
    if (dadosProdutos.length === 0) {
      dialog.showMessageBox(produtos, {
        type: 'question',
        message: 'Produto não cadastrado.\nDeseja cadastrar este Produto?',
        buttons: ['Sim', 'Não']
      }).then((result) => {
        //verifica o botão pressionado (Sim = 0)
        // console.log(result)
        if (result.response === 0) {
          //setar o nome na caixa input
          event.reply('set-produto')
        } else {
          //limpar a caixa input de busca
          event.reply('clear-search')
        }
      })

    } else {
      // se existir o cliente pesquisado, enviar os dados para o renderer (passo 5)
      event.reply('produto-data', JSON.stringify(dadosProdutos))
    }
  } catch (error) {
    console.log(error)
  }
})



//Editar um cliente  - CRUD Update 

ipcMain.on('update-client', async (event, cliente) => {
  await console.log(cliente) // teste de recebimento do renderer
  //passo 3: salvar as alterações no banco de dados 17/04/2024
  const clienteEditado = await Cadastros.findByIdAndUpdate(
    cliente.id, {
    nome: cliente.nome,
    fone: cliente.fone,
    email: cliente.email,
    cpf: cliente.cpf,
    cep: cliente.cep,
    logradouro: cliente.logradouro,
    numero: cliente.numero,
    complemento: cliente.complemento,
    cidade: cliente.cidade,
    uf: cliente.uf,
    empresa: cliente.empresa,
    cnpj: cliente.cnpj

  },
    {
      new: true
    }
  )
  //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
  dialog.showMessageBox(winAbout, {
    type: 'info',
    message: "Dados do Cliente alterado com sucesso",
    buttons: ['OK']
  }).then((result) => {
    //verificar se o botão ok foi preenchido
    if (result.response === 0) {
      event.reply('udpate-success')
    } else {
      //limpar a caixa de busca 
      event.reply('clear-search')
    }
  })
})


//-----------------------FORNECEDOR----------------------------
ipcMain.on('update-fornecedor', async (event, fornecedor) => {

  await console.log(fornecedor) // teste de recebimento do renderer

  //passo 3: salvar as alterações no banco de dados 17/04/2024

  // Validação dos campos obrigatórios
  if (fornecedorCadastro.empresa === "") {
    dialog.showMessageBox(fornecedorCadastro, {
      type: "info",
      message: 'Preencha o nome da empresa, campo obrigatorio',
      buttons: ['ok']
    })
    return; // Não permitir a edição se o nome da empresa não estiver preenchido
  } else if (fornecedorCadastro.fone === "") {
    dialog.showMessageBox(fornecedorCadastro, {
      type: "info",
      message: 'Preencha o telefone, campo obrigatorio',
      buttons: ['ok']
    })
    return; // Não permitir a edição se o telefone não estiver preenchido
  } else {
  
  
      const fornecedorEditado = await Fornecedor.findByIdAndUpdate(
        fornecedor.id, {
        nome: fornecedor.nome,
        fone: fornecedor.fone,
        email: fornecedor.email,
        cpf: fornecedor.cpf,
        cep: fornecedor.cep,
        logradouro: fornecedor.logradouro,
        numero: fornecedor.numero,
        complemento: fornecedor.complemento,
        cidade: fornecedor.cidade,
        uf: fornecedor.uf,
        empresa: fornecedor.empresa,
        cnpj: fornecedor.cnpj,
        site: fornecedor.site
  
      },
        {
          new: true
        }
      )
    }
    //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
    dialog.showMessageBox(fornecedorCadastro, {
      type: 'info',
      message: "Dados do fornecedor alterado com sucesso",
      buttons: ['OK']
    }).then((result) => {
      //verificar se o botão ok foi preenchido
      if (result.response === 0) {
        event.reply('udpate-fornecedor-success')
      } else {
        //limpar a caixa de busca 
        event.reply('clear-search')
      }
    })
      
})




//----------------------------------------------EDITAR PRODUTO-----------------------------------------

ipcMain.on('update-produto', async (event, produto) => {
  console.log(produto) // teste de recebimento do renderer
  //passo 3: salvar as alterações no banco de dados 17/04/2024
  const produtoEditado = await Produto.findByIdAndUpdate(
    produto.id, {
    empresa: produto.empresa,
    codigo: produto.codigo,
    produto: produto.produto,
    estoque: produto.estoque,
    valor: produto.valor

  },
    {
      new: true
    }
  )
  console.log(produtoEditado)
  //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
  dialog.showMessageBox(produtos, {
    type: 'info',
    message: "Dados do produto alterado com sucesso",
    buttons: ['OK']
  }).then((result) => {
    //verificar se o botão ok foi preenchido
    if (result.response === 0) {
      event.reply('udpate-produto-success')
    } else {
      //limpar a caixa de busca 
      event.reply('clear-search')
    }
  })
})

//Excluir um cliente  - CRUD delete

ipcMain.on('excluir-client', async (event, cliente) => {
  await console.log(cliente) // teste de recebimento do renderer
  //passo 3: salvar as alterações no banco de dados 17/04/2024
  const clienteEditado = await Cadastros.findByIdAndDelete(
    cliente.id, {
    nome: cliente.nome,
    fone: cliente.fone,
    email: cliente.email,
    cpf: cliente.cpf,
    cep: cliente.cep,
    logradouro: cliente.logradouro,
    numero: cliente.numero,
    complemento: cliente.complemento,
    cidade: cliente.cidade,
    uf: cliente.uf,
    empresa: cliente.empresa,
    cnpj: cliente.cnpj


  },
    {
      new: true
    }
  )
  //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
  dialog.showMessageBox(winAbout, {
    type: 'warning',
    buttons: ['Cancelar', 'Excluir'],
    title: 'Confirmação de exclusão',
    message: 'Tem certeza que deseja excluir esta tarefa?'
  }).then((result) => {
    //verificar se o botão ok foi preenchido
    if (result.response === 1) {
      event.reply('excluir-success')
    } else {
      //limpar a caixa de busca 
      event.reply('clear-search')
    }
  })
})

ipcMain.on('excluir-fornecedor', async (event, fornecedor) => {
  await console.log(fornecedor) // teste de recebimento do renderer
  //passo 3: salvar as alterações no banco de dados 17/04/2024
  const fornecedorEditado = await Fornecedor.findByIdAndDelete(
    fornecedor.id, {
    empresa: fornecedor.empresa,
    fone: fornecedor.fone,
    email: fornecedor.email,
    cep: fornecedor.cep,
    logradouro: fornecedor.logradouro,
    numero: fornecedor.numero,
    complemento: fornecedor.complemento,
    cidade: fornecedor.cidade,
    uf: fornecedor.uf,
    cnpj: fornecedor.cnpj


  },
    {
      new: true
    }
  )
  //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
  dialog.showMessageBox(fornecedorCadastro, {
    type: 'warning',
    buttons: ['Cancelar', 'Excluir'],
    title: 'Confirmação de exclusão',
    message: 'Tem certeza que deseja excluir este fornecedor?'
  }).then((result) => {
    //verificar se o botão ok foi preenchido
    if (result.response === 1) {
      event.reply('excluir-success-fornecedor')
    } else {
      //limpar a caixa de busca 
      event.reply('clear-search')
    }
  })
})


//------------------------excluir produto----------------------------------

//Excluir um cliente  - CRUD delete

ipcMain.on('excluir-produto', async (event, produto) => {
  await console.log(produto) // teste de recebimento do renderer
  //passo 3: salvar as alterações no banco de dados 17/04/2024
  const produtoExcluido = await Produto.findByIdAndDelete(
    produto.id, {
    empresa: produto.empresa,
    codigo: produto.codigo,
    produto: produto.produto,
    estoque: produto.estoque,
    valor: produto.valor

  },
    {
      new: true
    }
  )
  //passo 4 confimar a exclusão e enviar ao renderer um pedido para limpar os campos  e setar os botões
  dialog.showMessageBox(produtos, {
    type: 'warning',
    buttons: ['Cancelar', 'Excluir'],
    title: 'Confirmação de exclusão',
    message: 'Tem certeza que deseja excluir este Produto?'
  }).then((result) => {
    //verificar se o botão ok foi preenchido
    if (result.response === 1) {
      event.reply('excluir-success-produto')
    } else {
      //limpar a caixa de busca 
      event.reply('clear-search')
    }
  })
})

//acessar site
ipcMain.on('site-url', async (event, url) => {
  console.log(url);
  shell.openExternal(url)
})


//codigo de barras 10/05/2024
// Receber barcode //codigo de barra 10/05/2024
ipcMain.on('search-barcode', (event, barcode) => {
  console.log(barcode)
})
