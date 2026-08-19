import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
      avatar: user.avatar,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true });
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
      avatar: user.avatar,
    };
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
      avatar: user.avatar,
    }));
  }
}
