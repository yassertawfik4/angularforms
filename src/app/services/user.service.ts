import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private api = 'https://dummyjson.com/users';

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.api);
  }

  addUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('https://dummyjson.com/users/add', user);
  }

  deleteUser(id: number): Observable<IUser> {
    return this.http.delete<IUser>(`${this.api}/${id}`);
  }
}
