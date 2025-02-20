import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

interface Transaction {
  transactionImport: number;
  transactionDate: string;
  webSite: string;
  categoryType: string;
}

@Component({
  selector: 'app-transactions-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.css']
})
export class TransactionsHistoryComponent implements OnInit {
  private http = inject(HttpClient);
  transactions: Transaction[] = [];

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    const token = localStorage.getItem('token');
  
    fetch(`${environment.backendUrl}v1/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Transaction[]) => {
        this.transactions = data;
      })
      .catch(error => {
        console.error('Errore nel recupero delle transazioni', error);
        alert('Errore nel recupero delle transazioni.');
      });
  }
}