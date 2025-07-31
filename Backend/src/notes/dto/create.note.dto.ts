import { IsString, IsBoolean, IsInt, IsObject } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsObject()
  content: any;

  @IsBoolean()
  deleted: boolean;

  @IsInt()
  userId: number;
}
