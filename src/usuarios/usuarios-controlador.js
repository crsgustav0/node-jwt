const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');

const jwt = require('jsonwebtoken')

/*
Função utilizada para gerar o TOKEN 
de autenticação das demais rotas a partir
do Login
*/
function gerarTokenJWT(usuario) {
    /*Cria a parte inicial do Token a partir do seu id, 
    recibido via parâmetro*/
    const payload = { id: usuario.id }

    /*Valida a assinatura passada via recebimento do 
    cabeçalho da autenticação 'payload' e sua senha
    gerada por parte do servidor 'senha-secreta'*/
    const token = jwt.sign(payload, 'senha-secreta')

    return token;
}

module.exports = {
    adiciona: async(req, res) => {
        const { nome, email, senha } = req.body;

        try {
            const usuario = new Usuario({
                nome,
                email
            });

            await usuario.criarSenha(senha);

            await usuario.adiciona();

            res.status(201).json();
        } catch (erro) {
            if (erro instanceof InvalidArgumentError) {
                res.status(422).json({ erro: erro.message });
            } else if (erro instanceof InternalServerError) {
                res.status(500).json({ erro: erro.message });
            } else {
                res.status(500).json({ erro: erro.message });
            }
        }
    },

    login: (req, res) => {
        /*Gera o token de autenticação a partir da 
        finalização da operação de Login*/
        const token = gerarTokenJWT(req.user)

        /*Na resposta obtida a partir da requisição,
        retorna via cabeçalho o token gerado*/
        res.set('Authorization', token)
        res.status(204).send();
    },

    lista: async(req, res) => {
        const usuarios = await Usuario.lista();
        res.json(usuarios);
    },

    deleta: async(req, res) => {
        const usuario = await Usuario.buscaPorId(req.params.id);
        try {
            await usuario.deleta();
            res.status(200).send();
        } catch (erro) {
            res.status(500).json({ erro: erro });
        }
    }
};