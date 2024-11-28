import { Request, RequestHandler, Response, NextFunction } from "express";

export abstract class BaseController<T> {
  protected abstract service: any;
  protected abstract entityName: string;

  create: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const entity = await this.service.create(req.body);
      res.status(201).json(entity);
    } catch (error) {
      next(error);
    }
  };

  findAll: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const entities = await this.service.findAll();
      res.json(entities);
    } catch (error) {
      next(error);
    }
  };

  findOne: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const entity = await this.service.findOne(req.params.id);
      if (!entity) {
        res.status(404).json({ message: `${this.entityName} not found` });
        return;
      }
      res.json(entity);
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ message: `${this.entityName} not found` });
        return;
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deleted = await this.service.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: `${this.entityName} not found` });
        return;
      }
      res.json({ message: `${this.entityName} deleted` });
    } catch (error) {
      next(error);
    }
  };
}
