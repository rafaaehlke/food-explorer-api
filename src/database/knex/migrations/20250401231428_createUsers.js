
exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id").primary();
  table.text("name").notNullable()
  table.text("email").notNullable()
  table.text("password").notNullable()
  table.enum("role", ["cliente", "admin"], {useNative: true, enumName: "roles"})
  .notNullable().default("cliente")
  table.datetime('created_at').defaultTo(knex.fn.now())
  table.datetime('updated_at').defaultTo(knex.fn.now())

})

exports.down = knex => knex.schema.dropTable("users")
