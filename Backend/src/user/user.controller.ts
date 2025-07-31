import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Logger,
  BadRequestException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('user')
export class UserController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id') userId: number) {
    try {
      const user = await this.userService.getUserbyId(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      Logger.log('Successfully retrieved user');
      return user;
    } catch (error) {
      Logger.error(`Error retrieving user ${userId}: ${error}`);
      throw new NotFoundException('User not found');
    }
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      Logger.log('Successfully created user');
      return user;
    } catch (error) {
      Logger.error(`Error creating user: ${error}`);
      throw new BadRequestException('Cannot create user');
    }
  }

  @Put(':id')
  @HttpCode(200)
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.updateUser(userId, updateUserDto);
      Logger.log('Successfully updated user');
      return user;
    } catch (error) {
      Logger.error(`Error updating user ${userId}: ${error}`);
      throw new BadRequestException('Cannot update user');
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id') userId: number) {
    try {
      await this.userService.deleteUser(userId);
      Logger.log('Successfully deleted user');
      return { success: true };
    } catch (error) {
      Logger.error(`Error deleting user ${userId}: ${error}`);
      throw new BadRequestException('Cannot delete user');
    }
  }
}
