import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  tasks: Omit<Task, 'user_id'>[] = [];
  newTaskTitle: string = '';

  private taskService = inject(TaskService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      this.tasks = await this.taskService.getTasks();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  async addTask(): Promise<void> {
    if (this.newTaskTitle.trim()) {
      const newTask: Omit<Task, 'user_id'> = {
        id: this.getId(10, 10000000).toString(),
        title: this.newTaskTitle,
        completed: false
      };

      try {
        const createdTask = await this.taskService.createTask(newTask);
        this.tasks.push(createdTask);
        this.newTaskTitle = '';
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  }

  async updateTask(task: Omit<Task, 'user_id'>): Promise<void> {
    try {
      const updatedTask: Omit<Task, 'user_id'> = await this.taskService.updateTask(task.id, task);
      console.log('Updated task:', updatedTask);
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.taskService.deleteTask(id);
      this.tasks = this.tasks.filter(task => task.id !== id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  private getId(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/login']);
      // Optionally, navigate to login page or show a message
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
