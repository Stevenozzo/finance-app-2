// monthly-expense-card.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-monthly-expense-card',
  standalone: true,
  imports: [CommonModule], // Aggiungi CommonModule per usare il pipe currency
  templateUrl: './monthly-expense-card.component.html',
  styleUrls: ['./monthly-expense-card.component.css'],
})
export class MonthlyExpenseCardComponent implements OnInit {
  @Input() userName: string | null = null;
  totalSpent: number = 0;

  ngOnInit(): void {
    this.getMonthlyExpenses();
  }

  getMonthlyExpenses() {
    const token = localStorage.getItem('token');
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

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
          const transactions = Array.isArray(data) ? data : [data];
          const expenses = transactions.filter((transaction: any) => {
            const [year, month] = transaction.transactionDate;
            return month === currentMonth && year === currentYear;
          });

          this.totalSpent = expenses.reduce(
            (sum: number, transaction: any) =>
              sum + transaction.transactionImport,
            0
          );
        })
        .catch((error) => {
          console.error('Errore nel recupero delle transazioni:', error);
        });
    }
  }
}
