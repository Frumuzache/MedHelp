import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ChatComponent } from './components/chat/chat';
import { PartnerDashboardComponent } from './components/partner-dashboard/partner-dashboard';
import { PartnerLoginComponent } from './components/partner-login/partner-login';
import { PartnerRegisterComponent } from './components/partner-register/partner-register';
import { AboutComponent } from './components/about/about';
import { HistoryComponent } from './components/history/history';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'about', component: AboutComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'partner-login', component: PartnerLoginComponent },
  { path: 'partner-register', component: PartnerRegisterComponent },
  { path: 'partner-dashboard', component: PartnerDashboardComponent },
  { path: '**', redirectTo: 'home' },
];