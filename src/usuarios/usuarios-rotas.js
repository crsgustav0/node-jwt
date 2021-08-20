const usuariosControlador = require('./usuarios-controlador');
const passport = require('passport');
const middlewaresAuth = require('./middlewares-auth')

module.exports = app => {
    app.
    route('usuario/login')
        .post(
            middlewaresAuth.local,
            usuariosControlador.login
        );

    app
        .route('/usuario')
        .post(
            usuariosControlador.adiciona
        )
        .get(
            usuariosControlador.lista
        );

    app.
    route('/usuario/:id')
        .delete(
            /*Função utilizada para a autenticação local de dados,
            passando via parâmetro a estratégia usada, no caso bearer
            e as sessões não utilizadas 'false'
            */
            passport.authenticate(
                middlewaresAuth.bearer,
            ), usuariosControlador.deleta
        );

};