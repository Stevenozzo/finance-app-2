import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.css'],
})
export class UserScreenComponent implements OnInit {
  userName: string | null = null;

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  // Metodo per recuperare le informazioni dell'utente usando fetch()
  fetchUserInfo() {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:8090/api/v1/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Aggiungi il token nell'intestazione
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Errore nel recupero dei dati dell'utente");
          }
          return response.json();
        })
        .then((data) => {
          this.userName = data.name; // Imposta il nome dell'utente
        })
        .catch((error) => {
          console.error('Errore:', error);
        });
    }
  }

  logout() {
    localStorage.removeItem('token'); // Rimuove il token
    window.location.href = '/login'; // Reindirizza al login
  }
}
