import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ManagementType, BuildingType, UnitType } from '@prisma/client';

// Nested DTO for creating units within a building
export class CreateUnitNestedDto {
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

// Nested DTO for creating buildings within a property
export class CreateBuildingNestedDto {
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUnitNestedDto)
  units?: CreateUnitNestedDto[];
}

export class CreatePropertyDto {
  @IsString()
  propertyNumber: string;

  @IsString()
  name: string;

  @IsEnum(ManagementType)
  managementType: ManagementType;

  // Land registry
  @IsOptional()
  @IsString()
  landRegistryDistrict?: string;

  @IsOptional()
  @IsString()
  landRegistrySheet?: string;

  @IsOptional()
  @IsString()
  cadastralDistrict?: string;

  @IsOptional()
  @IsString()
  cadastralParcel?: string;

  @IsOptional()
  @IsString()
  cadastralPlot?: string;

  @IsOptional()
  @IsNumber()
  totalAreaSqm?: number;

  // Co-ownership
  @IsOptional()
  @IsInt()
  totalMea?: number;

  // Legal reference
  @IsOptional()
  @IsString()
  notaryReference?: string;

  @IsOptional()
  @IsDateString()
  declarationDate?: string;

  // Technical
  @IsOptional()
  @IsString()
  energyStandard?: string;

  @IsOptional()
  @IsString()
  heatingType?: string;

  // Original owner
  @IsOptional()
  @IsString()
  originalOwner?: string;

  // Contacts
  @IsOptional()
  @IsString()
  propertyManagerId?: string;

  @IsOptional()
  @IsString()
  accountantId?: string;

  @IsOptional()
  @IsInt()
  managerAppointmentYears?: number;

  // Nested buildings with units
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBuildingNestedDto)
  buildings?: CreateBuildingNestedDto[];
}
