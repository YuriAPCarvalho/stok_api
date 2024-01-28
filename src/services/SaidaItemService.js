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
      if (isNaN(saidaItem.produtoId)) {
        const produto = await Produto.findOne({
          where: { descricao: saidaItem.produtoId },
        });
        if (!produto) {
          throw new Error(
            `Produto com descrição ${saidaItem.produtoId} não encontrado.`
          );
        }
        saidaItem.produtoId = produto.id;
      }

      const newSaidaItem = await SaidaItem.create(saidaItem);

      // Atualiza o saldo no estoque e cria ou atualiza uma entrada na tabela Saldo
      await this.atualizarSaldo(
        saidaItem.produtoId,
        saidaItem.estoqueId,
        saidaItem.quantidade
      );

      return newSaidaItem;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async atualizarSaldo(produtoId, estoqueId, quantidade) {
    try {
      // Verifica se já existe um saldo para o produto no estoque
      const saldo = await Saldo.findOne({ where: { produtoId, estoqueId } });

      if (saldo) {
        // Se já existe um saldo, atualiza a quantidade existente
        await Saldo.update(
          {
            quantidade: saldo.quantidade - quantidade,
            saldo: Sequelize.literal(`saldo - ${quantidade}`),
          },
          { where: { produtoId, estoqueId } }
        );
      } else {
        // Trate o caso em que você deseja lidar com saldo negativo ou bloquear a saída se não houver saldo suficiente
        throw new Error(
          `Saldo insuficiente para o produto ${produtoId} no estoque ${estoqueId}.`
        );
      }

      // Atualiza o saldo no estoque
      const estoque = await Estoque.findByPk(estoqueId);
      if (!estoque) {
        throw new Error(`Estoque com id ${estoqueId} não encontrado.`);
      }

      const novoSaldoEstoque = +estoque.saldo - quantidade;
      await Estoque.update(
        { saldo: novoSaldoEstoque },
        { where: { id: estoqueId } }
      );
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
