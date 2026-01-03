import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const bearerToken = header.split(' ');
  const token = bearerToken[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyJWT;