const Estoque = require("../models/estoque");

class EstoqueService {
  async createEstoque(estoque) {
    try {
      const newEstoque = await Estoque.create(estoque);
      return newEstoque;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findEstoques() {
    try {
      const estoques = await Estoque.findAll({ order: [["id", "ASC"]] });
      return estoques;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findEstoqueById(id) {
    try {
      const estoque = await Estoque.findByPk(id);
      return estoque;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateEstoque(id, estoque) {
    try {
      const [updatedRowsCount, updatedRows] = await Estoque.update(estoque, {
        where: {
          id: id,
        },
        returning: true,
      });
      if (updatedRowsCount === 0) {
        throw new Error("Estoque não encontrado");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteEstoque(id) {
    try {
      const estoque = await Estoque.findByPk(id);
      if (!estoque) {
        throw new Error("Estoque não encontrado");
      }

      await Estoque.destroy({
        where: {
          id: id,
        },
      });

      return estoque;
    } catch (error) {
      console.error(error)
      throw new Error(error.message);
    }
  }
}

module.exports = new EstoqueService();
