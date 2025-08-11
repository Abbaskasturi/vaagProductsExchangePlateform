require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER, // From your .env file
    password: process.env.DB_PASSWORD, // From your .env file
    database: process.env.DB_NAME, // From your .env file
    host: process.env.DB_HOST, // From your .env file
    dialect: 'mysql'
  },
  production: {
    use_env_variable: "DATABASE_URL", // This is for Render
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};