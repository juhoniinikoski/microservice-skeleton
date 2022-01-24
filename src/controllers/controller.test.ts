import supertest from "supertest";
import app from "../app";
import User from "../models/User";

describe("users", () => {

  describe("quering for users", () => {
    it("should return array of users", async () => {

      const result = await supertest(app).get('/users')
        .expect(200)
        .expect('Content-Type', /json/);

      return expect(result.body.length).toBeDefined();
    });
  });

});


describe("user", () => {

  describe("given the user does not exist", () => {
    it("should return a 404", async () => {
      const userId = "user-123";

      await supertest(app).get(`/users/${userId}`).expect(404);
    });
  });

  describe("given the user with correct id", () => {
    it("should return one user", async () => {
      const userId = "bbe42984-051b-4a01-b45d-b8d29c32200c";

      const result = await supertest(app).get(`/users/${userId}`)
        .expect(200)
        .expect('Content-Type', /json/);

      return expect(result.body.username).toBe("juhoniinikoski");
    });
  });

  describe("creating user succesfully", () => {
    it("should create one user succesfully", async () => {
      
      const user: Partial<User> = {
        username: "juhoniinikoski4",
        email: "testi9@gmail.com",
        password: "password"
      };

      return await supertest(app).post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201);
    });
  });

  describe("updating user attributes", () => {
    
    const userId = "9b9d927e-2ee9-4f93-b96b-c8f677c63a5f";
    
    it("should update one user succesfully", async () => {
      
      const user: Partial<User> = {
        username: "juhoniinikoski12",
        email: "testi112@gmail.com"
      };

      return await supertest(app).put(`/users/${userId}`)
        .send(user)
        .set('Accept', 'application/json')
        .expect(201);
    });

    it("shouldn't update user if username is occupied", async () => {
      
      const user: Partial<User> = {
        username: "juhoniinikoski",
        email: "testi112@gmail.com"
      };

      return await supertest(app).put(`/users/${userId}`)
        .send(user)
        .set('Accept', 'application/json')
        .expect(404);
    });
  });

  describe("creating user fails", () => {
    it("should not create user due to un-unique username", async () => {
      
      const user: Partial<User> = {
        username: "juhoniinikoski",
        email: "testi20@gmail.com",
        password: "password"
      };

      return await supertest(app).post('/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect(400);
    });

    it("should not create user due to un-unique email", async () => {
      
      const user: Partial<User> = {
        username: "juhoniinikoski20",
        email: "testi1@gmail.com",
        password: "password"
      };

      return await supertest(app).post('/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect(400);
    });
  });

});

describe("saved attributes", () => {

  describe("followed users", () => {

    const userId = "bbe42984-051b-4a01-b45d-b8d29c32200c";
    const followingId = "753f3e99-e73a-43a3-9a50-b30d7727c0eb";

    it("should follow a user", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/follow`)
        .send({ followingId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.followedUsers.length).toBe(initial.body.followedUsers.length + 1);
    });
    
    it("should un-follow a user", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/follow`)
        .send({ followingId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.followedUsers.length).toBe(initial.body.followedUsers.length - 1);
    });
  });

  describe("events", () => {

    const userId = "bbe42984-051b-4a01-b45d-b8d29c32200c";
    const eventId = "johnDoe.Testievent";

    it("should save an event", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/events`)
        .send({ eventId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.savedEvents.length).toBe(initial.body.savedEvents.length + 1);
    });
    
    it("should un-save an event", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/events`)
        .send({ eventId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.savedEvents.length).toBe(initial.body.savedEvents.length - 1);
    });
  });

  describe("locations", () => {

    const userId = "bbe42984-051b-4a01-b45d-b8d29c32200c";
    const locationId = "Oulunkylän urheilupuisto1234";

    it("should save a location", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/locations`)
        .send({ locationId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.savedLocations.length).toBe(initial.body.savedLocations.length + 1);
    });
    
    it("should un-save a location", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/locations`)
        .send({ locationId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.savedLocations.length).toBe(initial.body.savedLocations.length - 1);
    });
  });
  
  describe("sports", () => {

    const userId = "bbe42984-051b-4a01-b45d-b8d29c32200c";
    const sportId = "3";

    it("should save a sport", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/sports`)
        .send({ sportId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.savedSports.length).toBe(initial.body.savedSports.length + 1);
    });

    it("sends sport to wrong address -> returns 400", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/locations`)
        .send({ sportId })
        .expect(400);

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.savedSports.length).toBe(initial.body.savedSports.length);
    });
    
    it("should un-save a sport", async () => {

      const initial = await supertest(app).get(`/users/${userId}`);

      await supertest(app).post(`/users/${userId}/sports`)
        .send({ sportId });

      const result = await supertest(app).get(`/users/${userId}`);
      return expect(result.body.savedSports.length).toBe(initial.body.savedSports.length - 1);
    });
  });

});