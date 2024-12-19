import { BadRequestError } from '@services/utils/errorHandler';
import { Request } from 'express';
import { Schema } from 'zod';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function schemaValidation(schema: Schema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error} = await Promise.resolve(schema.safeParse(req.body));
      if (error) {
        throw new BadRequestError(error.message,400)
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}