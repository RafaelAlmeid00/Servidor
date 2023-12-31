const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.token
const knex = require('../../database/index')
const listaPagamentos = [];

module.exports = {
  async createCliente(req, res) {
    const { cliente } = req.body;
    console.log(cliente);

    const apiUrl = 'https://api.asaas.com/v3/customers';

    const requestOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        access_token: token
      },
      body: JSON.stringify(cliente)
    };

    try {
      const response = await fetch(apiUrl, requestOptions);

      if (response.status === 200) {
        const responseData = await response.json();
        console.log('Cliente criado com sucesso:', responseData);

        res.status(200).json(responseData);
      } else {
        console.error('Erro ao criar cliente:', response.statusText);

        res.status(response.status).json({ error: 'Erro ao criar cliente' });
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error.message);

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async searchPayments(req, res) {
    const idcli = req.body.params.idcli;
    const query = req.body.params.tipo;
    let url

    console.log(req.headers['authorization'])
    console.log(req.body)
    console.log(idcli)
    console.log(query)

    if (!idcli) {
      return res.status(400).json({ message: 'ID do cliente ausente ou inválido' });
    }

    if (query == 'todos') {
      url = `https://api.asaas.com/v3/payments?customer=${idcli}&limit=100`;
    } else {
      url = `https://api.asaas.com/v3/payments?status=${query}&limit=100`;
    }

    console.log(url);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        access_token: token
      }
    };

    try {

      const response = await fetch(url, options);
      const pays = await response.json();
      res.status(200).json({ message: 'Pagamentos pego com sucesso', Pagamentos: pays });
    } catch (error) {
      console.log(error);
      console.error('Erro ao pegar pagamentos:', error);
      res.status(500).json({ message: 'Erro ao pegar pagamentos' });
    }
  },

  async searchCustomer(req, res) {
    const idcli = req.query.idcli;

    if (!idcli) {
      return res.status(400).json({ message: 'ID do cliente ausente ou inválido' });
    }

    const url = `https://api.asaas.com/v3/customers/${idcli}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        access_token: token
      }
    };

    try {
      const response = await fetch(url, options);
      const customer = await response.json();
      console.log('Cliente criado:', customer);
      console.log(customer.id);
      res.status(200).json({ message: 'Cliente pego com sucesso', cliente: customer });
    } catch (error) {
      console.log(error);
      console.error('Erro ao pegar cliente:', error);
      res.status(500).json({ message: 'Erro ao pegar cliente' });
    }
  },

  async createPay(req, res) {
    const { pagamento } = req.body;
    console.log('pag', pagamento);
    console.log('pag', JSON.stringify(pagamento));

    pagamento.dataCriacao = new Date();

    console.log(token)
    const url = 'https://api.asaas.com/v3/payments';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        access_token: token
      },
      body: JSON.stringify(pagamento)
    };

    try {
      const response = await fetch(url, options);
      const payment = await response.json();
      console.log('Pagamento criado:', payment);
      listaPagamentos.push({
        id: payment.id,
        status: payment.status,
        value: payment.value,
        dataCriacao: new Date(payment.dateCreated)
      });
      console.log(listaPagamentos);
      if (payment) {
        res.status(200).json({ message: 'Pagamento criado com sucesso', pagamento: payment });
      }

    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      res.status(500).json({ message: 'Erro ao criar pagamento' });
    }
  },

  async verifyPay(req, res) {
    const idcli = req.body.params.idcli;
    const { dataCard } = req.body.params;
    console.log(req.headers)
    console.log(req.body)
    console.log(idcli)
    console.log(dataCard)
    console.log(listaPagamentos);

    if (!idcli) {
      console.log('ID do cliente ausente ou inválido');
      return res.status(400).send({ message: 'ID do cliente ausente ou inválido' });
    }
    if (!dataCard) {
      console.log('Cartão do cliente ausente ou inválido');
      return res.status(400).send({ message: 'Cartão do cliente ausente ou inválido' });
    }
    if (listaPagamentos.length === 0) {
      console.log('Sem pagamentos a verificar');
      return res.status(400).send({ message: 'Sem pagamentos a verificar' });
    }

    console.log('foi aq1');
    const url = `https://api.asaas.com/v3/payments?customer=${idcli}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        access_token: token
      }
    };
    console.log('foi aq2');

    console.log('Pagamentos pendentes: ', listaPagamentos.length);


    try {
      const response = await fetch(url, options);
      const payments = await response.json();

      // Get the current date
      const currentDate = new Date();

      for (let i = 0; i < listaPagamentos.length; i++) {
        const serverPayment = listaPagamentos[i];
        for (const apiPayment of payments.data) {
          if (
            serverPayment.id === apiPayment.id &&
            serverPayment.status === 'PENDING' &&
            apiPayment.status === 'RECEIVED'
          ) {
            const cardToUpdate = await knex('card').where({ card_id: dataCard.card_id }).first();
            if (cardToUpdate) {
              await knex('card').where({ card_id: dataCard.card_id }).update({ card_saldo: cardToUpdate.card_saldo + apiPayment.value });
              console.log('Pagamento verificado:', apiPayment.id);

              // Check if the payment is older than 3 days
              const paymentCreationDate = new Date(serverPayment.dataCriacao);
              const daysDifference = (currentDate - paymentCreationDate) / (1000 * 60 * 60 * 24);
              if (daysDifference > 3) {
                // Remove the payment if it's older than 3 days
                listaPagamentos.splice(i, 1);
                i--;
                console.log('Pagamento removido (mais de 3 dias):', serverPayment.id);
              }
            }
            console.log('Pagamentos pendentes após verificação: ', listaPagamentos.length);
            res.status(200).json({ message: `Pagamento verificado: ${apiPayment.id}` });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      res.status(500).json({ message: 'Erro ao verificar pagamento' });
    }
  }
};
