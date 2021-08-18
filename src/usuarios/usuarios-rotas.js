const usuariosControlador = require('./usuarios-controlador');
const passport = require('passport');

module.exports = app => {
    app
        .route('/usuario')
        .post(
            usuariosControlador.adiciona
        )
        .get(
            usuariosControlador.lista
        );

    app.route('/usuario/:id')
        .delete(
            usuariosControlador.deleta
        );

    app.route('usuario/login')
        .post(
            /*Função utilizada para a autenticação local de dados,
            passando via parâmetro a estratégia usada, no caso local
            e as sessões não utilizadas 'false'
            */
            passport.authenticate(
                'local', { session: false }
            ), usuariosControlador.login
        );

};