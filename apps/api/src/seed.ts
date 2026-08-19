import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserSchema } from './schemas/user.schema';
import { WorkspaceSchema } from './schemas/workspace.schema';
import { ProjectSchema } from './schemas/project.schema';
import { TaskSchema } from './schemas/task.schema';
import { LabelSchema } from './schemas/label.schema';
import { CommentSchema } from './schemas/comment.schema';
import { ActivityLogSchema } from './schemas/activity-log.schema';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ablespace_admin:nishaablespace$19@ablespace-cluster.sgri5oc.mongodb.net/?appName=ablespace-cluster';

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri);

  const User = mongoose.model('User', UserSchema);
  const Workspace = mongoose.model('Workspace', WorkspaceSchema);
  const Project = mongoose.model('Project', ProjectSchema);
  const Task = mongoose.model('Task', TaskSchema);
  const Label = mongoose.model('Label', LabelSchema);
  const Comment = mongoose.model('Comment', CommentSchema);
  const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

  console.log('Clearing old collections...');
  await ActivityLog.deleteMany({});
  await Comment.deleteMany({});
  await Label.deleteMany({});
  await Task.deleteMany({});
  await Project.deleteMany({});
  await Workspace.deleteMany({});
  await User.deleteMany({});

  console.log('Creating Users...');
  const dexter = await User.create({
    email: 'dexter@example.com',
    name: 'Dexter',
    username: 'dexter_dev',
    title: 'Full Stack Engineer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
    isGuest: true,
  });

  const admin = await User.create({
    email: 'admin@example.com',
    name: 'Admin',
    username: 'admin',
    title: 'Project Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  });

  const designer = await User.create({
    email: 'designer@example.com',
    name: 'Designer',
    username: 'designer',
    title: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Designer',
  });

  const qaTeam = await User.create({
    email: 'qa@example.com',
    name: 'QA Team',
    username: 'qa_team',
    title: 'Quality Assurance',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QATeam',
  });

  const security = await User.create({
    email: 'security@example.com',
    name: 'Security',
    username: 'security',
    title: 'Security Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Security',
  });

  const cn = await User.create({
    email: 'cn@example.com',
    name: 'CN',
    username: 'cn_dev',
    title: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CN',
  });

  console.log('Creating Workspace...');
  const workspace = await Workspace.create({
    name: "Dexter's Workspace",
    slug: 'dexter-workspace',
    ownerId: dexter._id,
  });

  console.log('Creating Labels...');
  const deploymentLabel = await Label.create({
    name: 'Deployment',
    color: 'bg-blue-100 text-blue-700',
    workspaceId: workspace._id,
  });
  const testingLabel = await Label.create({
    name: 'Testing',
    color: 'bg-green-100 text-green-700',
    workspaceId: workspace._id,
  });
  const passedLabel = await Label.create({
    name: 'Passed',
    color: 'bg-emerald-100 text-emerald-700',
    workspaceId: workspace._id,
  });
  const designLabel = await Label.create({
    name: 'Design',
    color: 'bg-purple-100 text-purple-700',
    workspaceId: workspace._id,
  });
  const updatedLabel = await Label.create({
    name: 'Updated',
    color: 'bg-indigo-100 text-indigo-700',
    workspaceId: workspace._id,
  });
  const auditLabel = await Label.create({
    name: 'Audit',
    color: 'bg-red-100 text-red-700',
    workspaceId: workspace._id,
  });
  const scheduledLabel = await Label.create({
    name: 'Scheduled',
    color: 'bg-amber-100 text-amber-700',
    workspaceId: workspace._id,
  });

  console.log('Creating Projects...');
  const designHomepageProject = await Project.create({
    name: 'Design Homepage',
    description: 'Main web homepage layout and user experience redesign.',
    priority: 'HIGH',
    dueDate: '12 Sep 2026',
    workspaceId: workspace._id,
    leadId: dexter._id,
  });

  const mobileAppProject = await Project.create({
    name: 'Mobile App Redesign',
    description: 'iOS and Android application redesign.',
    priority: 'MEDIUM',
    dueDate: '20 Sep 2026',
    workspaceId: workspace._id,
    leadId: designer._id,
  });

  const backendProject = await Project.create({
    name: 'Backend API Optimization',
    description: 'Performance enhancements and database query optimization.',
    priority: 'URGENT',
    dueDate: '05 Oct 2026',
    workspaceId: workspace._id,
    leadId: admin._id,
  });

  console.log('Creating Tasks matching Figma screenshots...');
  // 1. To Do Tasks
  await Task.create({
    title: 'Write API Documentation',
    description: 'Complete OpenAPI spec for v2 backend endpoints.',
    status: 'TO_DO',
    priority: 'HIGH',
    dueDate: '29 Jul 2026',
    workspaceId: workspace._id,
    projectId: backendProject._id,
    reporterId: dexter._id,
    assignees: [admin._id],
    labels: [deploymentLabel._id],
    position: 1,
  });

  await Task.create({
    title: 'Implement Search Function',
    description: 'Add live title search and filter inputs on main task board.',
    status: 'TO_DO',
    priority: 'MEDIUM',
    dueDate: '29 Jul 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    reporterId: dexter._id,
    assignees: [admin._id],
    labels: [deploymentLabel._id],
    position: 2,
  });

  await Task.create({
    title: 'Deploy to Production',
    description: 'Finalize staging tests and deploy build to production cluster.',
    status: 'TO_DO',
    priority: 'URGENT',
    dueDate: '29 Jul 2026',
    workspaceId: workspace._id,
    projectId: backendProject._id,
    reporterId: dexter._id,
    assignees: [admin._id],
    labels: [deploymentLabel._id],
    position: 3,
  });

  // 2. Doing Tasks
  await Task.create({
    title: 'Code Review Completed',
    description: 'Review PRs for feature branch integration.',
    status: 'DOING',
    priority: 'HIGH',
    dueDate: '29 Jul 2026',
    workspaceId: workspace._id,
    projectId: backendProject._id,
    reporterId: dexter._id,
    assignees: [admin._id],
    labels: [deploymentLabel._id],
    position: 1,
  });

  await Task.create({
    title: 'Design Mockups Finalized',
    description: 'Figma prototypes reviewed and approved by stakeholders.',
    status: 'DOING',
    priority: 'MEDIUM',
    dueDate: '29 Jul 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    reporterId: dexter._id,
    assignees: [admin._id],
    labels: [deploymentLabel._id],
    position: 2,
  });

  // 3. Completed Tasks
  await Task.create({
    title: 'Feature Testing Passed',
    description: 'All end-to-end integration tests passed without errors.',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '30 Jul 2026',
    workspaceId: workspace._id,
    projectId: mobileAppProject._id,
    reporterId: dexter._id,
    assignees: [qaTeam._id],
    labels: [testingLabel._id, passedLabel._id],
    position: 1,
  });

  await Task.create({
    title: 'UI Design Updated',
    description: 'Design components updated to reflect dark mode and color swatches.',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: '31 Jul 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    reporterId: dexter._id,
    assignees: [designer._id],
    labels: [designLabel._id, updatedLabel._id],
    position: 2,
  });

  await Task.create({
    title: 'Security Audit Scheduled',
    description: 'Third-party penetration testing and compliance audit setup.',
    status: 'COMPLETED',
    priority: 'URGENT',
    dueDate: '01 Aug 2026',
    workspaceId: workspace._id,
    projectId: backendProject._id,
    reporterId: dexter._id,
    assignees: [security._id],
    labels: [auditLabel._id, scheduledLabel._id],
    position: 3,
  });

  // 4. On Hold Tasks
  await Task.create({
    title: 'UI Review',
    description: 'Pending executive sign-off.',
    status: 'ON_HOLD',
    priority: 'LOW',
    dueDate: '05 Aug 2026',
    workspaceId: workspace._id,
    projectId: mobileAppProject._id,
    reporterId: dexter._id,
    assignees: [designer._id],
    position: 1,
  });

  // Project "Design Homepage" Scoped Tasks
  const mainDesignTask = await Task.create({
    title: 'Design Homepage',
    description: 'Comprehensive redesign of landing page hero, feature grid, and footer.',
    status: 'TO_DO',
    priority: 'HIGH',
    dueDate: '12 Sep 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    reporterId: dexter._id,
    assignees: [dexter._id],
    position: 4,
  });

  await Task.create({
    title: 'Develop Login Feature',
    description: 'Guest authentication and social login integration.',
    status: 'TO_DO',
    priority: 'LOW',
    dueDate: '15 Sep 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    reporterId: dexter._id,
    assignees: [cn._id],
    position: 5,
  });

  await Task.create({
    title: 'Test Payment Gateway',
    description: 'Stripe integration testing with sandbox credentials.',
    status: 'TO_DO',
    priority: 'MEDIUM',
    dueDate: '18 Sep 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    reporterId: dexter._id,
    assignees: [dexter._id],
    position: 6,
  });

  // Subtasks for "Design Homepage"
  await Task.create({
    title: 'Create Wireframes',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '01 Sep 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    parentTaskId: mainDesignTask._id,
    assignees: [dexter._id],
    position: 1,
  });

  await Task.create({
    title: 'Build UI Components',
    status: 'DOING',
    priority: 'MEDIUM',
    dueDate: '08 Sep 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    parentTaskId: mainDesignTask._id,
    assignees: [dexter._id],
    position: 2,
  });

  await Task.create({
    title: 'Review with Stakeholders',
    status: 'TO_DO',
    priority: 'LOW',
    dueDate: '12 Sep 2026',
    workspaceId: workspace._id,
    projectId: designHomepageProject._id,
    parentTaskId: mainDesignTask._id,
    assignees: [admin._id],
    position: 3,
  });

  // Comments for "Design Homepage" task
  await Comment.create({
    content: 'Initial wireframes are uploaded to Figma. Please check column guidelines.',
    taskId: mainDesignTask._id,
    authorId: dexter._id,
  });

  // Activity logs for "Design Homepage" task
  await ActivityLog.create({
    taskId: mainDesignTask._id,
    userId: dexter._id,
    action: 'Priority Changed',
    details: 'You changed priority from Medium to High',
  });

  await ActivityLog.create({
    taskId: mainDesignTask._id,
    userId: dexter._id,
    action: 'Comment Added',
    details: 'You posted an update',
  });

  console.log('MongoDB database seeded successfully!');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
