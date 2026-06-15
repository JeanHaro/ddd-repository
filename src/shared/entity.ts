/*
Una Entity:
- Tiene identidad única — un ID
- Dos entidades con el mismo ID son la misma entidad aunque tengan diferentes valores
- Puede cambiar con el tiempo — es mutable
- El ID es inmutable — nunca cambia
*/

export abstract class Entity<TId> {
    protected constructor (
        protected readonly id: TId
    ) {}

    getId(): TId {
        return this.id;
    }

    equals ( other: Entity<TId> ): boolean {
        return JSON.stringify(other.getId()) === JSON.stringify(this.getId());
    }
}