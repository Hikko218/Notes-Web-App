import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNoteDto } from './dto/update.note.dto';

@Injectable()
export class NotesService {
  // Inject Prisma service
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  // Get all notes for user (not deleted)
  async getAllNotes(userId: number) {
    return this.prisma.note.findMany({
      where: { userId: userId, deleted: false },
      orderBy: { id: 'asc' },
    });
  }

  // Get all deleted notes for user
  async getAllDelNotes(userId: number) {
    return this.prisma.note.findMany({
      where: { userId: userId, deleted: true },
      orderBy: { id: 'asc' },
    });
  }

  // Get single note by note id
  async getNoteById(noteId: number) {
    return this.prisma.note.findUnique({
      where: { id: noteId },
    });
  }

  // Get all notes by folder id
  async getNotesByFolder(folderId: number) {
    return this.prisma.note.findMany({
      where: { folderId: folderId },
    });
  }

  // Create note for user
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

  // Update note for user
  async updateNote(noteId: number, data: UpdateNoteDto) {
    return await this.prisma.note.update({
      where: { id: noteId },
      data,
    });
  }

  // Delete note
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
