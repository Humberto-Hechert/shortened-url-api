import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body('email') email: string, @Body('password') password: string) {
    return this.userService.create(email, password);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post('findMail')
  async findByEmail(@Body('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.update(id, email, password);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
