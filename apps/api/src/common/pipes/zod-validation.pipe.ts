import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    void metadata;
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const formatted = this.formatErrors(result.error);
      throw new BadRequestException({
        message: 'Validation failed',
        details: formatted,
      });
    }
    return result.data;
  }

  private formatErrors(error: ZodError): Record<string, string[]> {
    return error.flatten().fieldErrors as Record<string, string[]>;
  }
}
