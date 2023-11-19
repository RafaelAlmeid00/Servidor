const knex = require("../../database/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const dotenv = require('dotenv');

module.exports = {

    async TesteToken(req, res) {
        try {
            console.log('Testando token');
            res.status(201).json({ message: 'Token valido', data: req.body });
        } catch (error) {
            console.log('error: ', error);
            return res.status(400).json({ error: error.message });
        }
    },

    async Admlogin(req, res) {
        dotenv.config()
        console.log('this is dotenv: ', dotenv);
        const { email: email } = req.body;
        const { password: password } = req.body;

        const [Email] = await knex('admin').where('adm_email', '=', email);
        console.log('this is email: ', Email);
        console.log('this is password: ', password);
        if (Email != undefined) {
            bcrypt.compare(password, Email.adm_senha, (err, call) => {
                if (err || call == false) {
                    console.log('this is err: ', err);
                    console.log('this is call: ', call);
                    res.status(401).send('erro burro burro macaco');
                } else {
                    console.log('this is call: ', call);
                    var token = jwt.sign({
                        adm_nome: Email.adm_nome,
                        adm_email: Email.adm_email,
                        adm_id: Email.adm_id,
                        adm_level: Email.adm_level
                    }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    res.status(201).json({ token: token });
                }
            })
        } else {
            res.status(401).send('senha ou email errado')
        }

    },

    async Empresalogin(req, res) {
        dotenv.config()
        console.log('this is dotenv: ', dotenv);
        const { cnpj: cnpj } = req.body;
        const { password: password } = req.body;

        const [CNPJ] = await knex('bussines').where('buss_CNPJ', '=', cnpj);
        console.log('this is email: ', CNPJ);
        console.log('this is password: ', password);
        if (CNPJ != undefined) {
            bcrypt.compare(password, CNPJ.buss_senha, (err, call) => {
                if (err || call == false) {
                    console.log('this is err: ', err);
                    console.log('this is call: ', call);
                    res.status(401).send('erro burro burro macaco');
                } else {
                    console.log('this is call: ', call);
                    var token = jwt.sign({
                        buss_CNPJ: CNPJ.buss_CNPJ,
                        buss_nome: CNPJ.buss_nome,
                        buss_contato: CNPJ.buss_contato,
                        buss_FotoPerfil: CNPJ.buss_FotoPerfil,
                        buss_endCEP: CNPJ.buss_endCEP,
                        buss_endUF: CNPJ.buss_endUF,
                        buss_endrua: CNPJ.buss_endrua,
                        buss_endnum: CNPJ.buss_endnum,
                        buss_endcomplemento: CNPJ.buss_endcomplemento,
                        buss_endcidade: CNPJ.buss_endcidade,
                        buss_tipo: CNPJ.buss_tipo,
                        buss_status: CNPJ.buss_status
                    }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    res.status(201).json({ token: token });
                }
            })
        } else {
            res.status(401).send('senha ou email errado')
        }

    }

};