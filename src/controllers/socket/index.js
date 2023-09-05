const io = require('socket.io')(); 
const knex = require("../../database/index");

const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await knex('users').where({ user_status: 'ativo' }).select('*');

    io.emit('activeUsers', activeUsers);

    res.status(200).json({ message: 'Usuários ativos enviados com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar usuários ativos' });
  }
};

module.exports = { getActiveUsers };
