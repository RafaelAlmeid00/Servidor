const knex = require('../../database/index');

module.exports = {
    async createCurriculo(req, res) {
        try {
            const {
                cur_CPF,
                cur_email,
                cur_nome_completo,
                cur_data_nasc,
                cur_pret_salarial,
                cur_num_filhos,
                cur_escolaridade,
                cur_cep,
                cur_cidade,
                cur_bairro,
                cur_rua_complemento,
                cur_numero,
                cur_uf,
                cur_detalhes_escolares,
                cur_detalhes_experiencia_profissional,
                cur_area_interesse,
                cur_ingles,
                cur_espanhol,
                cur_disponibilidade_viagem,
                cur_trabalho_noturno,
                cur_carteira_carro,
                cur_carteira_moto,
                cur_linkedin,
                cur_instagram,
                cur_github,
                cur_facebook,
                cur_foto_perfil,
                cur_con_prog,
                cur_cel
            } = req.body;

            console.log(req.body);

            await knex('curriculo').insert({
                cur_CPF,
                cur_email,
                cur_nome_completo,
                cur_data_nasc,
                cur_pret_salarial,
                cur_num_filhos,
                cur_escolaridade,
                cur_cep,
                cur_cidade,
                cur_bairro,
                cur_rua_complemento,
                cur_numero,
                cur_uf,
                cur_detalhes_escolares,
                cur_detalhes_experiencia_profissional,
                cur_area_interesse,
                cur_ingles,
                cur_espanhol,
                cur_disponibilidade_viagem,
                cur_trabalho_noturno,
                cur_carteira_carro,
                cur_carteira_moto,
                cur_linkedin,
                cur_instagram,
                cur_github,
                cur_facebook,
                cur_foto_perfil,
                cur_con_prog,
                cur_cel
            });

            res.status(201).send('Currículo cadastrado com sucesso!');
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        }
    },

    async getCurriculoByCPF(req, res) {
        try {
            const { cpf } = req.params;

            const curriculo = await knex('curriculo').where({ cur_CPF: cpf }).first();

            if (curriculo) {
                res.status(200).json(curriculo);
            } else {
                res.status(404).send('Currículo não encontrado');
            }
        } catch (error) {
            res.status(500).send('Erro interno do servidor');
            console.log(error);
        }
    }
};
