import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ContactRateLimitService } from './contact-rate-limit.service';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { ContactMessageResponse, ContactSubmitResponse } from './interfaces/contact-message.interface';

type AuthenticatedRequest = Request & {
  user: AuthUser;
};

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly rateLimitService: ContactRateLimitService,
  ) {}

  @Post()
  submit(
    @Req() request: Request,
    @Body() createContactMessageDto: CreateContactMessageDto,
  ): Promise<ContactSubmitResponse> {
    this.rateLimitService.assertAllowed(this.getRateLimitKey(request, createContactMessageDto.email));
    return this.contactService.submit(createContactMessageDto);
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  findMessages(@Req() request: AuthenticatedRequest): Promise<ContactMessageResponse[]> {
    this.assertAdmin(request.user);
    return this.contactService.findMessages();
  }

  @Patch('messages/:id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ContactMessageResponse> {
    this.assertAdmin(request.user);
    return this.contactService.markAsRead(id);
  }

  @Delete('messages/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@Req() request: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.assertAdmin(request.user);
    await this.contactService.delete(id);
  }

  private assertAdmin(user: AuthUser): void {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access is required');
    }
  }

  private getRateLimitKey(request: Request, email: string): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
    const ip = forwardedIp?.trim() || request.ip || 'unknown';

    return `${ip}:${email.toLowerCase()}`;
  }
}
