const Sequelize = require("sequelize");
const Produto = require("../models/produto");
const EntradaItem = require("../models/entradaItem");
const Estoque = require("../models/estoque");
const Saldo = require("../models/saldo");

class EntradaItemService {
  async createEntradaItem(entradaItem) {
    try {
      if (isNaN(entradaItem.produtoId)) {
        const produto = await Produto.findOne({
          where: { descricao: entradaItem.produtoId },
        });
        if (!produto) {
          throw new Error(
            `Produto com descrição ${entradaItem.produtoId} não encontrado.`
          );
        }
        entradaItem.produtoId = produto.id;
      }

      const newEntradaItem = await EntradaItem.create(entradaItem);

      // Atualiza o saldo no estoque e cria ou atualiza uma entrada na tabela Saldo
      await this.atualizarSaldo(
        entradaItem.produtoId,
        entradaItem.estoqueId,
        entradaItem.quantidade
      );

      return newEntradaItem;
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
            quantidade: Sequelize.literal(`quantidade + ${quantidade}`),
            saldo: Sequelize.literal(`saldo + ${quantidade}`),
          },
          { where: { produtoId, estoqueId } }
        );
      } else {
        // Se não existe um saldo, cria uma nova entrada com um valor inicial para o saldo
        await Saldo.create({
          produtoId,
          estoqueId,
          quantidade,
          saldo: quantidade,
        });
      }

      // Atualiza o saldo no estoque
      const estoque = await Estoque.findByPk(estoqueId);
      if (!estoque) {
        throw new Error(`Estoque com id ${estoqueId} não encontrado.`);
      }

      const novoSaldoEstoque = +estoque.saldo + quantidade;
      await Estoque.update(
        { saldo: novoSaldoEstoque },
        { where: { id: estoqueId } }
      );
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findEntradaItems(estoqueId, produtoId) {
    try {
      const whereClause = {};
      if (estoqueId) {
        whereClause.estoqueId = estoqueId;
      }
      if (produtoId) {
        whereClause.produtoId = produtoId;
      }
      const entradaItems = await EntradaItem.findAll({
        where: whereClause,
        include: [
          { model: Estoque, as: "estoque" },
          { model: Produto, as: "produto", attributes: ["descricao"] },
        ],
      });
      return entradaItems;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findEntradaItemsByEstoqueId(estoqueId) {
    try {
      const entradaItems = await EntradaItem.findAll({
        where: { estoqueId: estoqueId },
        include: [
          { model: Estoque, as: "estoque" },
          { model: Produto, as: "produto", attributes: ["descricao"] },
        ],
      });
      return entradaItems;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findEntradaItemById(id) {
    try {
      const entradaItem = await EntradaItem.findByPk(id, {
        include: [
          { model: Estoque, as: "estoque" },
          { model: Produto, as: "produto" },
        ],
      });
      return entradaItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateEntradaItem(id, entradaItem) {
    try {
      const [updatedRowsCount, updatedRows] = await EntradaItem.update(
        entradaItem,
        {
          where: {
            id: id,
          },
          returning: true,
        }
      );
      if (updatedRowsCount === 0) {
        throw new Error("Entrada de Item não encontrada");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteEntradaItem(id) {
    try {
      const entradaItem = await EntradaItem.findByPk(id, {
        include: [
          { model: Produto, as: "produto" },
          { model: Estoque, as: "estoque" },
        ],
      });

      if (!entradaItem) {
        throw new Error("Entrada de Item não encontrada");
      }

      // Antes de excluir, atualiza o saldo invertendo a operação
      await this.atualizarSaldo(
        entradaItem.produto.id,
        entradaItem.estoque.id,
        -entradaItem.quantidade
      );

      // Agora pode excluir o item de entrada
      await EntradaItem.destroy({
        where: {
          id: id,
        },
      });

      return entradaItem; // Retorna o objeto excluído
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new EntradaItemService();
