import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Nonce {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ nullable: false, unique: true })
  value: string;
}
