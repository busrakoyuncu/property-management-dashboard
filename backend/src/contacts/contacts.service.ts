import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactRole } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  async findAll(role?: ContactRole) {
    return this.prisma.contact.findMany({
      where: role ? { role } : undefined,
      orderBy: { companyName: 'asc' },
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        managedProperties: true,
        accountedProperties: true,
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }
}
