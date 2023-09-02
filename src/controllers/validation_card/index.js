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
        const requestCards = await knex("request_card").where("user_user_CPF", "=", cpf);
        const reqIds = requestCards.map(card => card.req_id);
        const activeCards = await knex("card").whereIn("request_card_req_id", reqIds).where("card_status", "=", "ativo");
        
        console.log(requestCards);
        console.log(reqIds);
        console.log(activeCards);

        res.status(201).json(activeCards);
        
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