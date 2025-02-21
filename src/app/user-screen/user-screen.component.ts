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
  isSidebarClosed: boolean = false; // Stato della sidebar

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  fetchUserInfo() {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:8090/api/v1/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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
          this.userName = data.name;
        })
        .catch((error) => {
          console.error('Errore:', error);
        });
    }
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
