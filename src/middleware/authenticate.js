const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log('Token recebido:', token);  // Log do token recebido
  
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, autorização negada' });
  }

  try {
    console.log('Chave secreta:', process.env.JWT_SECRET);  // Log da chave secreta
    
    console.log('Iniciando a verificação do token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);  // Log do token decodificado
    
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.error('Erro ao verificar o token:', err);  // Log detalhado do erro
    res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = authenticate;