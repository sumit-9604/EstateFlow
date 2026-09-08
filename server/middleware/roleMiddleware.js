module.exports = function (roles) {
    return (req, res, next) => {
        // req.user is set by authMiddleware or Passport
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: Unauthorized role' });
        }
        next();
    };
};