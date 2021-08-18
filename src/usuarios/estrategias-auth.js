const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

/*
Importa o modelo Usuarios para utilizar,
retornar dados a partir dos métodos próprios
*/
const Usuario = require('./usuarios-modelo')

/*
Importa o modelo utilizado para retorno de 
validações genéricas
*/
const { InvalidArgumentError } = require('../erros')

/*
Importa a biblioteca bcrypt para validação das senhas
*/
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/*
Função criada para centralizar validações
referente ao usuário 
*/
function validarUsuario(usuario) {
    if (!usuario) {
        throw new InvalidArgumentError('Usuário a partir do e-mail não encontrado');
    }

}

/*
Função criada para centralizar validações
referente ao campo senha
*/
async function validarSenha(senha, senhaHash) {
    /*
    Comparação das senhas enviadas via requisição,
    retornando a partir da execução uma 'promisse'
    */
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
        throw new InvalidArgumentError('E-mail ou senha inválidos')
    }
}

/*

Método utilizado na configuração de novas estratégias de
autenticação, passando via parâmetro o objeto que será 
utilizado e a função responsável pela validação

done - usado para o retorno a partir da autenticação 
passando via parâmetros os campos utilizados 

*/
passport.use(
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'senha',
            /*Login sem sessões*/
            session: false

        },
        /*

        Async - Adicionado a função devido ao recebimento da resposta via 'promisse' através da função 'await'

        */
        async(email, senha, done) => {
            try {
                /*
            
                    Realiza a busca de registros passando via parâmetro
                    o campo email, recibido a partir da requisição
            
                    */
                const usuario = await Usuario.buscaPorEmail(email);
                /*Validações referentes aos campos 
                chave para autenticação*/
                validarUsuario(usuario);
                await validarSenha(senha, usuario.senhaHash);

                /*Finaliza a autenticação dos dados, retornando via
                'callback' erros não encontrados (nulos) e 
                o usuário autenticado*/
                done(null, usuario)
            } catch (error) {
                done(error);
            }
        }),

    passport.use(
        new BearerStrategy(
            async(token, done) => {
                try {
                    /*Função utilizada para verificar a confiabilidade da autenticação,
                    passando via parâmetro seu token de acesso e chave de assinatura
                    interna do servidor*/
                    const payload = jwt.verify(token, process.env.CHAVE_JWT);
                    /*Busca registros a partir do ID de autenticação
                    criado na autenticação*/
                    const usuario = await Usuario.buscaPorId(payload.id);
                    /*Finaliza a autenticação dos dados, retornando via
                    'callback' erros não encontrados (nulos) e 
                    o usuário autenticado*/
                    done(null, usuario)
                } catch (error) {
                    done(error);
                }
            }
        )),
)