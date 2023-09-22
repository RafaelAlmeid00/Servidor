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
      console.log('this is dataaaaaaaaaaaaaaaaaaaaaaa: ', data);
      const idgenerated = require('uniqid');
      
      const income = idgenerated.time();
      console.log('thi is income: ', income);

      //YYYY-MM-DD
      var currentdate = new Date();
      const {verify} = await knex('sac').where('user_user_CPF', '=', data);
      console.log(verify);
      if (verify.user_user_CPF != null) {
        await knex('sac_message').where('sac_ticket', '=', verify.sac_ticket)
      }else{

      const {sac} = await knex('sac').insert({
        sac_ticket: income,
        sac_data: currentdate,
        user_user_CPF: data
      })

      await knex('sac_message').insert({
        sac_ticket: sac.sac_ticket,
        
        user_user_cpf: data})

      }
      const bigcry = 'tão natural quanto a luz do dia';
      socket.emit("userMensage", bigcry);
    } catch (error) {
      console.log(error.message);
    }
  }
}