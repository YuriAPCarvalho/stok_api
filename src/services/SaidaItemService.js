const Sequelize = require("sequelize");
const SaidaItem = require("../models/saidaItem");
const Usuario = require("../models/usuario");
const Estoque = require("../models/estoque");
const Solicitante = require("../models/solicitante");
const Produto = require("../models/produto");
const Saldo = require("../models/saldo");

class SaidaItemService {
  async createSaidaItem(saidaItem) {
    try {
      const createdSaidaItem = await SaidaItem.create(saidaItem);
      await this.atualizarSaldo(
        saidaItem.produtoId,
        saidaItem.estoqueId,
        saidaItem.subestoqueId,
        parseFloat(saidaItem.quantidade),
      );
      return createdSaidaItem;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async atualizarSaldo(produtoId, estoqueId, subestoqueId, quantidade) {
    try {
      const saldo = await Saldo.findOne({
        where: {
          produtoId: produtoId,
          estoqueId: estoqueId,
          subestoqueId: subestoqueId,
        },
      });

      if (saldo) {
        console.log("Saldo encontrado:", saldo);

        // Verifica se a quantidade é um número válido
        if (!isNaN(quantidade)) {
          saldo.saldo -= quantidade;
          await saldo.save();
          console.log("Saldo atualizado:", saldo);
        } else {
          console.log(
            "Quantidade não é um número válido. Não foi possível atualizar o saldo."
          );
        }
      } else {
        console.log("Saldo não encontrado. Criando novo saldo.");
        await Saldo.create({
          produtoId,
          estoqueId,
          subestoqueId,
          saldo: -quantidade,
        });
        console.log("Novo saldo criado.");
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findSaidaItems(estoqueId, produtoId) {
    try {
      const whereClause = {};
      if (estoqueId) {
        whereClause.estoqueId = estoqueId;
      }
      if (produtoId) {
        whereClause.produtoId = produtoId;
      }
      const saidaItems = await SaidaItem.findAll({
        where: whereClause,
        include: [
          { model: Produto, as: "produto" },
          { model: Usuario, as: "usuario" },
          { model: Estoque, as: "estoque" },
          { model: Solicitante, as: "solicitante" },
        ],
      });
      return saidaItems;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findSaidaItemsByEstoqueId(estoqueId) {
    try {
      const saidaItems = await SaidaItem.findAll({
        where: { estoqueId: estoqueId },
        include: [
          { model: Produto, as: "produto" },
          { model: Usuario, as: "usuario" },
          { model: Estoque, as: "estoque" },
          { model: Solicitante, as: "solicitante" },
        ],
      });
      return saidaItems;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findSaidaItemById(id) {
    try {
      const saidaItem = await SaidaItem.findByPk(id, {
        include: [
          { model: Produto, as: "produto" },
          { model: Usuario, as: "usuario" },
          { model: Estoque, as: "estoque" },
          { model: Solicitante, as: "solicitante" },
        ],
      });
      return saidaItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findSaidaItemByProdutoId(id) {
    try {
      const saidaItem = await SaidaItem.findOne({
        include: [
          { model: Produto, as: "produto", where: { id: id } },
          { model: Usuario, as: "usuario" },
          { model: Estoque, as: "estoque" },
          { model: Solicitante, as: "solicitante" },
        ],
      });
      return saidaItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findSaidaItemByDescricao(descricao) {
    try {
      const saidaItem = await SaidaItem.findOne({
        include: [
          {
            model: Produto,
            as: "produto",
            attributes: ["descricao"],
            where: { descricao: descricao },
          },
          { model: Usuario, as: "usuario" },
          { model: Estoque, as: "estoque" },
          { model: Solicitante, as: "solicitante" },
        ],
      });
      return saidaItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateSaidaItem(id, saidaItem) {
    try {
      const [updatedRowsCount, updatedRows] = await SaidaItem.update(
        saidaItem,
        {
          where: {
            id: id,
          },
          returning: true,
        }
      );
      if (updatedRowsCount === 0) {
        throw new Error("Item de saída não encontrado");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteSaidaItem(id) {
    try {
      const saidaItem = await SaidaItem.findByPk(id, {
        include: [
          { model: Produto, as: "produto" },
          { model: Estoque, as: "estoque" },
        ],
      });

      if (!saidaItem) {
        throw new Error("Item de saída não encontrado");
      }

      // Antes de excluir, atualiza o saldo invertendo a operação
      await this.atualizarSaldo(
        saidaItem.produto.id,
        saidaItem.estoque.id,
        -saidaItem.quantidade
      );

      // Agora pode excluir o item de saída
      await SaidaItem.destroy({
        where: {
          id: id,
        },
      });

      return saidaItem; // Retorna o objeto excluído
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new SaidaItemService();
