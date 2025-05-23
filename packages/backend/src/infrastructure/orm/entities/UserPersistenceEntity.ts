import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserPersistenceEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ unique: true, type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  username!: string;

  @Column({ name: 'password_hash', type: 'text' })
  hashedPassword!: string;
}
