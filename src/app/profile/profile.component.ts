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

  fetchUserProfile() {
    const token = localStorage.getItem('token'); // Ottieni il token da localStorage
    if (token) {
      this.http.get(`${environment.backendUrl}v0/users/me`, {
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

  updateProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      const updateData = {
        name: this.user.name,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
      };

      this.http.put(`${environment.backendUrl}v0/users/me`, updateData, {
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