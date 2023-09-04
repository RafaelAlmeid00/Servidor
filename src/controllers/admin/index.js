const knex = require("../../database/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
module.exports = {
    async Admlogin(req, res) {
        dotenv.config()
        const {email: email} = req.body;
        const {password: password} = req.body;

        const Email = await knex('admin').where('adm_email', '=', email);
        console.log('this is email: ', Email);
        if (Email != undefined) {
            bcrypt.compare(password, email.adm_senha, (call, err) =>{
                if (err || call == false) {
                    console.log('this is err: ', err);
                }else
                var token = jwt.sign({
                    Name: Email.adm_nome,
                    Email: Email.adm_email
                }, process.env.JWT_SECRET, { expiresIn: '7d' });

                res.status(201).json({token: token});
            })
        }

    }

};