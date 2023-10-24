// Aprendendo as rotas Get - (Buscar informação no back-end), Post - (Criar informação no back-end), Put - (Atualizar informação no back-end), Delete - (Deletar informação no back-end )
const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const users = [] // armazenando os usuários

const checkUserId = (request, response, next) => { // Função do Middleware: Economizar código e deixa-lo mais inteligente

    const { id } = request.params // requisitando o id do usuário para localiza-lo

    const index = users.findIndex( user => user.id === id ) // localizando o usuário pelo id enviado atráves do route params

    if( index < 0 ) { // Retornando uma mensagem dizendo que o usuário não foi encontrado (Caso não tenha sido)
        return response.status(404).json( { message: "User not found" } )
    }

    request.userIndex = index // armazenando o usuário no request para envia-lo as rotas
    request.userId = id // armazenando o id no request para envia-lo as rotas

    next() // Continuando o fluxo da aplicação abaixo do middleware (Rodando as rotas)
}

//app.use(checkUserId) // Chamando o middleware

app.get( '/users', (request, response) => { // Função da rota: Retornar a lista de usuários
    return response.json(users) // retornando os usuários 
})

app.post( '/users', (request, response) => { // Função da rota: Criar um novo usuário contendo: id, name, age

    const { name, age } = request.body // requisitando informações do usuário que foram enviadas pelo body params
    
    const user = { id: uuid.v4(), name, age } // armazenando as informações do usuário para enviar ao array (users)

    users.push(user) // adicionando o usuário criado na lista(array) de usuários (users)

    return response.status(201).json(user) // retornando o usuário criado / retornando o status (201) - usuário criado
})

app.put( '/users/:id', checkUserId, (request, response) => { // Função da rota: Atualizar informações de usuários já existentes

    const { name, age } = request.body // requisitando informações do usuário que foram enviadas pelo body params para atualiza-las
    const index = request.userIndex // requisitando o usuário armazenado no request pelo Middleware
    const id = request.userId // requisitando o id armazenado no request pelo Middleware

    const updatedUser = { id, name, age } // armazenando as informações atualizadas do usuário

    users[index] = updatedUser // Enviando as novas informações ao usuário (Atualizando)

    return response.json(updatedUser) // Retornando o usuário com as informações atualizadas
})

app.delete( '/users/:id', checkUserId, (request, response) => { // Função da rota: Retornar a lista de usuários

    const index = request.userIndex // requisitando o usuário armazenado no request pelo Middleware

    users.splice(index, 1)  // deletando o usuário

    return response.status(204).json() // Retornando uma mensagem de sucesso (sem conteúdo) para avisar que o usuário foi deletado
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})