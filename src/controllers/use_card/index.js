const knex = require('../../database/index')


module.exports = {
  async useCard(req, res) {
    const { user_CPF: cpf } = req.body;

    try {
      const requestCards = await knex("request_card").where("user_user_CPF", "=", cpf);
      if (!requestCards || requestCards.length === 0) {
        return res.status(400).json({ error: 'Sem requisições de cartão' });
      }

      const reqIds = requestCards.map(card => card.req_id);
      const cards = await knex("card").whereIn("request_card_req_id", reqIds);
      if (!cards || cards.length === 0) {
        return res.status(400).json({ error: 'Sem cartões' });
      }

      const ids = cards.map(card => card.card_id);
      const validations = await knex("validation_card").whereIn("card_card_id", ids).orderBy("val_horario", "desc");
      if (!validations || validations.length === 0) {
        return res.status(400).json({ error: 'Sem validações' });
      }

      const idsvalturn = validations.map(val => val.turn_bus_turn_id);
      const turnos = await knex("turn_bus").whereIn("turn_id", idsvalturn);
      if (!turnos || turnos.length === 0) {
        return res.status(400).json({ error: 'Sem turnos' });
      }

      const busIds = turnos.map(turno => turno.buss_bus_id);
      const buses = await knex("buss").whereIn("bus_id", busIds);
      if (!buses || buses.length === 0) {
        return res.status(400).json({ error: 'Sem ônibus' });
      }

      const routeIds = buses.map(bus => bus.bus_route_rote_id);
      const routes = await knex("bus_route").whereIn("rote_id", routeIds);
      if (!routes || routes.length === 0) {
        return res.status(400).json({ error: 'Sem rotas' });
      }

      // Agora, crie um objeto com as informações desejadas para cada validação
      const validationsWithInfo = validations.map(val => {
        const turn = turnos.find(turno => turno.turn_id === val.turn_bus_turn_id);
        const bus = buses.find(buss => buss.bus_id === turn.buss_bus_id);
        const route = routes.find(route => route.rote_id === bus.bus_route_rote_id);

        const dataCombination = val.val_horario;
        const data = new Date(dataCombination);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear().toString();
        const dataFormatada = `${dia}-${mes}-${ano}`;

        const data_hora_obj = new Date(val.val_horario);
        const hora = data_hora_obj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return {
          val_horario: hora,
          val_data: dataFormatada,
          val_gasto: val.val_gasto,
          card_card_id: val.card_card_id,
          route_num: route ? route.route_num : null,
          route_nome: route ? route.route_nome : null,
        };
      });

      const sortedValidationsWithInfo = validationsWithInfo.sort((a, b) => {
        // Converta as datas de string de volta para objetos Date
        const dateA = new Date(a.val_data);
        const dateB = new Date(b.val_data);

        // Compare as datas para classificar em ordem decrescente (mais recente para mais antigo)
        return dateB - dateA;
      });
      

      console.log(validationsWithInfo);
      console.log(sortedValidationsWithInfo);

      return res.status(200).json(sortedValidationsWithInfo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

}