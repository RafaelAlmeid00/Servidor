const knex = require("../../database/index");

module.exports = {
    async searchUserCPF(socket, data) {
  
  try {
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

}