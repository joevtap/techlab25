import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AccountEntity } from '../../../account/infrastructure/orm/entities/AccountEntity';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({
    type: 'enum',
    enum: ['CREDIT', 'DEBIT', 'TRANSFER'],
  })
  type!: string;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'from_id', referencedColumnName: 'id' })
  from!: AccountEntity;

  @Column({ name: 'from_id', type: 'text', nullable: true })
  fromId!: string;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'to_id', referencedColumnName: 'id' })
  to!: AccountEntity;

  @Column({ name: 'to_id', type: 'text', nullable: true })
  toId!: string;

  @Column({ type: 'integer' })
  value!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;
}
