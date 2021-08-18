const postsControlador = require('./posts-controlador');
const passport = require('passport');


module.exports = app => {
    app
        .route('/post')
        .get(
            postsControlador.lista
        )
        .post(
            /*Função utilizada para a autenticação local de dados,
            passando via parâmetro a estratégia usada, no caso local
            e as sessões não utilizadas 'false'
            */
            passport.authenticate('bearer', { session: false }),
            postsControlador.adiciona);
};