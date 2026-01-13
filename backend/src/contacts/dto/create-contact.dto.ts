import { IsEnum, IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import type { ContactRole } from '@prisma/client';
import { ContactRole as ContactRoleEnum } from '@prisma/client';

export class CreateContactDto {
  @IsEnum(ContactRoleEnum)
  role: ContactRole;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  street?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  houseNumber?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  postalCode?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  city?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  phone?: string;
}
