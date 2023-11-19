const knex = require("../../database/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const dotenv = require('dotenv');

module.exports = {
    async Admlogin(req, res) {
        dotenv.config()
        console.log('this is dotenv: ', dotenv);
        const {email: email} = req.body;
        const {password: password} = req.body;
        
        const [Email] = await knex('admin').where('adm_email', '=', email);
        console.log('this is email: ', Email);
        console.log('this is password: ', password);
        if (Email != undefined) {
            await bcrypt.compare(password, Email.adm_senha, (err, call) =>{
                if (err || call == false) {
                    console.log('this is err: ', err);
                    console.log('this is call: ', call);
                    res.status(401).send('erro burro burro macaco')
                }else{
                console.log('this is call: ', call);
                var token = jwt.sign({
                    Name: Email.adm_nome,
                    Email: Email.adm_email,
                    adm_id: Email.adm_id,
                    adm_level: Email.adm_level
                }, process.env.JWT_SECRET, { expiresIn: '7d' });
                res.status(201).json({token: token});}
            })
        }else{
            res.status(401).send('senha ou email errado')
        }

    }

};