const Produto = require("../models/produto");
const Categoria = require("../models/categoria");
const { Op, literal, QueryTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");

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

  async findProdutosPaginado(page = 1, perPage = 5) {
    try {
      const startIndex = (page - 1) * perPage;
    
      const { count, rows: produtos } = await Produto.findAndCountAll({
        include: [{ model: Categoria, as: "categoria" }],
        offset: startIndex,
        limit: perPage,
        order: [['descricao', 'ASC']],
      });
  
      const totalItems = count;
      const totalPages = Math.ceil(totalItems / perPage);
  
      produtos.forEach((produto) => {
        if (produto.fotoProduto) {
          const fotoProdutoBase64 = Buffer.from(produto.fotoProduto).toString(
            "base64"
          );
          produto.fotoProduto = `data:${produto.mimeType};base64,${fotoProdutoBase64}`;
        }
      });
  
      return {
        produtos,
        totalItems,
        totalPages,
      };
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

  async gerarRelatorio(fazenda, local) {
    try {
      const replacements = {};
  
      let whereClause = "";
  
      if (fazenda && local) {
        whereClause += `where e."id" = :fazenda and se."id" = :local`;
        replacements.fazenda = fazenda;
        replacements.local = local;
      } else if (fazenda) {
        whereClause += `where e."id" = :fazenda`;
        replacements.fazenda = fazenda;
      } else if (local) {
        whereClause += `where se."id" = :local`;
        replacements.local = local;
      }
  
      const relatorio = await sequelize.query(
        `SELECT p."id" as "id_material",
                p."descricao" as "material",
                e."descricao" as "fazenda",
                se."descricao" as "local",
                s."saldo" as "quantidade"
          FROM "Saldo" s
          INNER JOIN "Produto" p ON s."produtoId" = p."id"
          INNER JOIN "Estoque" e ON s."estoqueId" = e."id"
          INNER JOIN "Subestoque" se ON s."subestoqueId" = se."id"
          ${whereClause}`,  // <-- Adiciona a cláusula WHERE apenas se houver algo para adicionar
        {
          replacements: replacements,
          type: sequelize.QueryTypes.SELECT,
        }
      );
  
      return relatorio;
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
  
      if (error instanceof sequelize.DatabaseError) {
        // Aqui você pode tratar erros específicos do banco de dados
        // por exemplo, verificar se as tabelas ou colunas existem
        throw new Error("Erro no banco de dados ao gerar relatório.");
      } else {
        // Caso contrário, se não for um erro conhecido, apenas repasse a mensagem genérica
        throw new Error("Erro interno ao gerar relatório.");
      }
    }
  }
}

module.exports = new ProdutoService();
