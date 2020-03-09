require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  },

  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  }

};
