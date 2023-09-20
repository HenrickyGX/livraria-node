// server.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const yup = require("yup");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Define as validações com o Yup
const livroSchema = yup.object().shape({
  titulo: yup.string().required().max(255),
  descricao: yup.string(),
  dataPublicacao: yup.date().required(),
  isbn: yup.string().required(),
  preco: yup.number().required().positive(),
  autorId: yup.number().required(),
});

const autorSchema = yup.object().shape({
  nome: yup.string().required().max(255),
  dataNascimento: yup.date().required(),
  biografia: yup.string(),
  nacionalidade: yup.string().required(),
});

// Rotas para Livros
app.get("/livros", async (req, res) => {
  const livros = await prisma.livro.findMany();
  res.json(livros);
});

app.get("/livros/:id", async (req, res) => {
  const { id } = req.params;
  const livro = await prisma.livro.findUnique({
    where: { id: parseInt(id) },
  });
  if (!livro) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }
  res.json(livro);
});

app.post("/livros", async (req, res) => {
  try {
    const novoLivro = await livroSchema.validate(req.body);

    // Verifica se já existe um livro com o mesmo ISBN
    const livroExistente = await prisma.livro.findFirst({
      where: { isbn: novoLivro.isbn },
    });

    if (livroExistente) {
      return res
        .status(400)
        .json({ message: "Já existe um livro com este ISBN." });
    }

    // Se não existe, insira o novo livro
    const livro = await prisma.livro.create({ data: novoLivro });
    res.status(201).json(livro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

  app.put("/livros/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await livroSchema.validate(req.body);
      const livro = await prisma.livro.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.json(livro);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

app.delete("/livros/:id", async (req, res) => {
  const { id } = req.params;
  const livro = await prisma.livro.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: "Livro deletado com sucesso" });
});

// Rotas para Autores
app.get("/autores", async (req, res) => {
  const autores = await prisma.autor.findMany();
  res.json(autores);
});

app.get("/autores/:id", async (req, res) => {
  const { id } = req.params;
  const autor = await prisma.autor.findUnique({
    where: { id: parseInt(id) },
  });
  if (!autor) {
    return res.status(404).json({ message: "Autor não encontrado" });
  }
  res.json(autor);
});

app.post("/autores", async (req, res) => {
  try {
    const novoAutor = await autorSchema.validate(req.body);
    const autor = await prisma.autor.create({ data: novoAutor });
    res.status(201).json(autor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/autores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await autorSchema.validate(req.body);
    const autor = await prisma.autor.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(autor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/autores/:id", async (req, res) => {
  const { id } = req.params;
  const autor = await prisma.autor.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: "Autor deletado com sucesso" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
