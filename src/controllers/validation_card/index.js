const knex = require('../../database/index')


module.exports = {

async cadVal(req, res) {
    //Fazendo ainda
  try {
    const validation = await knex("validation_card").insert();
    res.status(200).send({
      validation,
      message: 'ok'
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
},


    async searchVal (req, res) {
        try {
        const { user_CPF: cpf } = req.body;

        // Buscar na tabela request_card com user_user_CPF igual a user_CPF
        const requestCards = await knex("request_card").where("user_user_CPF", "=", cpf);
        
        // Criar um array com os req_id das request cards encontradas
        const reqIds = requestCards.map(card => card.req_id);
        
        // Buscar na tabela card os cartões onde request_card_req_id está no array de reqIds e card_status é igual a 'ativo'
        const activeCards = await knex("card").whereIn("request_card_req_id", reqIds).where("card_status", "=", "ativo");
        
        res.status(201).json(activeCards); // Envia os cartões ativos como resposta
        
    } catch (error) {
        res.status(401).send(error);
        console.log(error);
    }
},

    async deleteVal (req, res){
        try {
            const { val_id: id } = req.body;

            await knex("validation_card").where("val_id", "=", id).del();
            res.status(201).send("executamos os caras!");
        } catch (error) {
            res.status(401).send(error);
            console.log(error);
        }
    }
}