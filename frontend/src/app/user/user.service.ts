
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  age: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/backend/user.php'; // Adjust as per your WAMP server folder

  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<any> {
    //return this.http.post(this.apiUrl, { action: 'create', ...user });
    return this.http.post(this.apiUrl + '?action=create', user);
  }

  getUsers(): Observable<User[]> {
    //return this.http.get<User[]>(this.apiUrl);
    return this.http.get<User[]>(this.apiUrl + '?action=read');
  }


  updateUser(user: User): Observable<any> {
    //return this.http.post(this.apiUrl, { action: 'update', ...user });
    return this.http.put(this.apiUrl + '?action=update&id=' + user.id, user);
  }

  deleteUser(id: number): Observable<any> {
    //return this.http.post(this.apiUrl, { action: 'delete', id });
    return this.http.delete(this.apiUrl + '?action=delete&id=' + id);
  }
}

