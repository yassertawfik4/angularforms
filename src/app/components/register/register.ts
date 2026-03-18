import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  form: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage.set('Please fill in all fields correctly');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const userData: IUser = this.form.value;

    this.userService.addUser(userData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(
          `User ${response.firstName} ${response.lastName} registered successfully! Redirecting...`,
        );
        this.form.reset();
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1500);
      },
      error: (error) => {
        this.loading.set(false);
        let errorMsg = 'Registration failed';

        if (error?.message) {
          errorMsg = error.message;
        } else if (error?.status === 0) {
          errorMsg = 'Failed to connect to the API server.';
        } else if (error?.status === 400) {
          errorMsg = error?.error?.message || 'Invalid input data';
        } else if (error?.status === 500) {
          errorMsg = 'Server error. Please try again later.';
        }

        this.errorMessage.set(errorMsg);
      },
    });
  }

  get firstNameError(): string | null {
    const control = this.form.get('firstName');
    if (control?.hasError('required')) {
      return 'First name is required';
    }
    if (control?.hasError('minlength')) {
      return 'First name must be at least 2 characters';
    }
    return null;
  }

  get lastNameError(): string | null {
    const control = this.form.get('lastName');
    if (control?.hasError('required')) {
      return 'Last name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Last name must be at least 2 characters';
    }
    return null;
  }

  get emailError(): string | null {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    }
    if (control?.hasError('email')) {
      return 'Invalid email format';
    }
    return null;
  }

  get passwordError(): string | null {
    const control = this.form.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }

  get ageError(): string | null {
    const control = this.form.get('age');
    if (control?.hasError('required')) {
      return 'Age is required';
    }
    if (control?.hasError('min')) {
      return 'Age must be at least 18';
    }
    if (control?.hasError('max')) {
      return 'Age cannot exceed 100';
    }
    return null;
  }
}
