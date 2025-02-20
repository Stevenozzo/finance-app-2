import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth.service';  // Importa AuthService

interface Transaction {
  transactionImport: number;
  transactionDate: string;
  webSite: string;
  categoryType: string;
}

@Component({
  selector: 'app-transactions-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.css']
})
export class TransactionsHistoryComponent implements OnInit {
  transactions: Transaction[] = [];

  private authService = inject(AuthService);  // Inietta AuthService

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions() {
    try {
      const response = await fetch(`${environment.backendUrl}v1/transactios`, {
        method: 'GET',
        headers: this.authService.getAuthHeaders()  // Usa il metodo getAuthHeaders per ottenere il token
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP! Status: ${response.status}`);
      }

      const data: Transaction[] = await response.json();
      this.transactions = data;
    } catch (error) {
      console.error('Errore nel recupero delle transazioni', error);
      alert('Errore nel recupero delle transazioni.');
    }
  }
}