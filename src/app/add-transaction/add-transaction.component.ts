import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

interface Category {
  id: number;
  categoryName: string;
  transactionsType: string;
}

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  transactionForm: FormGroup = this.fb.group({
    transactionImport: ['', [Validators.required]],
    transactionDate: ['', [Validators.required]],
    webSite: ['', [Validators.required]],
    transactionType: ['', [Validators.required]], // Nuovo campo per selezionare POSITIVE o NEGATIVE
    categoryType: ['', [Validators.required]] // Categoria selezionata
  });

  categories: Category[] = []; // Lista categorie ottenuta dal backend

  // Metodo chiamato quando cambia il selettore POSITIVE/NEGATIVE
  onTransactionTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const transactionType = selectElement.value;

    if (!transactionType) {
      this.categories = [];
      return;
    }

    // Recupera le categorie in base al tipo di transazione (POSITIVE o NEGATIVE)
    this.http.get<Category[]>(`${environment.backendUrl}v1/categories?transactionsTypes=${transactionType}`).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Errore nel recupero delle categorie', err);
        alert('Errore nel recupero delle categorie.');
      }
    });
  }

  // Metodo per inviare la transazione
  onSubmitTransaction() {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;

      // Invia i dati della transazione
      this.http.post(`${environment.backendUrl}v1/transactions`, formData).subscribe({
        next: () => {
          alert('Transazione inserita con successo!');
          this.transactionForm.reset();
          this.categories = [];
        },
        error: (err) => {
          console.error('Errore nell\'inserimento della transazione', err);
          alert('Errore nell\'inserimento della transazione.');
        }
      });
    }
  }
}