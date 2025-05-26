import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AccountPersistenceEntity } from './AccountPersistenceEntity';

@Entity({ name: 'transactions' })
export class TransactionPersistenceEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({
    name: 'date',
    type: 'datetime',
  })
  date!: Date;

  @Column({ type: 'integer' })
  amount!: number;

  @Column({ type: 'text' })
  type!: string;

  @ManyToOne(() => AccountPersistenceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_account', referencedColumnName: 'number' })
  source!: AccountPersistenceEntity;

  @ManyToOne(() => AccountPersistenceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_account', referencedColumnName: 'number' })
  target!: AccountPersistenceEntity;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
