import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    public constructor(id: number, firstName: string) {
      this.id = id;
      this.firstName = firstName;
    }
}
