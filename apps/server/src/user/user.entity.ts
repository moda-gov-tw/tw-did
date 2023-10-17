import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  id: string;

  @Column({ nullable: false })
  nationalId: string;

  @Column()
  ethereumAccount: string;

  @Column()
  semaphoreCommitment: string;
}
