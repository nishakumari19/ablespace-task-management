import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Workspace, WorkspaceDocument } from '../schemas/workspace.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
    private jwtService: JwtService,
  ) {}

  async guestLogin() {
    let user = await this.userModel.findOne({ email: 'dexter@example.com' });

    if (!user) {
      user = await this.userModel.create({
        email: 'dexter@example.com',
        name: 'Dexter',
        username: 'dexter_dev',
        title: 'Full Stack Engineer',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
        isGuest: true,
      });

      await this.workspaceModel.create({
        name: "Dexter's Workspace",
        slug: 'dexter-workspace',
        ownerId: user._id,
      });
    }

    const workspace = await this.workspaceModel.findOne({ ownerId: user._id });

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        title: user.title,
        avatar: user.avatar,
        isGuest: user.isGuest,
      },
      workspace: workspace
        ? {
            id: workspace._id.toString(),
            name: workspace.name,
            slug: workspace.slug,
          }
        : null,
    };
  }
}
