const knex = require('../../database/index');
const moment = require('moment');
const storage = multer.diskStorage({
    destination: './user/fundoperfil',
    filename: function (req, file, cb) {
        const uniqueFilename = uniqid() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage });
const fs = require('fs');

module.exports = {
    async createOrUpdateCurriculo(req, res) {
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

            // Verifique se a tupla já existe com o CPF fornecido
            const existingCurriculo = await knex('curriculo')
                .where({ cur_CPF })
                .first();

                console.log('curriculo existe: ', existingCurriculo);
            if (existingCurriculo) {
                // Se a tupla existir, atualize-a
                await knex('curriculo')
                    .where({ cur_CPF })
                    .update({
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

                res.status(200).send('Currículo atualizado com sucesso!');
            } else {
                // Se a tupla não existir, insira uma nova
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
            }
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
    },

    async uploadImagePerfil(req, res) {
        try {
            console.log('até aqui foi');
            const cpf = req.headers['cur_cpf'];
            console.log(cpf);

            upload.single('selectedImage')(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err);
                    return res.status(400).json({ error: 'Error uploading image.' });
                } else if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Unexpected error.' });
                }
                console.log(req.file); 

                if (!req.file) {
                    console.log({ error: 'No image file provided.' });
                    return res.status(400).json({ error: 'No image file provided.' });
                }
                console.log(req.file); 

                // Se chegou até aqui, o upload foi bem-sucedido.
                console.log('Arquivo recebido:', req.file); 
                console.log('foi');
                try {
                    console.log(req.file.filename);
                    console.log(req.file); 

                    await knex('curriculo').where('cur_CPF', '=', cpf).update({
                        cur_foto_perfil: req.file.filename, 
                    });

                    return res.json({ imageUrl: req.file.filename });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ error: 'Error uploading image.' });
                }
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error uploading image.' });
        }
    },

    async returnPerfil(req, res) {
        const { filename } = req.body;
        console.log(filename);

        if (!filename || typeof filename !== 'string') {
            return res.status(400).json({ error: 'O campo "filename" é inválido ou está faltando.' });
        }

        const imagePath = path.resolve(__dirname, '..', '..', '..', 'user', 'curriculoFoto', filename);
        console.log(imagePath);

        // Ler a imagem como um buffer
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error('Erro ao ler a imagem:', err);
                return res.status(500).json({ error: 'Erro ao ler a imagem.' });
            }

            // Definir o cabeçalho "Content-Type" corretamente para uma imagem JPG
            res.setHeader('Content-Type', 'image/jpeg');

            // Enviar o buffer da imagem na resposta
            res.end(data);
        });
    },
};
