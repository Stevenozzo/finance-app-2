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
  filteredTransactions: Transaction[] = [];
  uniqueMonths: string[] = [];
  selectedMonth: string | null = null;

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${environment.backendUrl}v1/transactios`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP! Status: ${response.status}`);
      }

      const data: any[] = await response.json();

      this.transactions = data.map((transaction) => ({
        ...transaction,
        transactionDate: this.formatDate(transaction.transactionDate),
      }));

      this.extractUniqueMonths();
      this.filteredTransactions = [...this.transactions]; // Mostra tutto all'inizio
    } catch (error) {
      console.error('Errore nel recupero delle transazioni', error);
      alert('Errore nel recupero delle transazioni.');
    }
  }

  extractUniqueMonths() {
    const mesiSet = new Set<string>();

    this.transactions.forEach((transaction) => {
      const monthYear = transaction.transactionDate
        .split(' ')
        .slice(1)
        .join(' '); // "Gennaio 2024"
      mesiSet.add(monthYear);
    });

    this.uniqueMonths = Array.from(mesiSet);
  }

  filterByMonth(month: string) {
    this.selectedMonth = month;
    this.filteredTransactions = this.transactions.filter((transaction) =>
      transaction.transactionDate.includes(month)
    );
  }

  async deleteTransaction(id: number) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${environment.backendUrl}v1/transactios/${id}`,
        {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!response.ok) {
        throw new Error(`Errore HTTP! Status: ${response.status}`);
      }

      this.transactions = this.transactions.filter(
        (transaction) => transaction.id !== id
      );
      this.extractUniqueMonths();
      this.filterByMonth(this.selectedMonth || ''); // Mantiene il filtro attivo
      alert('Transazione eliminata con successo.');
    } catch (error) {
      console.error('Errore nell’eliminazione della transazione', error);
      alert("Errore nell'eliminazione della transazione.");
    }
  }

  formatDate(dateArray: number[]): string {
    if (!Array.isArray(dateArray) || dateArray.length < 3)
      return 'Data non valida';

    const [year, month, day] = dateArray;
    const mesi = [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ];

    return `${day} ${mesi[month - 1]} ${year}`;
  }
}
