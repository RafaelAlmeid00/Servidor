
const express = require('express');
const cookie = require('cookie-parser');
const cors = require('cors'); // Importe o cors

//controllers
const controllersUser = require('./controllers/user/index');
const controllersBussines = require('./controllers/bussines/index');
const controllerListCPF = require('./controllers/list_CPF/index');
const controllersSac = require('./controllers/sac/index');
const controllersRequestCard = require('./controllers/request_card/index');
const controllerBusRoute = require('./controllers/buss_route/index');
const controllerBuss = require('./controllers/buss/index');
const controllerStop = require('./controllers/bus_stop/index');
const controllerTurn = require('./controllers/turn_bus/index');
const controllerDriver = require('./controllers/driver_bus/index');
const controllerMessage = require('./controllers/sac_message/index')
const othersRec_Pass = require('./others/rec_pass')
const controllerCardEnvio = require('./controllers/card/index')
const controllerValidation = require('./controllers/validation_card/index')

const middleware = require('./controllers/Middleware');
const RecMid = require('./others/rec_mid');

const routes = express.Router();

routes.use(cookie());
routes.use(cors());

routes.post('/user', controllersUser.root);
routes.post('/user', controllersUser.createUser);
routes.post('/user/login', controllersUser.UserLogin);
routes.post('/user/email', controllersUser.searchUserEmail);
routes.post('/user/cpf', controllersUser.searchUserCPF);
routes.post('/user/returnfundo', controllersUser.returnFundo);
routes.post('/user/returnperfil', controllersUser.returnPerfil);
routes.post('/user/validatetoken', controllersUser.validateToken);

//recuperação de conta:
routes.post('/user/login/PassRec', othersRec_Pass.EmailRec);
routes.post('/user/login/Rec', othersRec_Pass.compareEmail);


routes.post('/bussines', controllersBussines.createBussines);
routes.get('/bussines', controllersBussines.searchBussines);
routes.post('/bussines/email', controllersBussines.searchBussinesEmail);

routes.post('/listcpf', controllerListCPF.createListCpf);
routes.delete('/listcpf/:CNPJ', controllerListCPF.listcpfDelete);
routes.get('/listcpf', controllerListCPF.searchListCpf);
routes.post('/listcpf/search', controllerListCPF.searchCpf);


//👇 middlleware pra uma maior proteção do sistéma 👇
routes.use(middleware.mid);
routes.post('/user/delete', controllersUser.DeleteUser);
routes.post('/user/update', controllersUser.UpdateUser);
routes.post('/user/token', controllersUser.UpdateToken);
routes.post('/user/fundoupload', controllersUser.uploadImage);
routes.post('/user/perfilupload', controllersUser.uploadImagePerfil);
routes.post('/user/updateemail', controllersUser.sendEmail);

routes.get('/bussines/search/:CNPJ', controllersBussines.SpecificBussines)
routes.delete('/bussines/:CNPJ', controllersBussines.deleteBussines);

routes.get('/buss', controllerBuss.searchBuss)
routes.post('/buss', controllerBuss.cadBuss);
routes.put('/buss', controllerBuss.attBuss);

routes.post('/card', controllersRequestCard.CadReqCard);
routes.get('/card', controllersRequestCard.searchReqCard);
routes.post('/card/search', controllersRequestCard.searchReqCPF);
routes.post('/card/envio', controllerCardEnvio.cadCard);
routes.post('/card/enviados', controllerCardEnvio.searchCard);
routes.delete('/card/delete', controllerCardEnvio.exclCard);
routes.post('/card/cancelados', controllerCardEnvio.searchCardCancel);

routes.post('/routes/all', controllerBusRoute.searchBusGeral);
routes.post('/routes', controllerBusRoute.cadRoutes);
routes.put('/routes', controllerBusRoute.attRoutes);
routes.delete('/routes', controllerBusRoute.excldRoutes);
routes.post('/routes/search', controllerBusRoute.consultRoute);


routes.delete('/buss', controllerBuss.exlcdBuss);
routes.post('/buss/stop', controllerStop.cadStop);
routes.put('/buss/stop', controllerStop.attStop);
routes.delete('/buss/stop', controllerStop.exlcdStop);

routes.post('/turn', controllerTurn.cadTurn);
routes.delete('/turn', controllerTurn.exlcdTurn);

routes.post('/driver', controllerDriver.cadDriver);
routes.delete('/driver', controllerDriver.attDriver);


routes.post('/sac', controllersSac.CadSac);
routes.get('/sac', controllersSac.Search);

routes.post('/message', controllerMessage.CadMessage);
routes.get('/message', controllerMessage.SearchMessage)

routes.post('/validation', controllerValidation.cadVal)
routes.post('/validation/search', controllerValidation.searchVal);
routes.post('/validation', controllerValidation.searchValAll);
routes.delete('/validation', controllerValidation.deleteVal);

module.exports = routes;