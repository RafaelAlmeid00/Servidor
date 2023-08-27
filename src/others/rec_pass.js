const knex = require('../database/index');
const nodemailer = require('nodemailer');
const encrypt = require('bcrypt');
const idgenerated = require('uniqid');
const dotenv = require('dotenv');
const JWT = require('jsonwebtoken');
const {mid} = require('./rec_mid')

module.exports = {

    async EmailRec(req, res) {
        try{
            dotenv.config();
            console.log(process.env);
            const {cpf: cpf} = req.body;
            const [email] = await knex('user').where('user_CPF', "=", cpf);
            var recipient = email.user_email;
            console.log("this is recipient: ", recipient);
            const income = idgenerated.time();
            
            const carga = await encrypt.hash(income, 10);
            console.log('this is carga: ', carga);
            console.log('this is user: ', process.env.USER);
            const Enterprise = nodemailer.createTransport({
                service: 'Gmail',
                type: 'OAuth2',
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                   },
            })
//93882392332 cpf teste
            const EnvTO = {
                from: process.env.USER,
                to: recipient,
                subject: 'seu código de recuperação é',
                text: income,
              };

            Enterprise.sendMail(EnvTO, function(err, data) {
                if (err) {
                  console.log("Error " + err);
                } else {
                  console.log("Email sent successfully");
                }
              });

            //mandando o email censurado igual a microsoft faz, pro cara se orientar
            console.log('search: ', recipient.search('@gmail.com'));
            var search = recipient.search('@gmail.com') - 2;
            const censurado = recipient.slice(0, 2) + ('*'.repeat(search)) + '@gmail.com';
            console.log('this is censurado: ', censurado);
            
            const rec = await JWT.sign({
              carga: carga,
              email: censurado,
              verified: false
            }, process.env.JWT_SECRET, { expiresIn: '1000000' })

            res.status(201).json({RecToken: rec});
        }catch{
            res.status(401).send('errokkkkkk');
        }
    },

    async compareEmail(req, res){
        try{
            const {code: code} = req.body;
            var verified
            console.log('this is user code: ', code);
            const compare = await mid(req, res);
            console.log('this is compare carga: ', compare.carga);
            if (compare.carga != undefined) {
              encrypt.compare(code, compare.carga, async (err, comp) =>{
                if (err || comp == false) {
                  console.log(err);
                  console.log('errado');
                  verified = false
                  return res.status(401).send(err)
                }else
                 console.log('this is veredito: ', comp);
                 verified = true
                 const rec = await JWT.sign({
                  verified: verified
                }, process.env.JWT_SECRET, { expiresIn: '1000000' })
  
                console.log('take me to church: ', compare);
                res.status(201).json({RecToken: rec});
              });
            }else{
              console.log('erro, erro');
              
              res.status(401).send('error')
            }
            
           
        }catch(erro){console.log(erro); res.send(erro)}
    }
}
