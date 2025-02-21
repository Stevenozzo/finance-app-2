import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user: any;
  isLoading: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    const token = localStorage.getItem('token'); // Ottieni il token da localStorage
    if (token) {
      const url = `${environment.backendUrl}v1/users/me`;

      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Errore nella risposta del server');
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            this.user = {
              name: data.name,
              lastName: data.lastName,
              email: data.email,
              username: data.username,
            };
            this.isLoading = false;
          } else {
            console.error('Dati del profilo non trovati', data);
            this.isLoading = false;
          }
        })
        .catch((err) => {
          console.error('Errore durante il recupero del profilo', err);
          this.isLoading = false;
          this.router.navigate(['/login']); // Reindirizza al login in caso di errore
        });
    }
  }

  updateProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      const updateData = {
        name: this.user.name,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
      };

      if (
        !updateData.name ||
        !updateData.lastName ||
        !updateData.email ||
        !updateData.username
      ) {
        alert('Per favore, compila tutti i campi.');
        return;
      }

      fetch(`${environment.backendUrl}v1/users/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert('Profilo aggiornato con successo');
          location.reload();
        })
        .catch((err) => {
          console.error("Errore durante l'aggiornamento del profilo", err);
          alert("Errore durante l'aggiornamento del profilo");
        });
    }
  }
}
