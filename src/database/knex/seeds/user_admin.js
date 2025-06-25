const { hash, compare } = require("bcryptjs")

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const password = "123456"

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const passwordHashed = await hash(password, 8)
  await knex('users').del()
  await knex('users').insert([
    { name: 'admin',
      email: "admin@admin.com",
      password: passwordHashed,
      role: "admin"
    }, // nome campo tabela, "valor do campo"
  ]);
};
