import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isLoginMode = true;


  supabase = inject(SupabaseService);
  router = inject(Router);

  async onSubmit():Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    try {
      if (this.isLoginMode) {
        await this.supabase.signIn(this.email, this.password);
        this.successMessage = 'Successfully logged in!';
        this.router.navigate(['/tasks']);
      } else {
        await this.supabase.signUp(this.email, this.password);
        this.successMessage = 'Successfully signed up! Please check your email to confirm your account.';
      }

    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }
}