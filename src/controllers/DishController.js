const knex = require("../database/knex")

class DishController {
  async create(request, response) {
    const { image, name, category, price, description, ingredients } = request.body
    const { user_id } = request.params;

    const [dishes_id] = await knex("dishes").insert({
      user_id,
      image,
      name,
      category,
      price,
      description
    });

    const ingredientsInsert = ingredients.map(name => {
      return {
        dishes_id,
        name
      }
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json({
      message: 'Prato cadastrado com sucesso.'
    });
  }

  async show(request, response) {
    const { id } = request.params;

    const dishes = await knex("dishes").where({ id }).first();
    const category = await knex("ingredients").where({ dishes_id: id }).orderBy("name");

    return response.json({
      ...dishes,
      category
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json({
      message: "Prato excluido."
    });
  }

  async index(request, response){
    const { user_id } = request.query;

    const dishes = await knex("dishes").where({ user_id }).orderBy("name")

    return response.json(dishes)
  }

}

module.exports = DishController