const Sequelize = require("sequelize");
const Produto = require("../models/produto");
const EntradaItem = require("../models/entradaItem");
const Estoque = require("../models/estoque");
const Saldo = require("../models/saldo");

class EntradaItemService {
  async createEntradaItem(entradaItem) {
    try {
      const createdEntradaItem = await EntradaItem.create(entradaItem);
      await this.atualizarSaldo(
        entradaItem.produtoId,
        entradaItem.estoqueId,
        entradaItem.subestoqueId,
        parseFloat(entradaItem.quantidade)
      );
      return createdEntradaItem;
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
        console.log('Saldo encontrado:', saldo);
  
        // Verifica se a quantidade é um número válido
        if (!isNaN(quantidade)) {
          saldo.saldo += quantidade;
          await saldo.save();
          console.log('Saldo atualizado:', saldo);
        } else {
          console.log('Quantidade não é um número válido. Não foi possível atualizar o saldo.');
        }
      } else {
        console.log('Saldo não encontrado. Criando novo saldo.');
        await Saldo.create({
          produtoId,
          estoqueId,
          subestoqueId,
          saldo: quantidade,
        });
        console.log('Novo saldo criado.');
      }
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
