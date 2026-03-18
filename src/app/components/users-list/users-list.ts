import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<IUser[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        const usersList = response.users || response;
        this.users.set(usersList);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        let errorMsg = 'Failed to load users';

        if (error?.status === 0) {
          errorMsg = 'Connection error: Unable to reach the API server.';
        } else if (error?.status === 404) {
          errorMsg = 'API endpoint not found (404)';
        } else if (error?.status === 500) {
          errorMsg = 'Server error (500). Please try again later.';
        } else if (error?.message) {
          errorMsg = error.message;
        }

        this.errorMessage.set(errorMsg);
        console.error('Error loading users:', error);
      },
    });
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;

    const user = this.users().find((u) => u.id === id);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'this user';

    if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          let errorMsg = 'Failed to delete user';

          if (error?.status === 0) {
            errorMsg = 'Connection error: Unable to reach the API server';
          } else if (error?.status === 404) {
            errorMsg = 'User not found';
          } else if (error?.status === 500) {
            errorMsg = 'Server error. Please try again later.';
          } else if (error?.message) {
            errorMsg = error.message;
          }

          this.errorMessage.set(errorMsg);
        },
      });
    }
  }
}
