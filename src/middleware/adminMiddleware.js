/**
 * Admin Authorization Middleware
 * Verifies that the authenticated user possesses the 'admin' role.
 * Must be executed after authenticateUser middleware.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}
