import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterTasksDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterTasksDto;
    let tasks = [...this.getAllTasks()];
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new NotFoundException('Could not find task');
    }
    if (!TaskStatus[status]) {
      throw new BadRequestException('Status type not found');
    }
    task.status = status;
    return task;
  }

  deleteTask(id): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
