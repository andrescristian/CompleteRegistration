const {model, Schema } =  require ('mongoose')


//vamos criar um obejto -> modelo para coleção
//Importante:
const fornecedorSchema =  new Schema({
    empresa:{
        type:String
      },
    telefone:{
      type: String
    },
    email:{
      type: String
    },
    inscricao:{
      type: String
    },
    contato:{
      type: String
    },
    site:{
      type:String
    },
    cnpj:{
      type: String
      },
    cep: {
      type: String
    },
    logradouro:{
      type: String
    },
    numero:{
      type: String
    },
    complemento:{
      type: String
    },
    bairro:{
      type: String
    },
    cidade:{
      type: String
    },
    uf:{
      type: String
    }
    
    
  })

  //exportar o Schema -> main 
module.exports = model('Fornecedor', fornecedorSchema)

