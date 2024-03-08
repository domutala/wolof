import {
  BaseEntity as TypeormBAseEntity,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
  Column,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { validate } from "class-validator";

export class Base extends TypeormBAseEntity {
  @PrimaryColumn({ type: "uuid", nullable: false })
  id!: string;

  @Column({ type: "date" })
  createdAt: Date;

  @Column({ type: "date" })
  updatedAt: Date;

  @BeforeInsert()
  onInsert() {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async onSave() {
    this.updatedAt = new Date();

    const errors = await validate(this);
    if (errors.length) {
      throw errors
        .map((error) => Object.values(error.constraints).join(";"))
        .join(";");
    }
  }
}
