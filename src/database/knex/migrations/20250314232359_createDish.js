
exports.up = knex => knex.schema.createTable("dishes", table => {
  table.increments("id").primary();
  table.text("image")
  table.text("name")
  table.string("category")
  table.float("price")
  table.text("description")
  table.datetime('created_at').defaultTo(knex.fn.now())
  table.datetime('updated_at').defaultTo(knex.fn.now())
});


exports.down = knex => knex.schema.dropTable("dishes");
