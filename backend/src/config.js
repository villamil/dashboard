const { JWT_VALUE: jwtSecret = "unsecure" } = process.env;

module.exports = {
    jwtSecret
}