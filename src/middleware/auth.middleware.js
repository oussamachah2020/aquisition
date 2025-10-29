import logger from '#config/logger.js';
import { jwtToken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

const getToken = req => {
  const cookieToken = cookies.get(req, 'token');
  if (cookieToken) return cookieToken;

  const auth = req.get('Authorization') || req.get('authorization');
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
};

export const deserializeUser = (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) return next();

    const payload = jwtToken.verify(token);
    // Expect payload to contain id, email, role
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (e) {
    logger.warn('Invalid or expired token provided', e);
    cookies.clear(res, 'token');
    return next();
  }
};

export const requireAuth = (req, res, next) => {
  try {
    if (req.user) return next();

    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const payload = jwtToken.verify(token);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (e) {
    logger.warn('Unauthorized access attempt', e);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  } catch (e) {
    logger.error('Role check error', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};