import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNoteDto } from './dto/update.note.dto';

@Injectable()
export class NotesService {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  // get all notes by user id
  async getAllNotes(userId: number) {
    return this.prisma.note.findMany({ where: { userId: userId } });
  }

  // get single note by note id
  async getNoteById(noteId: number) {
    return this.prisma.note.findUnique({
      where: { id: noteId },
    });
  }

  // get all notes by folder id
  async getNotesByFolder(folderId: number) {
    return this.prisma.note.findMany({
      where: { folderId: folderId },
    });
  }

  // create note for user
  async createNote(data: {
    title: string;
    content: any;
    deleted: boolean;
    userId: number;
  }) {
    return await this.prisma.note.create({
      data,
    });
  }

  // update note for user
  async updateNote(noteId: number, data: UpdateNoteDto) {
    return await this.prisma.note.update({
      where: { id: noteId },
      data,
    });
  }

  // delete note
  async deleteNote(noteId: number) {
    return await this.prisma.note.delete({
      where: { id: noteId },
    });
  }

  // soft delete note
  async softDeleteNote(noteId: number, deleted: boolean) {
    return await this.prisma.note.update({
      where: { id: noteId },
      data: { deleted: deleted },
    });
  }
}
