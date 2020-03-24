import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../src/app";
import db from "../../src/db/mongoose";
import { Task, User } from "../../src/models";

const defaultUserId = new Types.ObjectId();
const defaultUser = {
  _id: defaultUserId,
  name: "Mikaila",
  password: "123456",
  email: "shia@gmail.com",
  tokens: [{ token: jwt.sign({ _id: defaultUserId }, process.env.JWT_SECRET) }]
};

const task1Id = new Types.ObjectId();
const task1 = {
  _id: task1Id,
  description: "Do the laundry",
  owner: defaultUserId
};

describe("Test Task routes", () => {
  beforeAll(async () => {
    await db.start();
    await User.deleteMany();
    await new User(defaultUser).save();
  });

  beforeEach(async () => {
    await Task.deleteMany();
    await new Task(task1).save();
  });

  afterAll(async () => await db.disconnect());

  it("Should create task", async () => {
    await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send({
        description: "Takeout the garbage"
      })
      .expect(201);
  });

  it("Should get user tasks", async () => {
    await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it("Should get one task", async () => {
    await request(app)
      .get(`/tasks/${task1Id.toHexString()}`)
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it("Should no get inexistent task", async () => {
    await request(app)
      .get(`/tasks/5d8373ac3aae452d152ac212}`)
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(404);
  });

  it("Should update one task", async () => {
    const response = await request(app)
      .patch(`/tasks/${task1Id.toHexString()}`)
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send({
        description: "Do Yoga",
        completed: true
      })
      .expect(200);

      expect(response.body).toMatchObject({
        description: "Do Yoga",
        completed: true
      });
  });

  it("Should delete task", async () => {
    await request(app)
      .delete(`/tasks/${task1Id.toHexString()}`)
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it("Should not delete inexistent task", async () => {
    await request(app)
      .delete(`/tasks/5d8373ac3aae452d152ac212}`)
      .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
      .send()
      .expect(404);
  });

});
