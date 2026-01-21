import jwt from 'jsonwebtoken';

/* ================= AUTH GUARD ================= */
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
      username: decoded.username,
      roles: decoded.roles || []   // 👈 đảm bảo luôn là mảng
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Token is invalid or expired'
    });
  }
};

/* ================= ROLE GUARD (THÊM MỚI) ================= */
export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasPermission = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You do not have permission'
      });
    }

    next();
  };
};
