const knex = require("../../database/index");

module.exports = {
  async searchCard(req, res) {
    const { user_CPF: list_CPF } = req.body;
    console.log(list_CPF)
  
    try {
      // Passo 1: Pesquisar todas as tuplas com o user_CPF fornecido na tabela 'request_card'.
      const takeCPF = await knex("request_card").where("user_user_CPF", list_CPF);
      console.log(takeCPF)
  
      if (takeCPF.length === 0) {
        return res.status(200).json({ error: 'Sem pedidos' });
      }
  
      // Passo 2: Extrair todos os valores de req_id das tuplas retornadas.
      const reqIds = takeCPF.map((item) => item.req_id);
      console.log(reqIds)
  
      // Passo 3: Pesquisar na tabela 'card' usando os reqIds obtidos e filtrar por 'card_status' = "ativo".
      const activeCards = await knex("card").whereIn("request_card_req_id", reqIds).andWhere("card_status", "ativo");
      if (activeCards.length === 0) {
        return res.status(200).json({ error: 'Sem cards ativos' });
      }
      // Passo 4: Registrar a lista de cartões ativos no servidor.
      console.log("Cartões Ativos:", activeCards);
  
      // Passo 5: Enviar a lista de cartões ativos para o front-end.
      res.status(201).json(activeCards);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  

  async searchCardCancel(req, res) {
    const { user_CPF: list_CPF } = req.body;
    console.log(list_CPF)

    try {
      // Passo 1: Pesquisar todas as tuplas com o user_CPF fornecido na tabela 'request_card'.
      const takeCPF = await knex("request_card").where("user_user_CPF", list_CPF);
      console.log(takeCPF)

      // Passo 2: Extrair todos os valores de req_id das tuplas retornadas.
      const reqIds = takeCPF.map((item) => item.req_id);
      console.log(reqIds)

      // Passo 3: Pesquisar na tabela 'card' usando os reqIds obtidos e filtrar por 'card_status' = "cancelado".
      const canceledCards = await knex("card").whereIn("request_card_req_id", reqIds).andWhere("card_status", "cancelado");

      // Passo 4: Registrar a lista de cartões cancelados no servidor.
      console.log("Cartões Cancelados:", canceledCards);

      // Passo 5: Enviar a lista de cartões cancelados para o front-end.
      res.status(200).send(canceledCards);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async cadCard(req, res) {
    const { card_saldo: saldo } = req.body;
    const { card_status: status } = req.body;
    const { request_card_req_id: id } = req.body;

    try {
      const takeReq = await knex("request_card").where("req_id", '=', id);
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

          let idcard = ''

          for (let i = 0; i < 16; i++) {
            const randomDigit = Math.floor(Math.random() * 10); // Gera um dígito aleatório entre 0 e 9
            idcard += randomDigit;
          }
          console.log(idcard);

          const config = { card_id: idcard, card_validade: date, card_saldo: saldo, card_tipo: type, card_status: status, request_card_req_id: id }
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

            const update = { req_envio: date2 }
            await knex("request_card").update(update);
            res.status(200).send('Pedido de Cartão fechado');
          } else {
            return res.status(400).json({ error: "Nenhum registro encontrado com o ID fornecido." });
          }
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
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
      await knex("card").delete({ card_id: id });
      res.status(201).send('Excluido!');
    } catch (error) {
      res.status(400).send('deu ruim!');
      console.log(error);
    }
  },
}