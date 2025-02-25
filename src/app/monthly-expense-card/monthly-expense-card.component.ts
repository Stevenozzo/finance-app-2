import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';

Chart.register(...registerables);

@Component({
  selector: 'app-monthly-expense-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-expense-card.component.html',
  styleUrls: ['./monthly-expense-card.component.css'],
})
export class MonthlyExpenseCardComponent implements OnInit {
  @Input() userName: string | null = null;
  totalSpent: number = 0;
  totalIncome: number = 0;
  transactions: any[] = [];

  @ViewChild('expenseChart') expenseChart!: ElementRef;

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

          // Filtra le transazioni per mese e anno
          const filteredTransactions = this.transactions.filter(
            (transaction: any) => {
              // Parse the transaction date to a Date object
              const transactionDate = new Date(transaction.transactionDate);
              const transactionMonth = transactionDate.getMonth() + 1; // Mesi partono da 0
              const transactionYear = transactionDate.getFullYear();

              // Confronta mese e anno
              return (
                transactionMonth === currentMonth &&
                transactionYear === currentYear
              );
            }
          );

          // Calcola entrate e uscite
          this.totalIncome = filteredTransactions
            .filter((t) => t.transactionImport > 0)
            .reduce((sum, t) => sum + t.transactionImport, 0);

          this.totalSpent = filteredTransactions
            .filter((t) => t.transactionImport < 0)
            .reduce((sum, t) => sum + Math.abs(t.transactionImport), 0);

          this.renderChart();
        })
        .catch((error) => {
          console.error('Errore nel recupero delle transazioni:', error);
        });
    }
  }

  renderChart() {
    if (this.expenseChart) {
      new Chart(this.expenseChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Entrate', 'Uscite'],
          datasets: [
            {
              data: [this.totalIncome, this.totalSpent],
              backgroundColor: ['#28a745', '#dc3545'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }
  }
}
