import { JsonFileStore } from '../utils/json-file-store'
import { Pet } from '../types/pet-type'
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

    async updateFood(id: number): Promise<Pet | undefined | null> {
        const pets = await this.getAll();
        const petToUpdate = pets.find(pet => pet.id === id);

        if (petToUpdate) {
            if (petToUpdate.weight === 0) return null;

            const updatedPet = petToUpdate;
            petToUpdate.food += 1;
            
            await this.repository.update(id, updatedPet);
            return updatedPet;
        }

        return petToUpdate;
    }

    async updateAge(id: number): Promise<Pet | undefined | null> {
        const pets = await this.getAll();
        const petToUpdate = pets.find(pet => pet.id === id);

        if (petToUpdate) {
            if (petToUpdate.weight === 0) return null;
            const updatedPet: Pet = petToUpdate;
            petToUpdate.age += 1;
            if (petToUpdate.food === 0) {
                petToUpdate.weight -= 1;
            } else {
                petToUpdate.food -= 1;
                petToUpdate.weight += 1;
            }
            
            await this.repository.update(id, updatedPet);
            return updatedPet;
        }

        return petToUpdate;
    }
}