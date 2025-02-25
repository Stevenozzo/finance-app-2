import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserScreenComponent } from './user-screen/user-screen.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { MonthlyExpenseCardComponent } from './monthly-expense-card/monthly-expense-card.component';
import { ProfileComponent } from './profile/profile.component'; // Importa il componente Profilo
import { AuthGuard } from './auth.guard'; // Protegge le rotte dopo il login

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'user',
    component: UserScreenComponent,
    canActivate: [AuthGuard], // Protegge questa sezione
    children: [
      { path: 'home', component: MonthlyExpenseCardComponent }, // Nuova rotta per /user/home
      { path: 'transactions', component: TransactionsHistoryComponent },
      { path: 'add-transaction', component: AddTransactionComponent },
      { path: 'profile', component: ProfileComponent }, // Aggiungi la rotta per il profilo
    ],
  },
  { path: '**', redirectTo: '' }, // Rotta di fallback
];
