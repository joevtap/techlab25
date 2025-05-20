import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../../../../auth/infrastructure/orm/entities';
import { AccountTypeEnum } from '../../../domain/value-objects/AccountType';

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Column({ name: 'account_number', unique: true, type: 'text' })
  accountNumber!: string;

  @Column({
    type: 'enum',
    enum: ['CHECKING', 'SAVINGS', 'INVESTMENTS'],
    default: 'CHECKING',
  })
  type!: AccountTypeEnum;

  @Column({ name: 'balance', type: 'integer' })
  balance!: number;

  @Column({ name: 'owner_id', type: 'text' })
  ownerId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner!: UserEntity;
}
