// server.test.js
const request = require("supertest"); 
const app = require("./server"); 

describe("Testes para a rota /livros", () => {
  it("Deve retornar uma lista de livros", async () => {
    const response = await request(app).get("/livros");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, titulo: "Livro 1" },
      { id: 2, titulo: "Livro 2" },
    ]);
  });
});
