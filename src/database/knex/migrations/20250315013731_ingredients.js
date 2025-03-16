exports.up = knex => knex.schema.createTable("ingredients", table => {
  table.increments("id").primary();

  table.integer("dishes_id").references("id").inTable("dishes")

  table.text("name").notNullable()
  table.datetime('created_at').defaultTo(knex.fn.now())
  table.datetime('updated_at').defaultTo(knex.fn.now())
});


exports.down = knex => knex.schema.dropTable("ingredients");
