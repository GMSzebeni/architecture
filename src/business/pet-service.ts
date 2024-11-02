import {JsonFileStore} from '../utils/json-file-store'
import {Pet} from '../types/pet-type'
import { PetRepository } from '../data-access/pet-repository';

export class PetService {
    private readonly repository;

    constructor(store: JsonFileStore<Pet>) {
        this.repository = new PetRepository(store);
    }

    async born(name: string) {
        const createdPet = await this.repository.create({
            name,
            food: 1,
            weight: 1,
            age: 1
        });
        return createdPet;
    }

    async getAll() {
        return await this.repository.readAll();
    }

    async getById(id: number) {
        return await this.repository.readById(id);
    }
}