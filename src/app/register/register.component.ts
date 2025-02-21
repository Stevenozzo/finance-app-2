import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required]], // Modifica 'nickname' in 'username'
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  passwordsMatch(): boolean {
    return (
      this.registerForm.value.password ===
      this.registerForm.value.confirmPassword
    );
  }

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      // Correggi l'ordine per inviare i dati nell'ordine richiesto dall'API
      const formData = {
        username: this.registerForm.value.username, // Cambiato in 'username'
        name: this.registerForm.value.firstName, // Cambiato in 'name'
        lastName: this.registerForm.value.lastName, // Cambiato in 'lastName'
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      this.http
        .post(`${environment.backendUrl}v0/users/registration`, formData)
        .subscribe({
          next: () => {
            alert('Registrazione riuscita! Ora puoi fare il login.');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Registrazione fallita', err);
            alert('Errore durante la registrazione.');
          },
        });
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
