import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../src/app";
import db from "../../src/db/mongoose";
import { User } from "../../src/models";

const defaultUserId = new Types.ObjectId();
const defaultUser = {
  _id: defaultUserId,
  name: "Mikaila",
  password: "123456",
  email: "mika@gmail.com",
  tokens: [{ token: jwt.sign({ _id: defaultUserId }, process.env.JWT_SECRET) }],
  avatar: Buffer.from("__tests__/fixtures/sa.jpeg")
};

describe("Test User routes", () => {
  beforeAll(async () => await db.start());

  beforeEach(async () => {
    await User.deleteMany();
    await new User(defaultUser).save();
  });

  afterAll(async () => await db.disconnect());

  it("Should signup a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "Diego",
        email: "diego@mail.com",
        password: "123456"
      })
      .expect(201);

    const savedUser = await User.findById(response.body.user._id);

    expect(savedUser).toMatchObject({
      name: "Diego",
      email: "diego@mail.com"
    });
  });

  it("Should hash user password", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "Diego",
        email: "diego@mail.com",
        password: "123456"
      })
      .expect(201);

    expect(response.body.user.password).not.toBe("123456");
  });

  it("Should update user", async () => {
    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send({
        name: "Diego"
      })
      .expect(200);

    expect(response.body).toMatchObject({
      _id: defaultUserId.toHexString(),
      name: "Diego",
      email: defaultUser.email
    });
  });

  it("Should not update invalid user fields", async () => {
    await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send({
        homeAddress: "Vancouver, BC"
      })
      .expect(400);
  });

  it("Should login user", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "mika@gmail.com",
        password: "123456"
      })
      .expect(200);
  });

  it("Should not login nonexistent user", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "pepe@mail.com",
        password: "123456"
      })
      .expect(401);
  });

  it("Should delete user account", async () => {
    await request(app)
      .delete("/users/me")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it("Should not delete user account if unauthenticated", async () => {
    await request(app)
      .delete("/users/me")
      .send()
      .expect(401);
  });

  it("Should logout user", async () => {
    await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it("Should logout user from all", async () => {
    await request(app)
      .post("/users/logoutAll")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it("Should get my user", async () => {
    await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it("Should upload avatar", async () => {
    await request(app)
      .post("/users/me/avatar")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .attach("avatar", "__tests__/fixtures/sa.jpeg")
      .expect(200);
  });

  it("Should get avatar", async () => {
    await request(app)
      .get(`/users/${defaultUserId}/avatar`)
      .send()
      .expect(200);
  });
});
