import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import {
  ContactMessageResponse,
  ContactMessageStatusValue,
  ContactSubmitResponse,
} from './interfaces/contact-message.interface';

type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactMessageStatusValue;
  createdAt: Date;
  updatedAt: Date;
};

type ContactMessageWriteData = {
  name?: string;
  email?: string;
  subject?: string | null;
  message?: string;
  status?: ContactMessageStatusValue;
};

type ContactMessageDelegate = {
  findMany(args: {
    orderBy: Array<{ status: 'asc' } | { createdAt: 'desc' }>;
  }): Promise<ContactMessageRecord[]>;
  create(args: { data: ContactMessageWriteData }): Promise<ContactMessageRecord>;
  update(args: {
    where: { id: string };
    data: ContactMessageWriteData;
  }): Promise<ContactMessageRecord>;
  delete(args: { where: { id: string } }): Promise<{ id: string }>;
};

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(createContactMessageDto: CreateContactMessageDto): Promise<ContactSubmitResponse> {
    if (createContactMessageDto.website) {
      throw new BadRequestException('Invalid contact submission');
    }

    const contactMessage = await this.contactMessageDelegate.create({
      data: {
        name: createContactMessageDto.name,
        email: createContactMessageDto.email,
        subject: createContactMessageDto.subject || null,
        message: createContactMessageDto.message,
      },
    });

    return {
      id: contactMessage.id,
      status: 'received',
      message: 'Message received',
    };
  }

  async findMessages(): Promise<ContactMessageResponse[]> {
    const messages = await this.contactMessageDelegate.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    return messages.map((message) => this.toContactMessageResponse(message));
  }

  async markAsRead(id: string): Promise<ContactMessageResponse> {
    try {
      const message = await this.contactMessageDelegate.update({
        where: { id },
        data: {
          status: ContactMessageStatusValue.Read,
        },
      });

      return this.toContactMessageResponse(message);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.contactMessageDelegate.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private get contactMessageDelegate(): ContactMessageDelegate {
    return (this.prisma as unknown as { contactMessage: ContactMessageDelegate }).contactMessage;
  }

  private toContactMessageResponse(message: ContactMessageRecord): ContactMessageResponse {
    return {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      status: message.status,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  private handlePrismaError(error: unknown): never {
    if (this.getErrorCode(error) === 'P2025') {
      throw new NotFoundException('Contact message not found');
    }

    throw error;
  }

  private getErrorCode(error: unknown): string | undefined {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
      return undefined;
    }

    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
}
