/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const knex = require("../../database/index");
const { search } = require("../../routes");

module.exports = {
    async root(req, res) {
        try {
            return res.send("Response of Client Server");
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async SpecificBussines (req, res) {
        try {
            const { CNPJ: CNPJ } = req.params;
            const info = await knex("bussines").where('buss_CNPJ', '=', CNPJ);

            res.send(info);
        } catch (error) {
            console.log(error);
        }
    },

    async searchBussines(req, res) {
        try {
           
            const result = await knex("bussines");
            console.log('this is bussines', result);
            res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    
    async searchBussinesEmail(req, res) {
  const { buss_contato: email } = req.body;
  
  try {
    const takeEmail = await knex("bussines").where("buss_contato", "=", email).first();

    if (!takeEmail) {
      return res.status(404).json({ error: "E-mail não encontrado." });
    }

    res.status(200).send(takeEmail);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
},

    async createBussines(req, res) {

        try {
            const { buss_CNPJ: cnpj } = req.body;
            const { buss_nome: name } = req.body;
            const { buss_contato: contact } = req.body;
            const { buss_endCEP: cep } = req.body;
            const { buss_endUF: UF } = req.body;
            const { buss_endrua: street } = req.body;
            const { buss_endnum: num } = req.body;
            const { buss_endcomplemento: comp } = req.body;
            const { buss_endcidade: city } = req.body;
            const { buss_tipo: type } = req.body

        await knex("bussines").insert({
            buss_CNPJ: cnpj,
            buss_nome: name,
            buss_contato: contact,
            buss_endCEP: cep,
            buss_endUF: UF,
            buss_endrua: street,
            buss_endnum: num,
            buss_endcomplemento: comp,
            buss_endcidade: city,
            buss_tipo: type
        });
        return res.status(201).send("Bussines registered");
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
    },

    async deleteBussines(req, res) {
        try {
            const { CNPJ: CNPJ } = req.params;

            const result = await knex("bussines").where('buss_CNPJ', '=', CNPJ).del();
            res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    
};
