const { Op, literal } = require("sequelize");
const Sequelize = require("sequelize");
const Saldo = require("../models/saldo");

class SaldoService {
  async createSaldo(saldo) {
    try {
      return await Saldo.create(saldo);
    } catch (error) {
      throw new Error(`Erro ao criar saldo: ${error.message}`);
    }
  }

  async findSaldos() {
    try {
      return await Saldo.findAll({ order: [["updatedAt", "DESC"]] });
    } catch (error) {
      throw new Error(`Erro ao buscar saldos: ${error.message}`);
    }
  }

  async findSaldoById(id) {
    try {
      return await Saldo.findByPk(id);
    } catch (error) {
      throw new Error(`Erro ao buscar saldo por ID: ${error.message}`);
    }
  }

  async updateSaldo(id, saldo) {
    try {
      const [updatedRowsCount, [updatedRow]] = await Saldo.update(saldo, {
        where: { id },
        returning: true,
      });
      if (updatedRowsCount === 0) {
        throw new Error("Saldo não encontrado");
      }
      return updatedRow;
    } catch (error) {
      throw new Error(`Erro ao atualizar saldo: ${error.message}`);
    }
  }

  async deleteSaldo(id) {
    try {
      const saldo = await Saldo.findByPk(id);
      if (!saldo) {
        throw new Error("Saldo não encontrado");
      }
      await Saldo.destroy({ where: { id } });
      return saldo;
    } catch (error) {
      throw new Error(`Erro ao excluir saldo: ${error.message}`);
    }
  }

  async findLastSaldosByEstoqueId(estoqueId) {
    try {
      console.log("Entrou no método findLastSaldosByEstoqueId");

      const result = await Saldo.findAll({
        attributes: [
          [Sequelize.literal('DISTINCT ON ("produtoId") id'), "id"],
          "produtoId",
          "estoqueId",
          "saldo",
          "createdAt",
          "updatedAt",
        ],
        where: {
          estoqueId: estoqueId,
        },
        order: [
          ["produtoId", "DESC"],
          ["updatedAt", "DESC"],
        ],
      });

      console.log("Result:", result);

      return result;
    } catch (error) {
      console.error(
        `Erro ao buscar últimos saldos por estoque ID: ${error.message}`
      );
      throw error;
    }
  }

  async findSaldosByFilters(estoqueId, produtoId) {
    try {
      const whereClause = {};
      if (estoqueId) whereClause.estoqueId = estoqueId;
      if (produtoId) whereClause.produtoId = produtoId;

      return await Saldo.findAll({
        where: whereClause,
        order: [["updatedAt", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Erro ao buscar saldos por filtros: ${error.message}`);
    }
  }
}

module.exports = new SaldoService();
