import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FolderService {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  async createFolder(userId: number, name: string) {
    return this.prisma.folder.create({
      data: {
        name,
        userId: Number(userId),
      },
    });
  }

  async getFoldersByUser(userId: number) {
    return this.prisma.folder.findMany({
      where: { userId: Number(userId) },
      include: { notes: true },
    });
  }

  async updateFolder(folderId: number, name: string) {
    return this.prisma.folder.update({
      where: { id: Number(folderId) },
      data: { name },
    });
  }

  async deleteFolder(folderId: number) {
    return this.prisma.folder.delete({
      where: { id: Number(folderId) },
    });
  }
}
