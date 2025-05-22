import { Id } from '../entities/types';

export interface IRepository<T> {
  findById(id: Id): Promise<T | null>;
  findAll(): Promise<T[]>;
  add(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  remove(id: Id): Promise<void>;
}
