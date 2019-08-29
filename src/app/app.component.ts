import { Component, OnInit } from '@angular/core';

import { DataService } from './data.service';
import { logging } from 'protractor';

export interface Program{
  id: number;
  name: string;
}
export interface LinkageType{
  id: number;
  type: string;
}
export interface KeyType{
  id: number;
  type: string;
}
export interface LinkageData{
  type : string;
  key1 : string;
  key2 : string;
  program1 : string;
  program2: string;
  key1_type: string;
  key2_type: string;
  metaData: string;
  confidenceLevel: string;
}
export interface Key{
  id:number;
  key:string;
  guid:number;
  program_id:number;

}
export interface MetaData{
  id:number;
  key_id:number;
  metaData:string;
  timestamp:string;
}
@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[DataService]
})

export class AppComponent implements OnInit{
  title = 'Record Linking Simulator';
  
  firstName: string;
  lastName: string ;
  programID: number;
  dob_day: number;
  dob_month: number;
  dob_year: number;
  pob_city: string;
  pob_province: string;
  pob_country: string;
  gender: string;
  maritialStatus: string;
  securityID: number;

  message:string;

  
  constructor(private data: DataService){}

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  
  }

}
