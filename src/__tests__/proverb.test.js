const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Proverb = require("../models/Proverb");
const config = require("../config/config");

// Increase timeout for all tests
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
});

beforeEach(async () => {
  try {
    await Proverb.deleteMany();
    console.log("Cleared proverbs collection");
  } catch (error) {
    console.error("Error clearing proverbs collection:", error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("Closed MongoDB connection");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
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
