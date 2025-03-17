
exports.up = knex => knex.schema.createTable("dishes", table => {
  table.increments("id").primary();
  
  table.integer("user_id").references("id").inTable("users")
  table.text("image").notNullable()
  table.text("name").notNullable()
  table.string("category").notNullable()
  table.float("price").notNullable()
  table.text("description").notNullable()

  table.datetime('created_at').defaultTo(knex.fn.now())
  table.datetime('updated_at').defaultTo(knex.fn.now())
});


exports.down = knex => knex.schema.dropTable("dishes");
