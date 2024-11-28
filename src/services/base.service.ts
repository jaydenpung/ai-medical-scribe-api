import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";

export abstract class BaseService<T extends { id: string }> {
   protected abstract repository: Repository<T>;
   protected relations: string[] = [];
 
   async create(data: DeepPartial<T>): Promise<T> {
       const entity = this.repository.create(data);
       return this.repository.save(entity as T);
   }

   async findOne(id: string): Promise<T | null> {
       return this.repository.findOne({ 
           where: { id } as FindOptionsWhere<T>,
           relations: this.relations
       });
   }

   async findAll(): Promise<T[]> {
       return this.repository.find({ 
           relations: this.relations,
           order: { createdAt: 'DESC' } as any
       });
   }

   async update(id: string, data: DeepPartial<T>): Promise<T | null> {
       await this.repository.update(id, data as any);
       return this.findOne(id);
   }

   async delete(id: string): Promise<boolean> {
       const result = await this.repository.delete(id);
       return !!result.affected;
   }
}