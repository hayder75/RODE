module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
    jwtExpire: '1d',
};
