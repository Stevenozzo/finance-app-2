import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  token: string | null = null; // Variabile per il token

  ngOnInit() {
    // Recupera il token dal localStorage
    this.token = localStorage.getItem('token');
    if (this.token) {
      // Se c'è già un token, puoi reindirizzare l'utente automaticamente alla pagina principale
      this.router.navigate(['/user']);
    }
    console.log('Token recuperato nel ngOnInit:', this.token);  // Per debug
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const formData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      try {
        const response = await fetch(`${environment.backendUrl}v0/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Username o password errati');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);  // Salva il token in localStorage
        this.token = data.token;  // Imposta il token nel componente
        alert('Accesso effettuato!');
        this.router.navigate(['/user']);
      } catch (error) {
        console.error('Login failed', error);

        // Verifica se error è un'istanza di Error
        const errorMessage = error instanceof Error ? error.message : 'Si è verificato un errore';
        alert(errorMessage);
      }
    }
  }

  async makeApiRequest() {
    if (this.token) {
      try {
        const response = await fetch(`${environment.backendUrl}v1/protected-resource`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`  // Aggiungi il token nell'header
          }
        });

        if (!response.ok) {
          throw new Error('Errore nella richiesta API');
        }

        const data = await response.json();
        console.log('Dati API protetta:', data);
      } catch (error) {
        console.error('Errore API', error);
        alert('Errore nel recupero dei dati protetti');
      }
    } else {
      alert('Token non trovato');
    }
  }
  
}