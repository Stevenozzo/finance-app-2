import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-monthly-expense-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-expense-card.component.html',
  styleUrls: ['./monthly-expense-card.component.css'],
})
export class MonthlyExpenseCardComponent implements OnInit, OnChanges {
  @Input() userName: string | null = null;
  totalSpent: number = 0;
  totalIncome: number = 0;
  transactions: any[] = [];

  months = [
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
  years: number[] = [];

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  ngOnInit(): void {
    this.generateYears();
    this.getMonthlyExpenses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] || changes['selectedYear']) {
      console.log(
        'Month or year changed:',
        this.selectedMonth,
        this.selectedYear
      );
      this.getMonthlyExpenses();
    }
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 10; year--) {
      this.years.push(year);
    }
  }

  getMonthlyExpenses() {
    const token = localStorage.getItem('token');
    const currentMonth = this.selectedMonth;
    const currentYear = this.selectedYear;

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
          this.transactions = Array.isArray(data) ? data : [data];

          const filteredTransactions = this.transactions.filter(
            (transaction: any) => {
              const transactionDate = new Date(
                transaction.transactionDate[0],
                transaction.transactionDate[1] - 1,
                transaction.transactionDate[2]
              );
              const transactionMonth = transactionDate.getMonth() + 1;
              const transactionYear = transactionDate.getFullYear();
              const transactionDateString = `${transactionYear}-${String(
                transactionMonth
              ).padStart(2, '0')}`;

              const selectedDateString = `${currentYear}-${String(
                currentMonth
              ).padStart(2, '0')}`;

              return transactionDateString === selectedDateString;
            }
          );

          // Calcola entrate e uscite
          this.totalIncome = filteredTransactions
            .filter((t) => t.transactionImport > 0)
            .reduce((sum, t) => sum + t.transactionImport, 0);

          this.totalSpent = filteredTransactions
            .filter((t) => t.transactionImport < 0)
            .reduce((sum, t) => sum + Math.abs(t.transactionImport), 0);

          // Formatta la data delle transazioni
          this.transactions = filteredTransactions.map((transaction) => {
            // Aggiungi la proprietà formattedDate per mostrare la data nel formato corretto
            const formattedDate = this.formatDate(transaction.transactionDate);
            return { ...transaction, formattedDate };
          });
        })
        .catch((error) => {
          console.error('Errore nel recupero delle transazioni:', error);
        });
    }
  }

  // Funzione di formattazione della data
  formatDate(date: any): string {
    let day: number, month: number, year: number;

    // Verifica se la data è già un array nel formato [anno, mese, giorno]
    if (Array.isArray(date) && date.length === 3) {
      [year, month, day] = date;
    }
    // Se la data è una stringa (ad esempio '2025-02-25'), la converte in un oggetto Date
    else if (typeof date === 'string' || date instanceof Date) {
      const dateObj = new Date(date);
      year = dateObj.getFullYear();
      month = dateObj.getMonth(); // Mese 0-11, quindi si deve sommare 1
      day = dateObj.getDate();
    }
    // Altrimenti, restituisce un messaggio di errore
    else {
      return 'Data non valida';
    }

    const months = [
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

    // Restituisce la data formattata come "25 Febbraio 2025"
    return `${day} ${months[month - 1]} ${year}`;
  }
}
