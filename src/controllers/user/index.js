const knex = require("../../database/index");
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const uniqid = require('uniqid');
const path = require('path');
const storage = multer.diskStorage({
  destination: './user/fundoperfil',
  filename: function (req, file, cb) {
    const uniqueFilename = uniqid() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});
const upload = multer({ storage });

const storage2 = multer.diskStorage({
  destination: './user/perfil',
  filename: function (req, file, cb) {
    const uniqueFilename = uniqid() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});
const upload2 = multer({ storage: storage2 });


console.log(storage2, upload2);

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();


module.exports = {
    async root(req, res) {
        try {
            return res.send("Response of Client Server");
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async searchUser(req, res) {
        try {
            console.log('aaaaaaaaaaaaaaaa');
            const result = await knex("user");
            res.status(201).json(result);
        } catch (error) {
            console.log('error: ', error);
            return res.status(400).json({ error: error.message });
        }
    },
    
async searchUserEmail(req, res) {
  const { user_email: email } = req.body;
  
  try {
    const takeEmail = await knex("user").where("user_email", "=", email).first();

    if (!takeEmail) {
      return res.status(404).json({ error: "E-mail não encontrado." });
    }

    res.status(200).send(takeEmail);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
},

async searchUserCPF(req, res) {
  const { user_CPF: cpf } = req.body;
  
  try {
    const takeCPF = await knex("user").where("user_CPF", "=", cpf).first();

    if (!takeCPF) {
      return res.status(404).json({ error: "CPF não encontrado." });
    }

    res.status(200).send(takeCPF);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
},



    async createUser(req, res) {
        try {
            
            const { user_CPF: cpf } = req.body;
            const { user_RG: rg } = req.body;
            const { user_nome: name } = req.body;
            const { user_email: email } = req.body;
            const { user_senha: password } = req.body;
            const { user_nascimento: date } = req.body;
            const { user_endCEP: cep } = req.body;
            const { user_endUF: UF } = req.body;
            const { user_endbairro: district } = req.body;
            const { user_endrua: street } = req.body;
            const { user_endnum: num } = req.body;
            const { user_endcomplemento: comp } = req.body;
            const { user_endcidade: city } = req.body;
            const { user_tipo: type } = req.body;
            const { list_CPF_list_id: id } = req.body;
            console.log('teste rapidão: ', cpf);

            const senha = await bcrypt.hash(password, 10);

            await knex("user").insert({
                user_CPF: cpf,
                user_RG: rg,
                user_nome: name,
                user_email: email,
                user_senha: senha,
                user_nascimento: date,
                user_endCEP: cep,
                user_endUF: UF,
                user_endbairro: district,
                user_endrua: street,
                user_endnum: num,
                user_endcomplemento: comp,
                user_endcidade: city,
                user_tipo: type,
                list_CPF_list_id: id
            });

        return res.status(201).send("User registered");
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
    },

  
async UserLogin(req, res) {
  try {
    const { user_CPF: cpf2 } = req.body;
    console.log(cpf2);
    const { user_senha: password } = req.body;
    console.log('this is the password: ', password);

    const [ takeCPF ] = await knex("user").where("user_CPF", "=", String(cpf2));

    if (takeCPF != undefined) {
      bcrypt.compare(password, takeCPF.user_senha, function (err, comp) {
        if (err || comp == false) {
          console.log('comp: ', comp);
          console.log(err);
        } else {
          console.log('this is comp: ', comp);

          const token = JWT.sign({
            user_CPF: takeCPF.user_CPF,
            user_nome: takeCPF.user_nome,
            user_email: takeCPF.user_email,
            user_FotoPerfil: takeCPF.user_FotoPerfil,
            user_nascimento: takeCPF.user_nascimento,
            user_endCEP: takeCPF.user_endCEP,
            user_endUF: takeCPF.user_endUF,
            user_endbairro: takeCPF.user_endbairro,
            user_endrua: takeCPF.user_endrua,
            user_endnum: takeCPF.user_endnum,
            user_endcomplemento: takeCPF.user_endcomplemento,
            user_endcidade: takeCPF.user_endcidade,
            user_tipo: takeCPF.user_tipo,
            user_status: takeCPF.user_status,
            user_credit: takeCPF.user_credit,
            user_Background: takeCPF.user_Background
          }, process.env.JWT_SECRET, { expiresIn: '7d' });
          console.log('this is req.headers: ', req.headers);

        res.cookie('token', token, {secure: true})  

        return res.status(201).send({
          token: token,
          message: "ok!"
        });
        }
      });
    }else{res.status(400).send('email ou senha inválido')} 
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
},

  async UpdateToken(req, res) {
    try {
      const { user_CPF: cpf } = req.body;
      console.log(cpf);

      // Use o await para aguardar a consulta ao banco de dados
      const [takeCPF] = await knex("user").where("user_CPF", "=", cpf);

      if (takeCPF !== undefined) {
            const token = JWT.sign({
              user_CPF: takeCPF.user_CPF,
              user_nome: takeCPF.user_nome,
              user_email: takeCPF.user_email,
              user_FotoPerfil: takeCPF.user_FotoPerfil,
              user_nascimento: takeCPF.user_nascimento,
              user_endCEP: takeCPF.user_endCEP,
              user_endUF: takeCPF.user_endUF,
              user_endbairro: takeCPF.user_endbairro,
              user_endrua: takeCPF.user_endrua,
              user_endnum: takeCPF.user_endnum,
              user_endcomplemento: takeCPF.user_endcomplemento,
              user_endcidade: takeCPF.user_endcidade,
              user_tipo: takeCPF.user_tipo,
              user_status: takeCPF.user_status,
            user_credit: takeCPF.user_credit,
            user_Background: takeCPF.user_Background

            }, process.env.JWT_SECRET, { expiresIn: '7d' });
            console.log('this is req.headers: ', req.headers);

            res.cookie('token', token, { secure: true })

            return res.status(201).send({
              token: token,
              message: "ok!"
            });
           } else {
        res.status(400).send('CPF não encontrado');
      }
    } catch (error) {
      res.status(500).send('Erro no servidor');
      console.log(error);
    }
  },


async DeleteUser (req, res) {
  try {

      const { user_CPF: data } = req.body;

      console.log('this is cookies 2: ', data);
      console.log('someone here??');
            
      const result = await knex("user").where('user_CPF', '=', data).del();
      res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true });

      res.status(201).json(result);
  } catch (error) {
      console.log('error: ', error);
      return res.status(400).json({ error: error.message });
  }
},

async UpdateUser(req, res) {
  try {
    const { user_CPF: cpf, updates } = req.body; // Recebe um objeto chamado "updates" contendo os campos a serem atualizados

    // Mapeamento dos campos do objeto "updates" para os campos do banco de dados
    const paramToField = {
      nome: 'user_nome',
      email: 'user_email',
      senha: 'user_senha',
      cep: 'user_endCEP',
      num: 'user_endnum',
      uf: 'user_endUF',
      bairro: 'user_endbairro',
      rua: 'user_endrua',
      complemento: 'user_endcomplemento',
      cidade: 'user_endcidade',
    };

    const updateFields = {};
    // Verifica cada campo fornecido no objeto "updates" e mapeia para o campo correspondente no banco de dados
    for (const param in updates) {
      if (paramToField.hasOwnProperty(param)) {
        updateFields[paramToField[param]] = updates[param];
      }
    }
            console.log(updates);

    // Verifica se existem campos válidos para atualização
    if (Object.keys(updateFields).length > 0) {
      // Faça a atualização no banco de dados
      await knex('user').where('user_CPF', '=', cpf).update(updateFields);
      res.status(200).send('Atualização realizada com sucesso.');
    } else {
      res.status(400).send('Nenhum campo válido para atualização fornecido.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro interno do servidor.');
  }
},
async uploadImage(req, res) {
  try {
    console.log('até aqui foi');

    // Verificar se o cabeçalho 'Authorization' está presente
    const token = req.headers['authorization'];
const cpf = req.headers['user_cpf'];
console.log(req.headers);
    console.log(cpf);
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

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
  console.log('Arquivo recebido:', req.file); // Adicione este log para verificar o arquivo recebido
      console.log('foi');
      try {
        console.log(req.file);

        console.log(req.file.filename);

      await knex('user').where('user_CPF', '=', cpf).update({
          user_Background: req.file.filename, // Nome do arquivo gerado pelo multer
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

async uploadImagePerfil(req, res) {
  try {
    console.log('até aqui foi');

    // Verificar se o cabeçalho 'Authorization' está presente
    const token = req.headers['authorization'];
const cpf = req.headers['user_cpf'];
console.log(req.headers);
    console.log(cpf);
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    upload2.single('selectedImage')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(400).json({ error: 'Error uploading image.' });
      } else if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unexpected error.' });
      }
      console.log(req.file); // Adicione este log para verificar se req.file está sendo recebido

      if (!req.file) {
        console.log({ error: 'No image file provided.' });
        return res.status(400).json({ error: 'No image file provided.' });
      }
      console.log(req.file); // Adicione este log para verificar se req.file está sendo recebido

      // Se chegou até aqui, o upload foi bem-sucedido.
  console.log('Arquivo recebido:', req.file); // Adicione este log para verificar o arquivo recebido
      console.log('foi');
      try {
        console.log(req.file.filename);
      console.log(req.file); // Adicione este log para verificar se req.file está sendo recebido

      await knex('user').where('user_CPF', '=', cpf).update({
          user_FotoPerfil: req.file.filename, // Nome do arquivo gerado pelo multer
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

async returnFundo(req, res) {
  const { filename } = req.body;
  console.log(filename);
  const imagePath = path.resolve(__dirname, '..', '..', '..', 'user', 'fundoperfil', filename);
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

async returnPerfil(req, res) {
  const { filename } = req.body;
  console.log(filename);

   if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'O campo "filename" é inválido ou está faltando.' });
  }

  const imagePath = path.resolve(__dirname, '..', '..', '..', 'user', 'perfil', filename);
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
}


};
