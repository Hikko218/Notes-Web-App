import { IsBoolean } from 'class-validator';

export class SoftDeleteDto {
  @IsBoolean()
  deleted: boolean;
}
