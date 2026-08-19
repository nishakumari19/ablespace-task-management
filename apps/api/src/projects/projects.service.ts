import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { Workspace, WorkspaceDocument } from '../schemas/workspace.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
  ) {}

  async findAll(workspaceId?: string) {
    let filter: any = {};
    if (workspaceId && Types.ObjectId.isValid(workspaceId)) {
      filter.workspaceId = new Types.ObjectId(workspaceId);
    }

    const projects = await this.projectModel
      .find(filter)
      .populate('leadId', 'name email avatar title')
      .sort({ createdAt: -1 });

    return projects.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      priority: p.priority,
      dueDate: p.dueDate,
      lead: p.leadId
        ? {
            id: (p.leadId as any)._id?.toString(),
            name: (p.leadId as any).name,
            email: (p.leadId as any).email,
            avatar: (p.leadId as any).avatar,
          }
        : null,
    }));
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Project ID');

    const p = await this.projectModel.findById(id).populate('leadId', 'name email avatar title');
    if (!p) throw new NotFoundException('Project not found');

    return {
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      priority: p.priority,
      dueDate: p.dueDate,
      lead: p.leadId
        ? {
            id: (p.leadId as any)._id?.toString(),
            name: (p.leadId as any).name,
            email: (p.leadId as any).email,
            avatar: (p.leadId as any).avatar,
          }
        : null,
    };
  }

  async create(userId: string, dto: CreateProjectDto) {
    const workspace = await this.workspaceModel.findOne();
    if (!workspace) throw new NotFoundException('Workspace not found');

    const project = await this.projectModel.create({
      name: dto.name,
      description: dto.description,
      priority: dto.priority || 'MEDIUM',
      dueDate: dto.dueDate,
      leadId: dto.leadId && Types.ObjectId.isValid(dto.leadId) ? new Types.ObjectId(dto.leadId) : new Types.ObjectId(userId),
      workspaceId: workspace._id,
    });

    return this.findOne(project._id.toString());
  }

  async update(id: string, dto: UpdateProjectDto) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Project ID');

    await this.projectModel.findByIdAndUpdate(id, dto, { new: true });
    return this.findOne(id);
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Project ID');
    return this.projectModel.findByIdAndDelete(id);
  }
}
