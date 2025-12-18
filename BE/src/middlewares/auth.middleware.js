import jwt from 'jsonwebtoken';

export const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Không có Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid Authorization header'
    });
  }

  // 2. Lấy token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Gắn user info vào request
    req.user = {
      id: decoded.userId,
      roles: decoded.roles
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Token is invalid or expired'
    });
  }
};
