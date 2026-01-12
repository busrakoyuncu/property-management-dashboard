import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUnitDto } from './create-unit.dto';

// Exclude buildingId from updates - unit cannot change building
export class UpdateUnitDto extends PartialType(
  OmitType(CreateUnitDto, ['buildingId'] as const),
) {}
