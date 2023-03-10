const supertest = require("supertest");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

//const truncate = require('../../utils/truncate');
const factories = require("../../../testUtils/factories");
const app = require("../../../app");

describe("orderController Test Suit", () => {
  beforeEach(async () => {
    await exec("sequelize db:migrate:undo:all");

    return exec("sequelize db:migrate");
    //return truncate();
  });

  it("should create an buy order", async () => {
    const user = await factories.create("User");
    const address = await factories.create("Address", { user_id: user.id });
    const category = await factories.create("Category");
    const product = await factories.create("Product", {
      category_id: category.id,
    });
    const token = user.generateToken();

    const response = await supertest(app)
      .post(`/orders`)
      .set("authorization", "Bearer " + token)
      .send({
        freight_name: "sedex",
        freight_price: 30.77,
        quantity_buyed: [2],
        products_id: [product.id],
        address_id: address.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it('should return code 400 for "user not found" - store', async () => {
    const user = await factories.create("User");
    const token = user.generateToken();
    const address = await factories.create("Address", { user_id: user.id });
    await user.destroy();

    const category = await factories.create("Category");
    const product = await factories.create("Product", {
      category_id: category.id,
    });

    const response = await supertest(app)
      .post(`/orders`)
      .set("authorization", "Bearer " + token)
      .send({
        freight_name: "sedex",
        freight_price: 30.77,
        quantity_buyed: [2],
        products_id: [product.id],
        address_id: address.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("user not found");
  });

  it('should return code 400 for "address not found" - store', async () => {
    const user = await factories.create("User");
    const token = user.generateToken();

    const category = await factories.create("Category");
    const product = await factories.create("Product", {
      category_id: category.id,
    });

    const response = await supertest(app)
      .post(`/orders`)
      .set("authorization", "Bearer " + token)
      .send({
        freight_name: "sedex",
        freight_price: 3077,
        quantity_buyed: [2],
        products_id: [product.id],
        address_id: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("address not found");
  });

  it('should return code 400 for "must have at least one product" - store', async () => {
    const user = await factories.create("User");
    const address = await factories.create("Address", { user_id: user.id });
    const token = user.generateToken();

    const response = await supertest(app)
      .post(`/orders`)
      .set("authorization", "Bearer " + token)
      .send({
        freight_name: "sedex",
        freight_price: 3077,
        quantity_buyed: [2],
        products_id: [],
        address_id: address.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"products_id" does not contain 1 required value(s)'
    );
  });

  it('should return code 400 for "product id not found" - store', async () => {
    const user = await factories.create("User");
    const token = user.generateToken();
    const address = await factories.create("Address", { user_id: user.id });

    const response = await supertest(app)
      .post(`/orders`)
      .set("authorization", "Bearer " + token)
      .send({
        freight_name: "sedex",
        freight_price: 3077,
        quantity_buyed: [2],
        products_id: [1],
        address_id: address.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("product id 1 not found");
  });

  it('should return code 400 for "product dont have enough stock" - store', async () => {
    const user = await factories.create("User");
    const token = user.generateToken();
    const address = await factories.create("Address", { user_id: user.id });

    const category = await factories.create("Category");
    const product = await factories.create("Product", {
      category_id: category.id,
      quantity_stock: 2,
    });

    const response = await supertest(app)
      .post(`/orders`)
      .set("authorization", "Bearer " + token)
      .send({
        freight_name: "sedex",
        freight_price: 3077,
        quantity_buyed: [5],
        products_id: [product.id],
        address_id: address.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `product id ${product.id} dont have enough stock`
    );
  });
});
