import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Logger,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { HttpCode } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Controller('folder')
export class FolderController {
  private readonly logger = new Logger(FolderController.name);

  // Service injection
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly folderService: FolderService) {}

  // POST /folder: Create new folder
  @Post()
  @HttpCode(201)
  async createFolder(@Body() body: { userId: number; name: string }) {
    try {
      const { userId, name } = body;
      await this.folderService.createFolder(userId, name);
      Logger.log('Folder created');
      return { success: true };
    } catch (error) {
      Logger.error('Error creating folder', error);
      throw new BadRequestException('Error creating folder');
    }
  }

  // GET /folder/user/:userId: Get folders for user
  @Get('/user/:userId')
  @HttpCode(200)
  async getFoldersByUser(@Param('userId') userId: number) {
    try {
      const folders = await this.folderService.getFoldersByUser(userId);
      Logger.log('Successfully retrieved folder');
      return folders;
    } catch (error) {
      Logger.error('Error fetching folders', error);
      throw new NotFoundException('Cant get folder');
    }
  }

  // PUT /folder/:folderId: Update folder name
  @Put('/:folderId')
  @HttpCode(200)
  async updateFolder(
    @Param('folderId') folderId: number,
    @Body() body: { name: string },
  ) {
    try {
      const { name } = body;
      await this.folderService.updateFolder(folderId, name);
      Logger.log('Folder updated');
      return { success: true };
    } catch (error) {
      Logger.error('Error updating folder', error);
      throw new NotFoundException('Error updating folder');
    }
  }

  @Delete('/:folderId')
  @HttpCode(200)
  async deleteFolder(@Param('folderId') folderId: number) {
    try {
      await this.folderService.deleteFolder(folderId);
      Logger.log('Folder deleted');
      return { success: true };
    } catch (error) {
      Logger.error('Error deleting folder', error);
      throw new NotFoundException('Can not delete folder');
    }
  }
}
