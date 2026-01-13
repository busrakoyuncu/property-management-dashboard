import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { UnitType } from '@prisma/client';

export class CreateUnitDto {
  @IsUUID()
  buildingId: string;

  @IsString()
  unitNumber: string;

  @IsEnum(UnitType)
  unitType: UnitType;

  @IsOptional()
  @IsString()
  parkingNumber?: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  entrance?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  sizeSqm?: number;

  @IsOptional()
  @IsInt()
  rooms?: number;

  @IsNumber()
  meaShare: number;

  @IsOptional()
  @IsInt()
  constructionYear?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  specialUseRights?: string;
}
