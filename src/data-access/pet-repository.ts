import { Pet, PetProperties } from '../types/pet-type'
import { JsonFileStore } from '../utils/json-file-store';

function getNextId<T extends { id: number }>(items: T[]) {
    if (items.length === 0) {
        return 1;
    }
    const ids = items.map(item => item.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
}

export class PetRepository {
    private readonly store;

    constructor(store: JsonFileStore<Pet>) {
        this.store = store;
    }

    async readAll(): Promise<Pet[]> {
        return await this.store.read();
    }

    async save(pets: Pet[]): Promise<void> {
        await this.store.write(pets);
    }

    async readById(id: number): Promise<Pet | undefined> {
        const pets = await this.readAll();
        return pets.find(pets => pets.id === id);
    }

    async create(petProperties: PetProperties): Promise<Pet> {
        const pets = await this.readAll();
        const nextId = getNextId(pets);

        const newPet = {
            ...petProperties,
            id: nextId
        };

        pets.push(newPet);
        await this.save(pets);

        return newPet;
    }

    async update(id: number, key: "food" | "age"): Promise<Pet | undefined | null> {
        const pets = await this.readAll();
        const petToUpdate = pets.find(pet => pet.id === id);

        if (petToUpdate) {
            if (petToUpdate.weight === 0) return null;
            const updatedPet = {
                ...petToUpdate,
                [key]: (petToUpdate[key]++)
            }
            await this.save(pets);
            return updatedPet;
        }

        return petToUpdate;
    }

    delete(id: number): Promise<void> {
        throw new Error('Not implemented')
    }
}