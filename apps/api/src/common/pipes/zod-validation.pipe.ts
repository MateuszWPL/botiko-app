import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { type ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body') {
      return value;
    }
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const formatted = this.formatErrors(result.error);
      throw new BadRequestException({
        message: 'Walidacja nie powiodła się',
        details: formatted,
      });
    }
    return result.data;
  }

  private formatErrors(error: ZodError): Record<string, unknown> {
    const flat = error.flatten();
    return {
      ...(flat.formErrors.length > 0 && { _root: flat.formErrors }),
      ...(flat.fieldErrors as Record<string, string[]>),
    };
  }
}
