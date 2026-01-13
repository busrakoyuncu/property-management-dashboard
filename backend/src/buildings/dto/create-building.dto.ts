import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { BuildingType } from '@prisma/client';

export class CreateBuildingDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  street: string;

  @IsString()
  houseNumber: string;

  @IsString()
  postalCode: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsEnum(BuildingType)
  buildingType?: BuildingType;

  @IsOptional()
  @IsInt()
  constructionYear?: number;

  @IsOptional()
  @IsInt()
  floors?: number;

  @IsOptional()
  @IsBoolean()
  hasElevator?: boolean;

  @IsOptional()
  @IsBoolean()
  isBarrierFree?: boolean;

  @IsOptional()
  @IsString()
  parkingAccess?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
