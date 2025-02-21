import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';

interface Transaction {
  id: number; // Aggiungi un campo `id` per identificare univocamente la transazione
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
  styleUrls: ['./transactions-history.component.css'],
})
export class TransactionsHistoryComponent implements OnInit {
  transactions: Transaction[] = [];

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions() {
    try {
      const token = localStorage.getItem('token'); // Recupera il token direttamente da localStorage
      const response = await fetch(`${environment.backendUrl}v1/transactios`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Aggiungi il token solo se esiste
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

  async deleteTransaction(id: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${environment.backendUrl}v1/transactios/${id}`,
        {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // Aggiungi il token se esiste
        }
      );

      if (!response.ok) {
        throw new Error(
          `Errore nell'eliminazione della transazione! Status: ${response.status}`
        );
      }

      // Rimuovi la transazione eliminata dalla lista
      this.transactions = this.transactions.filter(
        (transaction) => transaction.id !== id
      );
      alert('Transazione eliminata con successo.');
    } catch (error) {
      console.error('Errore nel tentativo di eliminare la transazione', error);
      alert("Errore nell'eliminazione della transazione.");
    }
  }
}
