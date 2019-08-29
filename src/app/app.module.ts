import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDatepickerModule, MatInputModule,MatNativeDateModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRadioModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { ProgramAssessmentComponent } from './program-assessment/program-assessment.component';
import { Observable } from 'rxjs';
import { HttpClientModule} from '@angular/common/http';
import { ProgramsAvailableComponent } from './programs-available/programs-available.component';
import { LinkagesComponent } from './linkages/linkages.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsComponent,
    ProgramAssessmentComponent,
    ProgramsAvailableComponent,
    LinkagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    HttpClientModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
