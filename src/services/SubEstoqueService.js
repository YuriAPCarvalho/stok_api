const SubEstoque = require("../models/subestoque");

class SubEstoqueService {
  async createEstoque(estoque) {
    try {
      const newEstoque = await SubEstoque.create(estoque);
      return newEstoque;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findLastSaldosByEstoqueId(estoqueId) {
    try {
      const result = await Saldo.findAll({
        attributes: [
          "produtoId",
          [Sequelize.fn("max", Sequelize.col("updatedAt")), "maxUpdatedAt"],
        ],
        where: {
          estoqueId: estoqueId,
        },
        group: ["produtoId"],
        include: [
          {
            model: Saldo,
            attributes: [
              "id",
              "produtoId",
              "estoqueId",
              "saldo",
              "createdAt",
              "updatedAt",
            ],
            where: {
              updatedAt: Sequelize.col("maxUpdatedAt"),
            },
          },
        ],
      });

      return result.map((item) => item.Saldos[0]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar últimos saldos por estoque ID: ${error.message}`
      );
    }
  }
  async findEstoques() {
    try {
      const estoques = await SubEstoque.findAll({ order: [["id", "ASC"]] });
      return estoques;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findEstoqueById(id) {
    try {
      const estoque = await SubEstoque.findByPk(id);
      return estoque;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateEstoque(id, estoque) {
    try {
      const [updatedRowsCount, updatedRows] = await SubEstoque.update(estoque, {
        where: {
          id: id,
        },
        returning: true,
      });
      if (updatedRowsCount === 0) {
        throw new Error("SubEstoque não encontrado");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteEstoque(id) {
    try {
      const estoque = await SubEstoque.findByPk(id);
      if (!estoque) {
        throw new Error("SubEstoque não encontrado");
      }

      await SubEstoque.destroy({
        where: {
          id: id,
        },
      });

      return estoque;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

module.exports = new SubEstoqueService();
