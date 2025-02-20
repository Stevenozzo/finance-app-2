import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.css']
})
export class UserScreenComponent {
  logout() {
    localStorage.removeItem('token'); // Rimuove il token
    window.location.href = '/login'; // Reindirizza al login
  }
}