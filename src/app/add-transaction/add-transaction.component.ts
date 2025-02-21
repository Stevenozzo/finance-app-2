import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment.development';

interface Category {
  id: number;
  categoryName: string;
  transactionsType: string;
}

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent {
  private fb = inject(FormBuilder);

  transactionForm: FormGroup = this.fb.group({
    transactionImport: ['', [Validators.required]],
    transactionDate: ['', [Validators.required]],
    webSite: ['', [Validators.required]],
    transactionType: ['', [Validators.required]], // Nuovo campo per selezionare POSITIVE o NEGATIVE
    categoryType: ['', [Validators.required]] // Categoria selezionata
  });

  categories: Category[] = []; // Lista categorie ottenuta dal backend

  // Metodo chiamato quando cambia il selettore POSITIVE/NEGATIVE
  async onTransactionTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const transactionType = selectElement.value;

    if (!transactionType) {
      this.categories = [];
      return;
    }

    try {
      // Recupero delle categorie tramite fetch
      const token = localStorage.getItem('token');  // Recupera il token direttamente da localStorage
      const response = await fetch(`${environment.backendUrl}v1/categories/${transactionType}`, {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}  // Se il token è presente, lo includiamo negli header
      });

      if (!response.ok) {
        throw new Error('Errore nel recupero delle categorie');
      }

      // Parsing della risposta JSON
      this.categories = await response.json();
    } catch (error) {
      console.error('Errore nel recupero delle categorie', error);
      alert('Errore nel recupero delle categorie.');
    }
  }

  // Metodo per inviare la transazione
  async onSubmitTransaction() {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;

      try {
        // Invio della transazione tramite fetch
        const token = localStorage.getItem('token');  // Recupera il token direttamente da localStorage
        const response = await fetch(`${environment.backendUrl}v1/transactios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...token ? { 'Authorization': `Bearer ${token}` } : {}  // Se il token è presente, lo includiamo negli header
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Errore nell\'inserimento della transazione');
        }

        alert('Transazione inserita con successo!');
        this.transactionForm.reset();
        this.categories = [];
      } catch (error) {
        console.error('Errore nell\'inserimento della transazione', error);
        alert('Errore nell\'inserimento della transazione.');
      }
    }
  }
}