const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
module.exports = {
    async mid (req, res){
        dotenv.config()
        const test = process.env.JWT_SECRET;
        const token = req.body.RecToken;
        const insominiaT = req.cookies.token;
        console.log('aa o token: ', token);
        if (token) {  
            try {
                const recive = jwt.verify(token, test, (err, decoded) => {
                    if (err || decoded == undefined) {
                        return `erro: ${err}`
                    }
                    
                    return decoded
                });
                console.log('this is recive: ', recive);
                    return recive;
                
            } catch (error) {
                console.log(error);
                return error
            }
            
        }

        
    },
    
};