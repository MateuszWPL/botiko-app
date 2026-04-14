import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ContactService } from './contact.service';
import {
  createContactSchema,
  type CreateContactDto,
} from './dto/create-contact.dto';

@Controller('api/v1/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public endpoint — marketing contact form (anti-spam throttling)
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(createContactSchema))
  async submit(@Body() dto: CreateContactDto): Promise<void> {
    await this.contactService.submit(dto);
  }
}
