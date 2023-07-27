const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  async mid(req, res, next) {
    const {token: token} = req.body
    const authheader = req.headers['authorization']
    console.log('Middleware called');
    console.log(token, authheader);
    const test = process.env.JWT_SECRET;
    
    if (token || authheader) {
      try {
        jwt.verify(token ? token : authheader, test, (err, decoded) => {
          console.log('this is decoded and err: ', decoded, err);
          if (err) {
            return res.status(401).json({ message: 'Token inválido' });
          }
          console.log('Passou pelo mid');
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
