import { defineFactory } from "../src";
import { faker } from "@faker-js/faker";

type User = {
  name: string;
  surname: string;
  email: string;
  premium?: boolean;
};

describe("defineFactory Function", () => {
  it("should create an user object", () => {
    const expectedObj: User = {
      name: "Jon",
      surname: "Doe",
      email: "jon.doe@mail.com",
    };

    const userFactory = defineFactory<User>(() => ({
      name: "Jon",
      surname: "Doe",
      email: "jon.doe@mail.com",
    })).get();

    const user = userFactory.create();

    expect(user).toEqual(expectedObj);
  });

  it("should override generated object if a second param is given", () => {
    const expectedObj = {
      name: "Jon",
      surname: "Doe",
      email: "jon.doe@mail.com",
    };

    const userFactory = defineFactory<typeof expectedObj>(() => ({
      name: "Jon",
      surname: "Doe",
      email: "jon.doe@mail.com",
    })).get();

    const user = userFactory.create(1, () => ({
      name: "Mark",
    }));

    expect(user).toEqual({ ...expectedObj, name: "Mark" });
  });

  it("should create 2 users", () => {
    const userFactory = defineFactory<User>(() => ({
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
    })).get();

    const users = userFactory.create(5);

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(5);
  });

  it("should return an user in array", () => {
    const userFactory = defineFactory<User>(() => ({
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
    })).get();

    const users = userFactory.create(1, null, { forceArray: true });

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(1);
  });

  it("should use states", () => {
    const userFactory = defineFactory<User>(() => ({
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
    }))
      .defineState("premium-account", () => ({
        premium: true,
      }))
      .get();

    const user = userFactory.state("premium-account").create() as User;

    expect(user?.premium).toBe(true);
  });

  it("should throw an error if a state has not been defined", () => {
    const userFactory = defineFactory<User>(() => ({
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
    })).get();

    expect(() => userFactory.state("testing")).toThrow(
      'State with name "testing" is not defined'
    );
  });
});
