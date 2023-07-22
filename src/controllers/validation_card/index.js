const knex = require('../../database/index')

module.exports = {

    async searchValAll(req, res) {
        try {
            const result = await knex("validation_card");
            res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

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
            const { val_id: id } = req.body;
           
            await knex("validation_card").where("val_id", "=", id);
            res.status(201).send('cadastrado!');
            
        } catch (error) {
            res.status(401).send(error)
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