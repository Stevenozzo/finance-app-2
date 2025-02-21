import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserScreenComponent } from './user-screen/user-screen.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { ProfileComponent } from './profile/profile.component'; // Importa il componente Profilo
import { AuthGuard } from './auth.guard'; // Protegge le rotte dopo il login

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { 
    path: 'user',
    component: UserScreenComponent,
    canActivate: [AuthGuard], // Protegge questa sezione
    children: [
      { path: 'transactions', component: TransactionsHistoryComponent },
      { path: 'add-transaction', component: AddTransactionComponent },
      { path: 'profile', component: ProfileComponent } // Aggiungi la rotta per il profilo
    ]
  },
  { path: '**', redirectTo: '' } // Rotta di fallback
];