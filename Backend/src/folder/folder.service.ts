import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FolderService {
  // Inject Prisma service
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  // Create new folder for user
  async createFolder(userId: number, name: string) {
    return this.prisma.folder.create({
      data: {
        name,
        userId: Number(userId),
      },
    });
  }

  // Get all folders for user
  async getFoldersByUser(userId: number) {
    return this.prisma.folder.findMany({
      where: { userId: Number(userId) },
      include: { notes: true },
      orderBy: { id: 'asc' },
    });
  }

  // Update folder name
  async updateFolder(folderId: number, name: string) {
    return this.prisma.folder.update({
      where: { id: Number(folderId) },
      data: { name },
    });
  }

  // Delete folder
  async deleteFolder(folderId: number) {
    return this.prisma.folder.delete({
      where: { id: Number(folderId) },
    });
  }
}
