import { Model, Types, HydratedDocument } from "mongoose";

export abstract class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id).exec();
  }

  async findOne(
    filter: Record<string, any>
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(
    filter: Record<string, any> = {}
  ): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter).exec();
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    const created = new this.model(data);
    return created.save() as Promise<HydratedDocument<T>>;
  }

  async updateById(
    id: string | Types.ObjectId,
    data: Partial<T>
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(
    id: string | Types.ObjectId
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
