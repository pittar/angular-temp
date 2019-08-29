import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { ProgramsAvailableComponent } from './programs-available/programs-available.component';
import { LinkagesComponent } from './linkages/linkages.component';


const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: ProgramsAvailableComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'linkages', component: LinkagesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
