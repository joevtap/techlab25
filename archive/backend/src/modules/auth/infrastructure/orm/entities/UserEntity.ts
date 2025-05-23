import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({ type: 'text', nullable: false })
  id!: string;

  @Column({ unique: true, type: 'text' })
  email!: string;

  @Column({ type: 'text' })
  username!: string;

  @Column({ name: 'password_hash', type: 'text' })
  hashedPassword!: string;
}
