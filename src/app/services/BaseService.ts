import { BaseRepository } from "../repositories/BaseRepository";
import { AppException } from "../exceptions/AppException";

export abstract class BaseService<T> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async findById(id: string) {
    const result = await this.repository.findById(id);
    if (!result) throw new AppException("Resource not found", 404);
    return result;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async create(data: Partial<T>) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>) {
    const updated = await this.repository.updateById(id, data);
    if (!updated) throw new AppException("Resource not found", 404);
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.repository.deleteById(id);
    if (!deleted) throw new AppException("Resource not found", 404);
  }
}
