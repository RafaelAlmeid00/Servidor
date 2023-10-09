const knex = require("../../database/index");

module.exports = {
    async CadMessage(req, res) {
        try {
            const { sacmen_texto: txt } = req.body;
            const { admin_adm_id: admId } = req.body;
            const { user_user_CPF: cpf } = req.body;
            const { sac_sac_ticket: ticket } = req.body;
            
            await knex("sac_message").insert({ sacmen_texto: txt , admin_adm_id: admId, user_user_CPF: cpf, sac_sac_ticket: ticket });

            res.status(201).send('mensagem envidada!');
        } catch (error) {
            console.log(error);
            res.status(400).send('deu ruim!');
        }
    },
    async SearchMessage(req, res) {
        try {
            const { sac_sac_ticket: ticket } = req.body;

            const take = await knex("sac_message").where('sac_sac_ticket', "=", ticket)
            console.log(take);
            res.status(201).send(take);
        } catch (error) {
            res.status(400).send('deu ruim!');
            console.log(error);
        }
    },  
    async admSac (req, res){
        try {
            var perfil = []
            const take = await knex("sac_message").select('sac_sac_ticket', 'sacmen_texto', 'user_user_CPF', knex.raw('MAX(sacmen_id) as max_sacmen_id')).groupBy('sac_sac_ticket');
       
            for (let index = 0; index < take.length; index++) {
                const element = take[index];
               
                var [nextPhoto] = await knex('user').where('user_CPF', '=', element.user_user_CPF);
                
                
                perfil.push(nextPhoto);
            }
            res.status(201).json({'lastMen': take, 'perfil': perfil});
        } catch (error) {
            res.status(400).send('deu ruim!');
            console.log(error);
        }
    }
    
}