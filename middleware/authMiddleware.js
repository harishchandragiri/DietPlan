import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
  const token = req.cookies.Token;

  if (!token) {
    return res.status(401).json('The token not found');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      return res.status(403).json('The token is invalid');
    }

    req.email = decode.email;
    req.username = decode.username;
    next();
  });
};

export default verifyUser;
