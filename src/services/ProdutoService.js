const Produto = require("../models/produto");
const Categoria = require("../models/categoria");

class ProdutoService {
  async createProduto(produto) {
    try {
      const newProduto = await Produto.create(produto);
      return newProduto;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findProdutos() {
    try {
      const produtos = await Produto.findAll({
        include: [{ model: Categoria, as: "categoria" }],
      });

      produtos.forEach((produto) => {
        if (produto.fotoProduto) {
          const fotoProdutoBase64 = Buffer.from(produto.fotoProduto).toString(
            "base64"
          );
          produto.fotoProduto = `data:${produto.mimeType};base64,${fotoProdutoBase64}`;
        }
      });

      return produtos;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async findProdutoById(id) {
    try {
      const produto = await Produto.findByPk(id, {
        include: [{ model: Categoria, as: "categoria" }],
      });
      return produto;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduto(id, produto) {
    try {
      const [updatedRowsCount, updatedRows] = await Produto.update(produto, {
        where: {
          id: id,
        },
        returning: true,
      });
      if (updatedRowsCount === 0) {
        throw new Error("Produto não encontrado");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduto(id) {
    try {
      const produto = await Produto.findByPk(id);
      if (!produto) {
        throw new Error("Produto não encontrado");
      }

      await Produto.destroy({
        where: {
          id: id,
        },
      });

      return produto;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ProdutoService();
