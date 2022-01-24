require('dotenv').config({path: './.env'})

const FILENAME = process.env.DATABASE_FILENAME || 'database.sqlite';

module.exports = {
  
  test: {
    client: 'better-sqlite3',
      connection: {
        filename: FILENAME,
      },
      useNullAsDefault: true,
  },

  development: {
    client: 'pg',
    connection: process.env.DB_URL,
    useNullAsDefault: true,
  }

}