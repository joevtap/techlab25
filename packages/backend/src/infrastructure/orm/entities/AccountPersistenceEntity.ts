import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { UserPersistenceEntity } from './UserPersistenceEntity';

@Entity({ name: 'accounts' })
export class AccountPersistenceEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ type: 'text' })
  type!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ name: 'number', unique: true, type: 'text' })
  number!: string;

  @Column({ name: 'balance', type: 'integer' })
  balance!: number;

  @ManyToOne(() => UserPersistenceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  owner!: UserPersistenceEntity;
}
