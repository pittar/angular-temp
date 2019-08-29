import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { HttpClient } from '@angular/common/http';
import { Program, MetaData } from '../app.component';
import { Observable } from 'rxjs';
import { buildProgramsURL, buildLinkageTypesURL, buildLinkagesSearchURL, buildLinkagesMetaDataSearchURL } from '../util/environmentHelper';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  firstName: string;
  lastName: string;
  programID;
  dob_day: number;
  dob_month: number;
  dob_year: number;
  pob_city: string;
  pob_province: string;
  pob_country: string;
  gender: string;
  maritialStatus: string;
  securityID;
  programName: string = 'undefined';
  metaData:MetaData = {id:-1, key_id:-1, metaData:"N/A - Program Not Specified", timestamp:"----"};
  dob_string: string;

  message:string;
  msg:string[];
  programs: Program[];
  listOfMetaData: MetaData;
  dataObservable: Observable<object>;
  searchAs: string;
  keyType:string;

  constructor(private data: DataService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
    this.msg = this.message.split(";");
    //this.firstName = this.msg[0].replace(";","");
    //this.lastName = this.msg[1].replace(";","");
    this.programID = Number.parseInt(this.msg[2].replace(";",""));
    //this.dob_string = this.msg[3].replace(";","");
    //this.pob_city = this.msg[4].replace(";","");
    //this.pob_province = this.msg[5].replace(";","");
    //this.pob_country = this.msg[6].replace(";","");
    //this.gender = this.msg[7].replace(";","");
    //this.maritialStatus = this.msg[8].replace(";","");
    this.securityID = Number.parseInt(this.msg[9].replace(";",""));
    this.searchAs = this.msg[10].replace(";","");
    this.keyType = this.msg[12].replace(";","");
    this.securityID = this.formatInput(this.securityID+"",this.keyType)
    
    if (this.programID!=null && this.securityID!=null) {
      this.dataObservable = this.httpClient.get<MetaData[]>(buildLinkagesMetaDataSearchURL()+this.securityID.split(" ").join("").replace(" ","")+"/"+ this.programID);
      this.dataObservable.subscribe(metaDataSearchResult => this.initMetaData(metaDataSearchResult));
    }

    this.dataObservable =  this.httpClient.get<Program[]>(buildProgramsURL());
    this.dataObservable.subscribe(c => this.initPrograms(c));
    //this.programName = this.programs[this.programID-1].name;

    
  }

  initPrograms(programs){
    this.programs = programs;
    this.programName = this.programs[this.programID-1].name;
  }

  initMetaData(metas){
    this.listOfMetaData = metas;
    this.metaData = this.listOfMetaData[0];
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
