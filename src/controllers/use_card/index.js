const knex = require('../../database/index')


module.exports = {

  async useCard(req, res) {
    const { user_CPF: cpf } = req.body;

    try {
      const requestCards = await knex("request_card").where("user_user_CPF", "=", cpf);
      const reqIds = requestCards.map(card => card.req_id);
      const cards = await knex("card").whereIn("request_card_req_id", reqIds);
      console.log('cartoes', cards);
      const ids = cards.map(card => card.card_id);
      console.log('ids', ids);
      if (ids) {
        const validations = await knex("validation_card").whereIn("card_card_id", ids);
        console.log('vals', validations);
        if (validations) {
          res.status(200).send({
            validations
          });
        } else {
          return res.status(400).json({ error: 'Sem validações' });
        }
      } else {
        return res.status(400).json({ error: 'Sem cartões' });
      }
      
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

}