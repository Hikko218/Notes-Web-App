import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  deleted: boolean;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  folderId?: number;
}
