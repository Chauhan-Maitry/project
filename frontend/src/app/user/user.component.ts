import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,AbstractControl} from '@angular/forms';
import { UserService } from './user.service';


interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  age: number;
}

@Component({
  selector: 'app-user',
  standalone:false,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  editMode = false;
  currentUserId: number | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

 
  
  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
  
  onSubmit() {
    if (this.userForm.invalid) return;

    const formData: User = { id: this.currentUserId ?? 0, ...this.userForm.value };

    if (this.editMode) {
      this.userService.updateUser(formData).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    } else {
      this.userService.addUser(formData).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    }
  }
  
  onEdit(user: User) {
    this.editMode = true;
    this.currentUserId = user.id;
    this.userForm.patchValue(user);
  }

  onDelete(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  resetForm() {
    this.userForm.reset();
    this.editMode = false;
    this.currentUserId = null;
  }

  get f() {
    return this.userForm.controls;
  }

  
  
  
}

