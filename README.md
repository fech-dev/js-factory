# JS Factory
This package is inspired by Laravel's factories feature and it help you to generate one or more data object in your tests.

## Installation 
```bash
npm install @federico.mameli/js-factory
```
```bash
yarn add @federico.mameli/js-factory
```

## Basic Usage

To create a factory object, first of all, you have to define the factory. 
This is done using the package's exposed function `defineFactory()`.

This function accepts a `definition`, a function that returns an object, and returns a `FactoryBuilder` object.

The `FactoryBuilder` object allows you to define one or more states (see Factory States section) and get the `Factory` object.

The `Factory` object has two methods: `state()`, which allows you to use a defined state, 
and `create()` which creates one o more objects of definition type.

```js
  import { defineFactory } from "@federico.mameli/js-factory";
  import { faker } from "@faker-js/faker";
  
    const userFactoryBuilder = defineFactory(() => ({
      id: faker.datatype.number(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
      is_active: faker.datatype.boolean(),
      created_at: faker.datatype.datetime()
    }));
    
    const userFactory = userFactoryBuilder.get();
    
    //creates 10 fake users
    const users = userFactory.create(10)
```

## `Factory.create()` method
This method accept 3 parameters: quantity, override and options.

`quantity` specifies how many object should create. Default is 1.

`override` is a function returning an object that will be merge after each state, if any, else will override the base object created.

`options` is an object. 

```typescript
{
  forceArray: boolean
}
```

`options.forceArray` if true, force the return type as array. 
Useful when you have to create a list with one object. 
If false and quantity is 1, the create method will return an object.

## Factory States
States allow you to define modifications that can be applied in diffrent combinations.

The `defineState()` method accepts two parameters: a unique name and the state definition. 

```js
  import { defineFactory } from "@federico.mameli/js-factory";
  import { faker } from "@faker-js/faker";
  
    const userFactory = defineFactory(() => ({
      id: faker.datatype.number(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
      created_at: faker.datatype.datetime()
    }))
      .defineState('active', () => ({ is_active: faker.datatype.boolean() }))
      .defineState('disabled', () => ({ is_active: faker.datatype.boolean() }))
      .defineState('unverifiedEmail', () => ({ email_verified: false }))
      .get()
    
    
    //create 10 basic users 
    userFactory.create(10);
    
    // create 5 disabled users
    userFactory.state('disabled').create(5);
    
    // create 2 users disabled and with unverified email
    userFactory.state('disabled').state('unverifiedEmail').create(2);
```

## Typescript
If you are using typescript, the defineFactory accept a type defining the objects created.

```ts
    import { defineFactory } from "@federico.mameli/js-factory";
    import { faker } from "@faker-js/faker";
    
    type User {
      id: number,
      name: string,
      surname: string,
      email: string,
      is_active: boolean,
      created_at: string
    }
  
    const userFactory = defineFactory<User>(() => ({
      id: faker.datatype.number(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.email(),
      is_active: faker.datatype.boolean(),
      created_at: faker.datatype.datetime()
    }))
    .get();
    
    const users = userFactory.create(10) // -> User[]
    
    // In case of is not a list you have to use `as` keyword
    const user = userFactory.create() as User // -> User

```


