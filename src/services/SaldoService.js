const { Op, literal, QueryTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");
const { Saldo } = require('../models/saldo');
const Produto = require("../models/produto");
const Categoria = require("../models/categoria");
const EntradaItem = require("../models/entradaItem");


class SaldoService {

  async updateSaldo(produtoId, estoqueId, subestoqueId, novoSaldo) {
    console.log("Entrou em updateSaldo");
    console.log("produtoId:", produtoId);
    console.log("estoqueId:", estoqueId);
    console.log("subestoqueId:", subestoqueId);
    console.log("novoSaldo:", novoSaldo.saldo);
    try {
      const sqlQuery = `
        SELECT
          s."id"  
        FROM "Saldo" s
        WHERE
          s."produtoId" = :produtoId
          AND s."estoqueId" = :estoqueId
          AND s."subestoqueId" = :subestoqueId
      `;

      const saldo = await sequelize.query(sqlQuery, {
        type: QueryTypes.SELECT,
        replacements: {
          produtoId: produtoId,
          estoqueId: estoqueId,
          subestoqueId: subestoqueId
        },
      });
      console.log("Saldos encontrados:", saldo);

      const sqlUpdate = `	UPDATE "Saldo" S SET "saldo" = :novoSaldo WHERE s."id" = :id`;
      const result = await sequelize
        .query(sqlUpdate, {
          type: QueryTypes.UPDATE,
          replacements: {
            novoSaldo: novoSaldo.saldo,
            id: saldo[0].id
          },
        });
      console.log("Saldos atualizados:", result);
      return result;
    }
    catch (error) {
      throw new Error(`Erro ao atualizar saldo: ${error.message}`);
    }
  }

    /*  const saldo = await Saldo.findOne({
        where: {
          produtoId: produtoId,
          estoqueId: estoqueId,
          subestoqueId: subestoqueId,
        },
      }); /*

      if (saldo) {
  
        saldo.saldo = isNaN(novoSaldo) ? null : novoSaldo;
        await saldo.save();
        return saldo;
      } else {

        console.error(`Saldo não encontrado para o produto ${produtoId} no estoque ${estoqueId} e subestoque ${subestoqueId}`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      throw error;
    }
  }
  */

  async findSaldosByParams(estoqueId, grupo, local) {
    try {
      const sqlQuery = `
select s."produtoId" as "id",
	   p."fotoProduto",
	   p."descricao",
	   s."saldo",
	   e."descricao" as "descricaoEstoque"
	   

  from "Saldo" s 
  
 inner join "Produto" p on s."produtoId" = p."id"
 inner join "Estoque" e on s."estoqueId" = e."id"
 
 where s."estoqueId" = :estoqueId
 and p."categoriaId" = :local
 and s."subestoqueId" = :grupo
      `;
  
      const saldos = await sequelize.query(sqlQuery, {
        type: QueryTypes.SELECT,
        replacements: {
          estoqueId: estoqueId,
          grupo: grupo,
          local: local
        },
      });
      console.log("Saldos encontrados:", saldos);
      return saldos;
    } catch (error) {
      throw new Error(`Erro ao buscar saldos por parâmetros: ${error.message}`);
    }
  }
  
}

module.exports = new SaldoService();
