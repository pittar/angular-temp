import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { DataService } from '../data.service';
import {ProgramAssessmentComponent} from '../program-assessment/program-assessment.component'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LinkageData, Program, MetaData, LinkageType } from 'src/app/app.component';
import { buildLinkagesURL, buildProgramsURL, buildLinkageTypesURL, buildKeyTypesURL } from '../util/environmentHelper';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-linkages',
  templateUrl: './linkages.component.html',
  styleUrls: ['./linkages.component.css']
})
export class LinkagesComponent implements OnInit {
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

  programID1: string;
  programID2: string;
  securityID1: string;
  securityID2: string;
  keyType1:string="";
  keyType2:string = "";
  selectedProgram1: string;
  selectedProgram2: string;
  keyTypes: KeyType[];
  linkageTypes: LinkageType[];
  linkageType: LinkageType;
  selectedType: string = "CRA";
  dataObservable : Observable<object>;
  linkage: LinkageData;

  dob_string: string;

  message:string;
  msg:string[];
  
  guid:string;

  linkedId : number;
  linkages: Map<string,number[]>;
  programs: Program[];

  metas: Map<string,string> = new Map<string ,string>();
  metaKey:string ="";
  metaValue:string ="";

  confidenceLevel: string;

  //formatCounter1:number =0;
  //formatCounter2:number =0;
  
  //router: Router;

  linkForm = new FormGroup({
    linkType: new FormControl(''),
    confLevel: new FormControl(''),
    program1: new FormControl(''),
    key1: new FormControl(''),
    type1: new FormControl(''),
    program2: new FormControl(''),
    key2: new FormControl(''),
    type2: new FormControl('')
  });


  constructor(private httpClient: HttpClient, private data: DataService, public router:Router) {

   }

  ngOnInit() {
    this.dataObservable =  this.httpClient.get<Program[]>(buildProgramsURL());
    this.dataObservable.subscribe(c => this.initPrograms(c));
    this.data.currentMessage2.subscribe(message => this.linkedId = Number.parseInt(message));
    this.data.currentMessage.subscribe(message => this.message = message)

    this.dataObservable =  this.httpClient.get<LinkageType[]>(buildLinkageTypesURL());
    this.dataObservable.subscribe(t => this.initLinkageTypes(t));

    this.dataObservable =  this.httpClient.get<KeyType[]>(buildKeyTypesURL()); 
    this.dataObservable.subscribe(t => this.initKeyTypes(t));

    //this.msg = this.message.split(";");
    //this.programID = Number.parseInt(this.msg[2].replace(";",""));
    //this.securityID = Number.parseInt(this.msg[9].replace(";",""));
  }

  initPrograms(programs){
    this.programs = programs;
  }

  initLinkageTypes(types){
    this.linkageTypes = types;
    //this.selectedType = "CRA";
  }

  initKeyTypes(types){
    this.keyTypes = types;
    //this.selectedType = "CRA";
  }

  link() {
    //Link security IDs 1 & 2 in DB
    for(let program of this.programs){
      if(program.name === this.selectedProgram1){
        this.programID1 = program.id +"";
      }
      if (program.name === this.selectedProgram2){
        this.programID2 = program.id+"";
      }
    }
    this.securityID1 = this.securityID1.split(" ").join("").replace(" ","");
    this.securityID2 = this.securityID2.split(" ").join("").replace(" ","");
    var metaData ="{";
    this.metas.forEach((value: string, key: string) => {
      metaData+= JSON.stringify(key)+':'+JSON.stringify(value)+',';
    });
    metaData=metaData.substring(0,metaData.length-1)+"}";
    if(metaData==="}"){
      metaData="";
    }

    for(let type of this.linkageTypes){
      if (type.type === this.selectedType)
        this.linkageType = type;
    }
    console.log(this.keyType1);
    this.linkage = {type:this.selectedType,key1:this.securityID1 + "", key2:this.securityID2 + "", program1: this.programID1+"", program2:this.programID2+"", key1_type: this.keyType1, key2_type: this.keyType2, metaData: metaData, confidenceLevel: this.confidenceLevel};
      
    //this.dataObservable = this.httpClient.post<LinkageData>('http://localhost:8080/linkages/', JSON.stringify(this.linkage), httpOptions);
      
    this.dataObservable = this.httpClient.post<LinkageData>(buildLinkagesURL(), JSON.stringify(this.linkage), httpOptions);
    this.dataObservable.subscribe( () => {
      this.data.changeMessage(this.firstName+";"+ this.lastName+";"+ this.programID1+";"+
      this.dob_string+";"+ this.pob_city+";"+ this.pob_province+";"+ 
      this.pob_country+";"+ this.gender+";"+ this.maritialStatus+";"+
      this.securityID1+";"+this.selectedType+";"+this.linkageType.id+";"+this.keyType1);
      this.router.navigate(['/results']); 
    });
    }

private delay(ms: number)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

addMetaData(){
  if(this.metaKey!==""){
    this.metas.set(this.metaKey,this.metaValue);
    var metaData ="{";
      this.metas.forEach((value: string, key: string) => {
        metaData+= JSON.stringify(key)+':'+JSON.stringify(value)+',';
    });
    metaData=metaData.substring(0,metaData.length-1)+"}";
    console.log(metaData);
    this.metaKey="";
    this.metaValue="";
  }
}

deleteMetaData(key:string){
  this.metas.delete(key);
  var metaData ="{";
      this.metas.forEach((value: string, key: string) => {
        metaData+= JSON.stringify(key)+':'+JSON.stringify(value)+',';
    });
    metaData=metaData.substring(0,metaData.length-1)+"}";
    if(metaData==="}")
    {
      metaData="";
    }
    console.log(metaData);
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
    
async fakedelay() { 
    console.log("before delay");
    await this.delay(500);
    console.log("after delay");
    this.data.changeMessage(this.firstName+";"+ this.lastName+";"+ this.programID1+";"+
    this.dob_string+";"+ this.pob_city+";"+ this.pob_province+";"+ 
    this.pob_country+";"+ this.gender+";"+ this.maritialStatus+";"+ this.securityID1);
    console.log("Added data to the database");
    this.router.navigate(['/results']);

}
    
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*'
    //'Host': 'localhost:8080'
  })
};

