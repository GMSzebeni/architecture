import { FastifyInstance } from "fastify";
import createApp from "../src/app"
import { join } from "node:path";
import { PathLike, unlinkSync } from "node:fs";

let app: FastifyInstance | undefined;
let testDataFile: PathLike | undefined;


beforeEach(async () => {
  const testDataFileName = `test-data-${Date.now()}.json`
  testDataFile = join(__dirname, 'test-data', testDataFileName)
  app = await createApp({ logger: false }, testDataFile);
})

describe('POST /pets', () => {
  it('should create a pet', async () => {
    const name = 'Fluffy'
    const expectedPet = {
      id: 1,
      name: 'Fluffy',
      age: 1,
      weight: 1,
      food: 1
    }

    const response = await app!
      .inject()
      .body({ name })
      .post('/pets')
    const body = JSON.parse(response.body)

    expect(response.statusCode).toStrictEqual(201);
    expect(body).toStrictEqual(expectedPet)
  })
})

describe('GET /pets', () => {
  it('should get the pets', async () => {
    const createPetBody = { name: 'Fluffy' }
    const expectedPets = [
      { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 1 }
    ]

    await app!
      .inject()
      .body(createPetBody)
      .post('/pets')
    const response = await app!
      .inject()
      .get('/pets')
    const body = JSON.parse(response.body)

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPets)
  })
})

describe('GET /pets/{id}', () => {
  it('should get one pet', async () => {
    const createPetBody = { name: 'Fluffy' }
    const expectedPet = { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 1 }

    await app!
      .inject()
      .body(createPetBody)
      .post('/pets')
    const response = await app!
      .inject()
      .get('/pets/1')
    const body = JSON.parse(response.body)

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet)
  })
})

describe('POST /pets/{id}/food', () => {
  it('should increase food by 1', async () => {
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = {
      id: 1,
      name: 'Fluffy',
      age: 1,
      weight: 1,
      food: 2
    };

    await app!
    .inject()
    .body(createPetBody)
    .post('/pets')
    const response = await app!
    .inject()
    .post('/pets/1/food')

    const body = JSON.parse(response.body)

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  })
})

describe('POST /pets/{id}/food', () => {
  it('should increase age by 1, weight by 1 and decrease food by 1', async () => {
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = {
      id: 1,
      name: 'Fluffy',
      age: 2,
      weight: 2,
      food: 0
    };

    await app!
    .inject()
    .body(createPetBody)
    .post('/pets')
    const response = await app!
    .inject()
    .post('/pets/1/age')

    const body = JSON.parse(response.body)

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  })
})

afterEach(() => {
  app?.close();
  unlinkSync(testDataFile!)
})