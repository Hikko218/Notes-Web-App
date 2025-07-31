import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Logger } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create.note.dto';
import { UpdateNoteDto } from './dto/update.note.dto';
import { SoftDeleteDto } from './dto/delete.note.dto';
import { HttpCode } from '@nestjs/common';

@Controller('notes')
export class NotesController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly notesService: NotesService) {}

  // GET /notes/:userId
  @Get('user/:userId')
  @HttpCode(200)
  async getAllNotes(@Param('userId') userId: number) {
    try {
      const notes = await this.notesService.getAllNotes(Number(userId));
      if (!notes) {
        throw new NotFoundException('Cant get notes');
      }
      Logger.log('Successfully retrieved notes');
      return notes;
    } catch (error) {
      Logger.error(`Error retrieving notes for user ${userId}: ${error}`);
      throw new NotFoundException('Cant get notes');
    }
  }

  // GET /notes/:noteId
  @Get(':noteId')
  @HttpCode(200)
  async getNoteById(@Param('noteId') noteId: number) {
    try {
      const note = await this.notesService.getNoteById(Number(noteId));
      if (!note) {
        throw new NotFoundException('Cant get note');
      }
      Logger.log('Successfully retrieved note');
      return note;
    } catch (error) {
      Logger.error(`Error retrieving note ${noteId}: ${error}`);
      throw new NotFoundException('Cant get note');
    }
  }

  // POST /notes
  @Post()
  @HttpCode(201)
  async createNote(@Body() data: CreateNoteDto) {
    try {
      await this.notesService.createNote(data);
      Logger.log(`Successfully creating note`);
      return { success: true };
    } catch (error) {
      Logger.error(`Error creating note: ${error}`);
      throw new BadRequestException('Cant create note');
    }
  }

  // PUT /notes/:noteId
  @Put(':noteId')
  @HttpCode(200)
  async updateNote(
    @Param('noteId') noteId: number,
    @Body() data: UpdateNoteDto,
  ) {
    try {
      await this.notesService.updateNote(Number(noteId), data);
      Logger.log(`Successfully updating note`);
      return { success: true };
    } catch (error) {
      Logger.error(`Error updating note: ${error}`);
      throw new BadRequestException('Cant update note');
    }
  }

  // DELETE /note/:noteID
  @Delete(':noteId')
  @HttpCode(200)
  async deleteNote(@Param('noteId') noteId: number) {
    try {
      await this.notesService.deleteNote(Number(noteId));
      Logger.log('Note successfully deleted');
      return { success: true };
    } catch (error) {
      Logger.error(`Error deleting note ${noteId}: ${error}`);
      throw new BadRequestException('Cant delete note');
    }
  }

  // Soft DELETE /note/:noteID
  @Put('softDelete/:noteId')
  @HttpCode(200)
  async softdeleteNote(
    @Param('noteId') noteId: number,
    @Body() data: SoftDeleteDto,
  ) {
    try {
      await this.notesService.softDeleteNote(Number(noteId), data.deleted);
      Logger.log('Note successfully deleted');
      return { success: true };
    } catch (error) {
      Logger.error(`Error deleting note ${noteId}: ${error}`);
      throw new BadRequestException('Cant delete note');
    }
  }
}
