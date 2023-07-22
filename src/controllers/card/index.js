const knex = require("../../database/index");

module.exports = {
      async searchCard(req, res) {
        try {
            const result = await knex("card");
            res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

async cadCard(req, res) {
  const { card_saldo: saldo } = req.body;
  const { card_status: status } = req.body;
  const { request_card_req_id: id } = req.body;

  try {
    const takeReq = await knex("request_card").where("req_id",'=', id);
    if (takeReq) {
        if (takeReq.length > 0) {
  const type = takeReq[0].req_TipoCartao; // Acessa o primeiro elemento do array
        console.log(type);
        console.log(takeReq);
     function formatDateToYYYYMMDD(date) {
            const yeartake = date.getFullYear();
            const year = yeartake + 5;
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        }
        const currentDate = new Date();
        const date = formatDateToYYYYMMDD(currentDate);
        const config = {card_validade: date, card_saldo: saldo, card_tipo: type, card_status: status, request_card_req_id: id}
        console.log(config);
    const cardcadastrado = await knex("card").insert(config);
    res.status(200).send('Cadastrado Cartão');
    if (cardcadastrado) {
        function formatDateToYYYYMMDD2(date) {
            const year2 = date.getFullYear();
            const month2 = String(date.getMonth() + 1).padStart(2, '0');
            const day2 = String(date.getDate()).padStart(2, '0');

            return `${year2}-${month2}-${day2}`;
        }
        const currentDate2 = new Date();
        const date2 = formatDateToYYYYMMDD2(currentDate2);

        const update = {req_envio: date2}
        await knex("request_card").update(update);
        res.status(200).send('Pedido de Cartão fechado');
        } else {
  return res.status(400).json({ error: "Nenhum registro encontrado com o ID fornecido." });
}
    } else {
            return res.status(400).json({ error: error.message });
    }
    } else{
            return res.status(400).json({ error: error.message });
    }

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
},
    async exclCard(req, res) {
        try {
            const { card_id: id } = req.body;
            //user_user_CPF: cpf, req_data: date,  req_data: env, req_TipoCartao: card
            await knex("card").delete({card_id: id});
            res.status(201).send('Excluido!');
        } catch (error) {
            res.status(400).send('deu ruim!');
            console.log(error);
        }
    },
}