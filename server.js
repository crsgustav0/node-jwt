/*
Faz a configuração das variáveis de ambientes, 
tornando-as acessíveis para o projeto
como um todo
*/
require('dotenv').config()

const app = require('./app');
const port = 3333;
const db = require('./database');

const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`App listening on port ${port}`));