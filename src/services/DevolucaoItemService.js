const DevolucaoItem = require("../models/devolucaoItem");
const Produto = require("../models/produto");
const Estoque = require("../models/estoque");
const Solicitante = require("../models/solicitante");

class DevolucaoItemService {
  async createDevolucaoItem(devolucaoItem) {
    try {
      if (isNaN(devolucaoItem.produtoId)) {
        const produto = await Produto.findOne({
          where: { descricao: devolucaoItem.produtoId },
        });
        if (!produto) {
          throw new Error(
            `Produto com descrição ${devolucaoItem.produtoId} não encontrado.`
          );
        }
        devolucaoItem.produtoId = produto.id;
      }
      const newSaidaItem = await DevolucaoItem.create(devolucaoItem);
      return newSaidaItem;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findDevolucaoItems() {
    try {
      const devolucaoItems = await DevolucaoItem.findAll({
        include: [
          { model: Produto, as: "produto" },
          { model: Solicitante, as: "solicitante" },
          { model: Estoque, as: "estoque" },
        ],
      });
      return devolucaoItems;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findDevolucaoItemById(id) {
    try {
      const devolucaoItem = await DevolucaoItem.findByPk(id, {
        include: [
          { model: Produto, as: "produto" },
          { model: Solicitante, as: "solicitante" },
          { model: Estoque, as: "estoque" },
        ],
      });
      return devolucaoItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findDevolucaoItemByProdutoId(id) {
    try {
      const saidaItem = await DevolucaoItem.findOne( {
        include: [
          { model: Produto, as: "produto",  where: { id: id } },
          { model: Estoque, as: "estoque" },
          { model: Solicitante, as: "solicitante" },
        ],
      });
      return saidaItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  async findDevolucaoItemByDescricao(descricao) {
    try {
      const saidaItem = await DevolucaoItem.findOne({
        include: [
          { 
            model: Produto, 
            as: "produto", 
            attributes: ['descricao'],
            where: { descricao: descricao }
          },
          { model: Estoque, as: "estoque" },
          { model: Solicitante, as: "solicitante" },
        ],
      });
      return saidaItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDevolucaoItem(id, devolucaoItem) {
    try {
      const [updatedRowsCount, updatedRows] = await DevolucaoItem.update(
        devolucaoItem,
        {
          where: {
            id: id,
          },
          returning: true,
        }
      );
      if (updatedRowsCount === 0) {
        throw new Error("Item de devolução não encontrado");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteDevolucaoItem(id) {
    try {
      const devolucaoItem = await DevolucaoItem.findByPk(id);
      if (!devolucaoItem) {
        throw new Error("Item de devolução não encontrado");
      }

      await DevolucaoItem.destroy({
        where: {
          id: id,
        },
      });

      return devolucaoItem;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new DevolucaoItemService();
