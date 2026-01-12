import { IsEnum, IsString, IsOptional, IsEmail } from 'class-validator';
import { ContactRole } from '@prisma/client';

export class CreateContactDto {
  @IsEnum(ContactRole)
  role: ContactRole;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  houseNumber?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
