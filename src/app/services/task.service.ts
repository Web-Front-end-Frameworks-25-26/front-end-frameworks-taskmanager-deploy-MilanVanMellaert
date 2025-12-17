import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable, retry } from 'rxjs';
import { Task } from './../models/task.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  //private http = inject(HttpClient);
  private supabaseService = inject(SupabaseService);
  private tableName = 'Tasks';
  //private apiUrl = 'http://localhost:3000/tasks'; 
  constructor() { }


  async getTasks(): Promise<Task[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async createTask(task: Omit<Task, 'user_id'>): Promise<Task> {
      // Auto-add user_id van ingelogde user
    const user = this.supabaseService.getCurrentUser();
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .insert({
        ...task,
        user_id: user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;

  }

  async updateTask(id: string, task: Omit<Task, 'user_id'>): Promise<Task> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .update(task)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;

  }

  async deleteTask(id: string): Promise<void> {
    const { error, data} = await this.supabaseService
      .getClient()
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    }
}
