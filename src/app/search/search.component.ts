import { Component, OnInit, Injectable } from '@angular/core';
import { TombstoneModel } from '../TomstoneModel';
import { DataService } from '../data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {FormControl, FormGroup} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Program, LinkageType } from '../app.component';
import { environment } from 'src/environments/environment';
import { buildProgramsURL, buildLinkageTypesURL, buildKeyTypesURL } from '../util/environmentHelper';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {

  records: TombstoneModel[];
  firstName: string;
  lastName: string;
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
  dob: Date;
  dob_string: string;
  
  dataObservable: Observable<any[]>;
  programs:Program[];
  selectedProgram:string;

  linkageTypes: LinkageType[];
  linkageType: LinkageType;
  selectedType: string;
  keyTypes: KeyType[];
  selectedKeyType: string;

  searchForm = new FormGroup({
    authorization: new FormControl(''),
    programName: new FormControl(''),
    key: new FormControl(''),
    keyType: new FormControl('')
  });

  submit(){

      var sec_id:number;
      var type_id:number;
      //console.log(this.selectedProgram)
      for (let program of this.programs) {
        if (this.selectedProgram === program.name) {
          sec_id = program.id;
        }
      }
      for(let type of this.linkageTypes){
        if(this.selectedType === type.type){
          type_id = type.id;
        }
      }
      /*if (this.dob != null) {
        this.dob_string = this.dob.toLocaleDateString();
      }*/

      this.data.changeMessage(this.firstName+";"+ this.lastName+";"+ sec_id/*this.programID*/+";"+
                              this.dob_string+";"+ this.pob_city+";"+ this.pob_province+";"+ 
                              this.pob_country+";"+ this.gender+";"+ this.maritialStatus+";"+ (this.securityID+"").split(" ").join("").replace(" ","")+";"+ this.selectedType+";"+type_id+";"+this.selectedKeyType);

      this.router.navigate(['/results']);
  }
  
  constructor(private data: DataService, private  httpClient:HttpClient, public router:Router) { }

  ngOnInit() {
    this.dataObservable =  this.httpClient.get<Program[]>(buildProgramsURL());
    this.dataObservable.subscribe(a => this.initPrograms(a));
    this.dataObservable =  this.httpClient.get<LinkageType[]>(buildLinkageTypesURL());
    this.dataObservable.subscribe(t => this.initLinkageTypes(t));
    this.dataObservable =  this.httpClient.get<KeyType[]>(buildKeyTypesURL()); 
    this.dataObservable.subscribe(t => this.initKeyTypes(t));
  }

  initLinkageTypes(types){
    this.linkageTypes = types;
    //this.selectedType = "CRA";
  }
  
  initPrograms(programs){
    this.programs = programs;
  }
  initKeyTypes(types){
    this.keyTypes = types;
    //this.selectedType = "CRA";
  }

  assignValues(records:TombstoneModel[]){
      this.firstName = records[1].firstName;
      this.lastName=records[1].lastName;
      this.programID=records[1].programID;
      this.dob_string = records[1].dob_string;
      this.pob_city = records[1].pob_city;
      this.pob_province = records[1].pob_province;
      this.pob_country = records[1].pob_country;
      this.gender= records[1].gender;
      this.maritialStatus = records[1].maritialStatus;
      this.securityID = records[1].securityID;
  }

  formatInput(value: string, format: string){
    if(format==="SIN"){//SIN
      var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
      var matches = v.match(/\d{3,9}/g);
      var match = matches && matches[0] || ''
      var parts = []
  
      for (var i=0, len=match.length; i<len; i+=3) {
          parts.push(match.substring(i, i+3))
      }
  
      if (parts.length) {
          return parts.join(' ')
      } else {
          return value
      }
    }
    else if (format==="BN"){//BN
      var v = value.replace(/\s+/g, '');
      var matches = v.match(/.{5,}/g);
      var match = matches && matches[0] || '';
      var parts = [];
  
      for (var i=0, len=match.length; i<len; ) {
          parts.push(match.substring(i, i+5));
          i+=5;
          parts.push(match.substring(i, i+4));
          i+=4;
      }
      if (parts.length) {
        return parts.join(' ').trim();
      } else {
        return value;
      }
    }
    else 
      return value;
  }
}
