import { IsString, IsBoolean, IsInt } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  deleted: boolean;

  @IsInt()
  userId: number;
}
