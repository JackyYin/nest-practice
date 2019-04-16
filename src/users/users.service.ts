import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User> ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne( id: string ): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async remove( id: string ): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
