import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactRateLimitService } from './contact-rate-limit.service';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ContactRateLimitService],
})
export class ContactModule {}
