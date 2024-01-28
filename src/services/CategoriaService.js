
const Categoria = require("../models/categoria");

class CategoriaService {
  async createCategoria(categoria) {
    try {
      const newCategoria = await Categoria.create(categoria);
      return newCategoria;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findCategorias() {
    try {
      const categorias = await Categoria.findAll();
      return categorias;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findCategoriaById(id) {
    try {
      const categoria = await Categoria.findByPk(id);
      return categoria;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCategoria(id, categoria) {
    try {
      const [updatedRowsCount, updatedRows] = await Categoria.update(categoria, {
        where: {
          id: id,
        },
        returning: true,
      });
      if (updatedRowsCount === 0) {
        throw new Error("Categoria não encontrada");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCategoria(id) {
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        throw new Error("Categoria não encontrada");
      }

      await Categoria.destroy({
        where: {
          id: id,
        },
      });

      return categoria;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CategoriaService();