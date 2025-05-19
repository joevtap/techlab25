import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true, type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  username!: string;

  @Column({ name: 'password_hash' })
  hashedPassword!: string;
}
