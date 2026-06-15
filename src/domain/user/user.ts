/*
User es una Entity con:
- UserId como ID
- name: string
- email: Email

Métodos de dominio:
- changeName(name: string): Result<void>
- changeEmail(email: Email): void
*/

// Shared - Entity
import { Entity } from "../../shared/entity";

// Shared - Result
import { Result } from "../../shared/result";

// Domain - User
import { Email } from "./email";
import { UserId } from "./user-id";

export class User extends Entity<UserId> {
    private constructor (
        id: UserId,
        private name: string,
        private email: Email,
    ) {
        super(id);
    }

    static create (
        id: UserId,
        name: string,
        email: Email,
    ): Result<User> {
        if ( name.trim().length === 0 ) {
            return Result.fail('El nombre no puede estar vacío');
        }


        return Result.ok(new User(id, name, email))
    }

    // Getters
    getName(): string {
        return this.name;
    }

    getEmail(): Email {
        return this.email;
    }

    // Métodos de dominio
    changeName ( name: string ): Result<void> {
        if ( name.trim().length === 0 ) {
            return Result.fail('El nombre no puede ser un valor vacío');
        }

        this.name = name;

        return Result.ok();
    }

    changeEmail ( email: Email ): void {
        this.email = email;
    }
}