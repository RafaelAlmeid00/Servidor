const knex = require("../../database/index");

module.exports = {
    async searchUserCPF(socket, data) {
  
  try {
    console.log('this is socket: ', socket);
    const takeCPF = await knex("user").where("user_CPF", "=", data).first();

    if (!takeCPF) {
      return res.status(404).json({ error: "CPF não encontrado." });
    }

    socket.emit("userDetails", takeCPF)
    console.log(takeCPF);
  } catch (error) {
      socket.emit("userDetails", error)
        console.log(error.message);
  }
},

  async searchCardAtivo(socket, data) {
    try {
      const requestCards = await knex("request_card").where("user_user_CPF", "=", data);
      const reqIds = requestCards.map(card => card.req_id);
      const activeCards = await knex("card").whereIn("request_card_req_id", reqIds).where("card_status", "=", "ativo");

      console.log(requestCards);
      console.log(reqIds);

      socket.emit("cardDetails", activeCards)
      console.log(activeCards);

    } catch (error) {
      socket.emit("cardDetails", error)
      console.log(error.message);
    }
  },

  async messageToadm(socket, mensage, data) {
    try {
      console.log('this is dataa: ', data);
      const idgenerated = require('uniqid');
      
      const income = idgenerated.time();
      console.log('thi is income: ', income);

      //tá naquele padrão doidão lá YYYY-MM-DD
      var currentdate = new Date();
      console.log('time: ', currentdate);
      const [verify] = await knex('sac').where('user_user_CPF', '=', data);
      console.log('this is verify: ', verify);
      if (verify != undefined) {
        //sac já existe
        const idmen = await knex('sac_message').where('sac_sac_ticket', '=', verify.sac_ticket).orderBy('sacmen_id', 'asc');

        console.log('this is idmen: ', idmen);
        
        var lastId = idmen.length - 1;
        const NewId = idmen[lastId].sacmen_id + 1;
        
        console.log('this is id and last: ', NewId, lastId);
        console.log('this is user_user_cpf: ', verify.user_user_CPF);
        await knex('sac_message').insert({
          sac_sac_ticket: verify.sac_ticket,
          user_user_CPF: verify.user_user_CPF,
          sac_data: currentdate,
          sacmen_texto: mensage,
          sacmen_id: NewId
        })

        const reload = await knex('sac_message').where('sac_sac_ticket', '=', verify.sac_ticket).orderBy('sacmen_id', 'asc');
        socket.emit("userMensage", reload);
      }else{
        //iniciar sac
        await knex('sac').insert({
          sac_ticket: income,
          user_user_CPF: data

        });
        
        console.log('this is sac_ticket', income);

        await knex('sac_message').insert({
          sac_sac_ticket: income,
          sac_data: currentdate,
          sacmen_texto: mensage,
          sacmen_id: 1,
          user_user_cpf: data});

        const initialMsg = await knex('sac_message').where('sac_sac_ticket', '=', income).orderBy('sacmen_id', 'asc');
        console.log('this is initial: ', initialMsg);
        socket.emit("userMensage", initialMsg);

        }
    } catch (error) {
      console.log(error.message);
    }
  },

  async messageTouser(socket, mensage, data){
    
  }

}