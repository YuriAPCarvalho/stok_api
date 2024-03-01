const express = require("express");
const router = express.Router();
const ProdutoService = require("../services/ProdutoService");
const multer = require("multer");
const upload = multer();

router.post("/", upload.single("fotoProduto"), async (req, res) => {
  const produto = req.body;
  if (req.file) {
    produto.fotoProduto = req.file.buffer;
    produto.mimeType = req.file.mimetype;
  }
  try {
    const result = await ProdutoService.createProduto(produto);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto.", error });
  }
});

router.get("/paginado", async (req, res) => {
  console.log('paginado');
  try {
    const { page, perPage } = req.query; 
    const result = await ProdutoService.findProdutosPaginado(page, perPage);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos.", error });
  }
});

router.get("/descricao", async (req, res) => {
  console.log('get descricao');
  try {
    const result = await ProdutoService.findDescricoes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar descrições.", error });
  }
});

router.get("/", async (req, res) => {
  console.log('get');
  try {
    const result = await ProdutoService.findProdutos();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos.", error });
  }
});



router.get("/relatorio", async (req, res) => {
  try {
    const { fazenda, local } = req.query;
   
    const relatorio = await ProdutoService.gerarRelatorio(fazenda, local);

    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar relatório.", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProdutoService.findProdutoById(id);
    if (!result) {
      res.status(404).json({ message: `produto com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produto.", error });
  }
});

router.put("/:id", upload.single("fotoProduto"), async (req, res) => {
  console.log(req.file);
  const { id } = req.params;
  const produto = req.body;

  if (req.file) {
    produto.fotoProduto = req.file.buffer;
  }

  if (req.body.deletePhoto === 'true') {
    produto.fotoProduto = null;
  }

  try {
    const result = await ProdutoService.updateProduto(id, produto);
    if (!result) {
      res.status(404).json({ message: `Produto com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar produto.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProdutoService.deleteProduto(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "produto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir produto" });
  }
});

module.exports = router;
