const passport = require('passport');
const { InvalidArgumentError } = require('../erros');

/*
Utilizada como interedidador do retorno da requisição
utilizada no login, replicando a execução padrão do 
metodo e customizando seu retorno
*/
module.exports = {
    /*Usada para acessar internamente o retorno 
    do objeto através da requisição */
    local: (req, res, next) => {
        passport.authenticate(
            'local', { session: false },
            (erro, usuario, info) => {

                /*Retorno validação mensagem retorno erro genérico*/
                if (erro && erro.name === 'InvalidArgumentError') {
                    return res.status(401).json({ erro: erro.mensage });
                }

                /*Validação de erros não tratados*/
                if (erro) {
                    return res.status(500).json({ erro: erro.mensage });
                }

                /*Validação usuário não informado*/
                if (!usuario) {
                    return res.status(401).json();
                }

                req.user = usuario;
                return next();
            }
        )(req, res, next);
    },
};