const Solicitante = require("../models/solicitante");

class SolicitanteService {
  async createSolicitante(solicitante) {
    try {
      const newSolicitante = await Solicitante.create(solicitante);
      return newSolicitante;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findSolicitantes() {
    try {
      const solicitantes = await Solicitante.findAll();
      return solicitantes;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findSolicitanteById(id) {
    try {
      const solicitante = await Solicitante.findByPk(id);
      return solicitante;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateSolicitante(id, estoque) {
    try {
      const [updatedRowsCount, updatedRows] = await Solicitante.update(estoque, {
        where: {
          id: id,
        },
        returning: true,
      });
      if (updatedRowsCount === 0) {
        throw new Error("Solicitante não encontrado");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteSolicitante(id) {
    try {
      const solicitante = await Solicitante.findByPk(id);
      if (!solicitante) {
        throw new Error("Solicitante não encontrado");
      }

      await Solicitante.destroy({
        where: {
          id: id,
        },
      });

      return solicitante;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new SolicitanteService();