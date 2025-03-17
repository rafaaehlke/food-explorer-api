const knex = require("../database/knex")

class DishController {
  async create(request, response) {
    const { image, name, category, price, description, ingredients } = request.body
    const { user_id } = request.params;

    const [ dishes_id ] = await knex("dishes").insert({
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
    })

    await knex("ingredients").insert(ingredientsInsert)

    return response.status(201).json({ 
      message: 'Prato cadastrado com sucesso.'
    });
  }
}

module.exports = DishController