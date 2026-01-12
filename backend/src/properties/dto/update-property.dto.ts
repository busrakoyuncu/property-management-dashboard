import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';

// Exclude nested buildings from update - they should be managed separately
export class UpdatePropertyDto extends PartialType(
  OmitType(CreatePropertyDto, ['buildings'] as const),
) {}
