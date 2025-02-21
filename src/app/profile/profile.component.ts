import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: any;
  isLoading: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchUserProfile();
  }

  // Funzione per ottenere i dati dell'utente
  fetchUserProfile() {
    const token = localStorage.getItem('token'); // Ottieni il token da localStorage
    if (token) {
      this.http.get(`${environment.backendUrl}v1/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: (response) => {
          this.user = response;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Errore durante il recupero del profilo', err);
          this.isLoading = false;
          this.router.navigate(['/login']); // Reindirizza al login in caso di errore
        }
      });
    }
  }

  // Funzione per aggiornare il profilo dell'utente
  updateProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      // Creiamo un oggetto con solo i campi che vogliamo aggiornare
      const updateData = {
        name: this.user.name,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
      };

      // Controlla che i campi non siano vuoti prima di inviare la richiesta
      if (!updateData.name || !updateData.lastName || !updateData.email || !updateData.username) {
        alert('Per favore, compila tutti i campi.');
        return;
      }

      this.http.put(`${environment.backendUrl}v1/users/me`, updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: (response) => {
          alert('Profilo aggiornato con successo');
        },
        error: (err) => {
          console.error('Errore durante l\'aggiornamento del profilo', err);
          alert('Errore durante l\'aggiornamento del profilo');
        }
      });
    }
  }
}