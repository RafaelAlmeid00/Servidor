const knex = require("../../database/index");
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const uniqid = require('uniqid');
const path = require('path');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const moment = require('moment');
const storage = multer.diskStorage({
  destination: './user/fundoperfil',
  filename: function (req, file, cb) {
    const uniqueFilename = uniqid() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});
const upload = multer({ storage });
const crypto = require('crypto');
const storage2 = multer.diskStorage({
  destination: './user/perfil',
  filename: function (req, file, cb) {
    const uniqueFilename = uniqid() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});
const upload2 = multer({ storage: storage2 });

const storage3 = multer.diskStorage({
  destination: '../user/documentos/rgfrente',
  filename: function (req, file, cb) {
    const uniqueFilename = uniqid() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});
const upload3 = multer({ storage: storage3 });

const storage4 = multer.diskStorage({
  destination: '../user/documentos/facial',
  filename: function (req, file, cb) {
    const uniqueFilename = uniqid() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});
const upload4 = multer({ storage: storage4 });

const storage5 = multer.diskStorage({
  destination: '../user/documentos/rgtras',
  filename: function (req, file, cb) {
    const uniqueFilename = uniqid() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});
const upload5 = multer({ storage: storage5 });

function generateToken() {
  return uuid.v4();
}
let tokens = new Map();
let codes = new Map();

console.log(storage2, upload2);

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();


module.exports = {

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
       console.log('aaabbb');

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
       console.log('aaa');

        return res.status(201).send("User registered");
    } catch (error) {
       console.log(error);
        return res.status(400).send({ error: error.message, error });
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
          console.log('this is err: ', err);
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
    let isSenhaUpdated = false; // Variável para indicar se o campo "senha" foi atualizado

    // Verifica cada campo fornecido no objeto "updates" e mapeia para o campo correspondente no banco de dados
    for (const param in updates) {
      if (paramToField.hasOwnProperty(param)) {
        if (param === 'senha') {
          console.log(updates);
          console.log(param);
          // Caso o campo seja "senha", faça o hash da senha antes de atualizá-la no banco de dados
          const hashedPassword = await bcrypt.hash(updates[param], 10);
          console.log(hashedPassword);
          updateFields[paramToField[param]] = hashedPassword;
          console.log(updateFields);
          console.log(updateFields[paramToField[param]]);
          isSenhaUpdated = true;
        } else {
          updateFields[paramToField[param]] = updates[param];
        }
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

     if (isSenhaUpdated) {
        res.status(200).send('Senha atualizada com sucesso.');
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
},

async sendEmail(req, res) {
  const { user_email: data } = req.body;
  const { user_CPF: cpf } = req.body;
  const { user_nome: nome } = req.body;
  let token = ''

  try {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.email,
        pass: process.env.senhaemail,
        clientId: process.env.idclient,
        clientSecret: process.env.secretkey,
        refreshToken: process.env.refreshtoken
      }
    });

    function formatarCPF(cpf) {
      const cpfSemDigitos = cpf.slice(0, -3);
      return cpfSemDigitos.replace(/\d/g, '*') + cpf.slice(-3);
    }

      token = generateToken();
      const timestamp = moment().unix();
      tokens.set(token, timestamp);

    const emailBody = `
   <!DOCTYPE html>
<html>
<head>
  <style>
    /* Estilos para o card */
    .card {
      background-color: #f9f9f9;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      width: 70vw;
      margin: 0 auto;
      padding: 20px;
      text-align: center; /* Adicionamos alinhamento central para o conteúdo dentro do card */
    }

    .card p {
      margin-top: 5px;
    }

    /* Estilos para o texto dentro do card */
    .card-text {
      text-align: center;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
    }

    .card-text h1 {
      color: #30e09a;
    }

    /* Estilos para o banner */
    .banner {
      background-color: rgba(48, 224, 154, 0.2); /* Cor de fundo com transparência */
      box-shadow: 0 8px 16px rgba(48, 224, 154, 0.1); /* Sombras */
      border-radius: 20px; /* Borda arredondada */
      padding: 10px; /* Espaçamento interno */
      margin-bottom: 20px; /* Espaçamento inferior para separar do parágrafo abaixo */
    }

    /* Estilos para o botão */
    .button {
      display: block; /* Alteramos de flex para block para que o botão não ocupe toda a largura do card */
      margin: 0 auto; /* Adicionamos margens automáticas para centralizar o botão horizontalmente */
      padding: 10px 20px;
      text-decoration: none;
      color: white; /* Alteramos a cor do texto para branco */
      background-color: #1976d2;
      border: none;
      border-radius: 5px;
      transition: border 0.3s;
      margin-top: 50px;
      width: 200px;
    }

    /* Estilos para o hover do botão */
    .button:hover {
      border: 2px solid #30e09a;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-text">
      <div class="banner"> <!-- Novo elemento para o banner -->
        <h1>EasyPass</h1>
      </div>
    </div>
    <p>Olá, ${nome}!</p>
    <p>Aqui está o seu link para alteração de email da sua conta EasyPass: CPF - ${formatarCPF(cpf)}</p>
    <a class="button" href="http://localhost:5173/Sistema/AlterarEmail?token=${token}">Clique aqui</a>
  </div>
</body>
</html>
  `;
        const mailOptions = {
          from: process.env.email,
          to: data,
          subject: 'Alteração de email: EasyPass',
          html: emailBody
        };
        console.log(mailOptions);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Erro no envio do Email:', error);
        res.status(400).send('Erro no envio do Email.');
      } else {
        console.log(info);
        console.log('Email enviado com sucesso para:', data);
        res.status(200).send('Email enviado com sucesso ao: ' + data);
      }
    });
  } catch (error) {
    console.error('Erro na requisição de envio do Email:', error);
    res.status(400).send('Erro na requisição de envio do Email.');
  }
},

async sendSenha(req, res) {
  const { user_CPF: cpf } = req.body;
  let uniqueCode = ''

  const userGet = await knex('user').where('user_CPF', '=', cpf).first();
  console.log(userGet);
  let data  = userGet.user_email;
  let nome  = userGet.user_nome;
  

  console.log(data, nome, cpf);

  try {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.email,
        pass: process.env.senhaemail,
        clientId: process.env.idclient,
        clientSecret: process.env.secretkey,
        refreshToken: process.env.refreshtoken
      }
    });

    function formatarCPF(cpf) {
      const cpfSemDigitos = cpf.slice(0, -3);
      return cpfSemDigitos.replace(/\d/g, '*') + cpf.slice(-3);
    }

    function generateUnique6DigitCode() {
  const randomBytes = crypto.randomBytes(3); // Generate 3 random bytes
  const uniqueCode = randomBytes.toString('hex').slice(0, 6).toUpperCase();
  return uniqueCode;
}
    const uniqueCode = generateUnique6DigitCode();
    const timestamp = moment().unix();
    codes.set(uniqueCode, timestamp);

   const senhaBody = `
   <!DOCTYPE html>
<html>
<head>
  <style>
    /* Estilos para o card */
    .card {
      background-color: #f9f9f9;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      width: 70vw;
      margin: 0 auto;
      padding: 20px;
      text-align: center; /* Adicionamos alinhamento central para o conteúdo dentro do card */
    }

    .card p {
      margin-top: 5px;
    }

    /* Estilos para o texto dentro do card */
    .card-text {
      text-align: center;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
    }

    .card-text h1 {
      color: #30e09a;
    }

     /* Estilos para o texto dentro do card */
    .card-text-code {
      text-align: center;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
    }

    .card-text-code h1 {
      color: #30e09a;
    }
 /* Estilos para o banner */
    .banner-code {
      background-color:transparent; /* Cor de fundo com transparência */
      box-shadow: 0 8px 16px rgba(48, 224, 154, 0.1); /* Sombras */
      border-radius: 20px; /* Borda arredondada */
      padding: 10px; /* Espaçamento interno */
      margin-bottom: 20px; /* Espaçamento inferior para separar do parágrafo abaixo */
    }

    /* Estilos para o banner */
    .banner {
      background-color: rgba(48, 224, 154, 0.2); /* Cor de fundo com transparência */
      box-shadow: 0 8px 16px rgba(48, 224, 154, 0.1); /* Sombras */
      border-radius: 20px; /* Borda arredondada */
      padding: 10px; /* Espaçamento interno */
      margin-bottom: 20px; /* Espaçamento inferior para separar do parágrafo abaixo */
    }

    /* Estilos para o botão */
    .button {
      display: block; /* Alteramos de flex para block para que o botão não ocupe toda a largura do card */
      margin: 0 auto; /* Adicionamos margens automáticas para centralizar o botão horizontalmente */
      padding: 10px 20px;
      text-decoration: none;
      color: white; /* Alteramos a cor do texto para branco */
      background-color: #1976d2;
      border: none;
      border-radius: 5px;
      transition: border 0.3s;
      margin-top: 50px;
      width: 200px;
    }

    /* Estilos para o hover do botão */
    .button:hover {
      border: 2px solid #30e09a;
    }

  </style>
</head>
<body>
  <div class="card">
    <div class="card-text">
      <div class="banner"> <!-- Novo elemento para o banner -->
        <h1>EasyPass</h1>
      </div>
    </div>
    <p>Olá, ${nome}!</p>
        <p>Parece que você esqueceu sua senha.</p>
    <p>Aqui está o seu código para recuperar a senha da sua conta EasyPass: CPF - ${formatarCPF(cpf)}</p>
     <div class="card-text-code">
      <div class="banner-code"> <!-- Novo elemento para o banner -->
      <h1>${uniqueCode}</h1>
      </div>
  </div>
</body>
</html>
  `;

      const mailOptions = {
          from: process.env.email,
          to: data,
          subject: 'Recuperação de senha: EasyPass',
          html: senhaBody
        };
        
        console.log(mailOptions);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Erro no envio do Email:', error);
        res.status(400).send('Erro no envio do Email.');
      } else {
        console.log(info);
        console.log('Email enviado com sucesso para:', data);
        res.status(200).send('Email enviado com sucesso ao: ' + data);
      }
    });
  } catch (error) {
    console.error('Erro na requisição de envio do Email:', error);
    res.status(400).send('Erro na requisição de envio do Email.');
  }
},


    async validateToken(req, res) {
      const { token } = req.body;

      if (tokens.has(token)) {
        const timestamp = tokens.get(token);

        const currentTime = moment().unix();
        const timeDifference = currentTime - timestamp;

        const expirationTime = 15 * 60;

        if (timeDifference <= expirationTime) {

          res.status(200).json({ valid: true });
        } else {

          tokens.delete(token); 
          res.status(200).json({ valid: false });
        }
      } else {

        res.status(200).json({ valid: false });
      }
    },

       async validadeCode(req, res) {
      const { code } = req.body;

      if (codes.has(code)) {
        const timestamp = codes.get(code);

        const currentTime = moment().unix();
        const timeDifference = currentTime - timestamp;

        const expirationTime = 15 * 60;

        if (timeDifference <= expirationTime) {

          res.status(200).json({ valid: true });
        } else {

          codes.delete(code); 
          res.status(200).json({ valid: false });
        }
      } else {

        res.status(200).json({ valid: false });
      }
    },

    async uploadDocumentosRG(req, res) {
  try {
    console.log('até aqui foi');

    const token = req.headers['authorization'];
const cpf = req.headers['user_cpf'];
console.log(req.headers);
    console.log(cpf);
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    upload3.single('selectedImage')(req, res, async function (err) {
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
          user_RGFrente: req.file.filename, // Nome do arquivo gerado pelo multer
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

    async uploadDocumentosRGtras(req, res) {
  try {
    console.log('até aqui foi');

    const token = req.headers['authorization'];
const cpf = req.headers['user_cpf'];
console.log(req.headers);
    console.log(cpf);
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    upload5.single('selectedImage')(req, res, async function (err) {
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
          user_RGTras: req.file.filename, // Nome do arquivo gerado pelo multer
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

    async uploadDocumentosfacial(req, res) {
  try {
    console.log('até aqui foi');

    const token = req.headers['authorization'];
const cpf = req.headers['user_cpf'];
console.log(req.headers);
    console.log(cpf);
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    upload4.single('selectedImage')(req, res, async function (err) {
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
          user_FotoRec: req.file.filename, // Nome do arquivo gerado pelo multer
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



};
