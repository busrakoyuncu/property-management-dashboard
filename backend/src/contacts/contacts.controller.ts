import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactRole } from '@prisma/client';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll(@Query('role') role?: ContactRole) {
    return this.contactsService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }
}
