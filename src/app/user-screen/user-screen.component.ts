import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment.development';

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
  totalSpent: number = 0; // Totale spese del mese

  ngOnInit(): void {
    this.fetchUserInfo();
    this.getMonthlyExpenses(); // Recupera e calcola le spese del mese
  }

  fetchUserInfo() {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(`${environment.backendUrl}v1/users/me`, {
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

  getMonthlyExpenses() {
    const token = localStorage.getItem('token');
    const currentMonth = new Date().getMonth() + 1; // Otteniamo il mese corrente (1-12)
    const currentYear = new Date().getFullYear(); // Otteniamo l'anno corrente

    if (token) {
      fetch(`${environment.backendUrl}v1/transactios`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Risposta API transazione:', data); // DEBUG

          // Controlliamo se la risposta contiene un array o una singola transazione
          const transactions = Array.isArray(data) ? data : [data]; // Se è un oggetto, lo mettiamo in un array

          const expenses = transactions.filter((transaction: any) => {
            if (!Array.isArray(transaction.transactionDate)) {
              console.warn(
                'Formato data non valido:',
                transaction.transactionDate
              );
              return false;
            }

            const [year, month] = transaction.transactionDate;
            return month === currentMonth && year === currentYear;
          });

          this.totalSpent = expenses.reduce(
            (sum: number, transaction: any) =>
              sum + transaction.transactionImport,
            0
          );
          console.log('Spese mensili totali:', this.totalSpent);
        })
        .catch((error) => {
          console.error('Errore nel recupero delle transazioni:', error);
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
