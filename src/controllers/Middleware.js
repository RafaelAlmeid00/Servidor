const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

module.exports = {
  async mid(req, res, next) {
    dotenv.config();
    console.log('Middleware called');
    const test = process.env.JWT_SECRET;
    const token = req.body.token ? req.body.token : req.headers['authorization']; // Verifica no body ou no cabeçalho 'Authorization'
    
    if (token) {
      try {
        jwt.verify(token, test, (err, decoded) => {
          console.log('this is decoded and err: ', decoded, err);
          if (err) {
            return res.status(401).json({ message: 'Token inválido' });
          }
          return next();
        });
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    } else {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
  },
};
