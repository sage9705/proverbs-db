const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Proverb = require("../models/Proverb");

beforeEach(async () => {
  await Proverb.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Proverb API", () => {
  it("should create a new proverb", async () => {
    const res = await request(app).post("/api/proverbs").send({
      text: "Test proverb",
      language: "en",
      source: "Test",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("text", "Test proverb");
  });

  it("should fetch proverbs", async () => {
    await Proverb.create({
      text: "Test proverb",
      language: "en",
      source: "Test",
    });
    const res = await request(app).get("/api/proverbs");
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).toBeGreaterThan(0);
  });
});
