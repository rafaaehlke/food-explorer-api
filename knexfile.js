const path = require("path")
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
      seeds: {
      directory: path.resolve(__dirname, "src", "database", "knex", "seeds"),
    },
    useNullAsDefault: true
  }
};
