import fastify from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import cors from '@fastify/cors';
import { readFile, writeFile } from 'node:fs/promises';
import { PathLike, existsSync, writeFileSync } from 'node:fs';
import { PetService } from './business/pet-service';
import { JsonFileStore } from './utils/json-file-store';
import { Pet } from './types/pet-type';
import { PetRepository } from './data-access/pet-repository';

export default async function createApp(options = {}, dataFilePath: PathLike) {
  const app = fastify(options).withTypeProvider<JsonSchemaToTsProvider>();
  await app.register(cors, {});

  const store = new JsonFileStore<Pet>(dataFilePath);
  const petRepository = new PetRepository(store);
  const petService = new PetService(store);

  const postPetSchema = {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
      additionalProperties: false
    }
  } as const

  const getPetSchema = {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'number'
        }
      },
      required: ['id']
    }
  } as const

  app.post(
    '/pets',
    { schema: postPetSchema },
    async (request, reply) => {
      const { name } = request.body

      const newPet = await petService.born(name);
      
      reply.status(201);
      return newPet;
    }
  )

  app.get(
    '/pets',
    async (request, reply) => {
      reply.status(200);
      return petService.getAll();
    }
  )

  app.get(
    '/pets/:id',
    { schema: getPetSchema },
    async (request, reply) => {
      const { id } = request.params;
      reply.status(200);
      return petService.getById(id);
    }
  )

  app.post(
    '/pets/:id/food',
    { schema: getPetSchema },
    async (request, reply) => {
      const { id } = request.params;
      const fedPet = await petService.updatePet(id, "food");
      if (fedPet) {
        reply.status(200);
        return fedPet;
      } else if (fedPet === null) {
        reply.status(409);
        return "The pet is dead."
      } else {
        reply.status(404);
        return "Pet is not found."
      }
    }
  )

  return app;
}