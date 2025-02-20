import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../auth.service';  // Importa AuthService

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
  private authService = inject(AuthService);  // Inietta AuthService

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
      const response = await fetch(`${environment.backendUrl}v1/categories?transactiosTypes=${transactionType}`, {
        method: 'GET',
        headers: this.authService.getAuthHeaders()  // Usa il token dagli headers
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
        const response = await fetch(`${environment.backendUrl}v1/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.authService.getAuthHeaders()  // Aggiungi il token agli headers
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