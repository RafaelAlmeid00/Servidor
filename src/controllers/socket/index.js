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
        console.log(error);
  }
},

}