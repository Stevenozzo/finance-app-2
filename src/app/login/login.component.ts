import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],  // Cambiato da 'email' a 'username'
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
  
      this.http.post(`${environment.backendUrl}v0/users/login`, formData).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token); // Salva il token in localStorage
          alert('Accesso effettuato!');
          this.router.navigate(['/user']);
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Username o password errati');
        }
      });
    }
  }
}