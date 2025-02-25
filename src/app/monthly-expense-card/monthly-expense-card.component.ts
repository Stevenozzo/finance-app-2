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
              const transactionMonth = transactionDate.getMonth() + 1; // Mese 1-12
              const transactionYear = transactionDate.getFullYear(); // Anno 4 cifre

              // Formatto la data in YYYY-MM per il confronto
              const transactionDateString = `${transactionYear}-${String(
                transactionMonth
              ).padStart(2, '0')}`;

              // Formatto la data corrente in YYYY-MM per il confronto
              const selectedDateString = `${currentYear}-${String(
                currentMonth
              ).padStart(2, '0')}`;

              // Confronta le date
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
        })
        .catch((error) => {
          console.error('Errore nel recupero delle transazioni:', error);
        });
    }
  }
}
