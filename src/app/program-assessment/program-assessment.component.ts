import { Component, OnInit } from '@angular/core';
import { Program, Key, MetaData, LinkageType } from 'src/app/app.component';
import { TombstoneModel} from '../TomstoneModel'
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { DataService } from '../data.service';
import { LinkageData } from 'src/app/app.component';
import { buildProgramsURL, buildLinkageTypesURL, buildLinkagesSearchURL, buildLinkagesMetaDataSearchURL } from '../util/environmentHelper';


@Component({
  selector: 'app-program-assessment',
  templateUrl: './program-assessment.component.html',
  styleUrls: ['./program-assessment.component.css'],

})
export class ProgramAssessmentComponent implements OnInit {

  message:string;
  dataObservable : Observable<any>;
  records: TombstoneModel[];
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
  dob: Date;
  dob_string: string;
  programs: Program[] = [/*{name: 'program1', assessment:'Match', certainty:100, select:false},*/
  {id:1,name: 'Individual Income Tax (T1)'},
  {id:2,name: "Children's Special Allowance"},
  {id:3,name: 'Corporate Income Tax (T2)'},
  {id:4,name: 'Payroll Source Deductions (T4)'}];

  selected_program:Program =this.programs[0];
  selected_program_id:number = this.selected_program.id;
  metaData:MetaData  = {id:-1, key_id:-1, metaData:"N/A - Program Not Specified", timestamp:"----"};
  selected_link:LinkageData;
  linkageTypes: LinkageType[] = [];
  selected_type:LinkageType;
  selected_type_name:string;
  allLinkages: LinkageData[];
  linkages: LinkageData[];
  searchAs: string;
  
  constructor(private  httpClient:HttpClient, private data: DataService) { }

  ngOnInit() {

    this.data.currentMessage.subscribe(message => this.message = message);
    this.programID = this.message.split(";")[2].replace(";","");
    this.securityID = this.message.split(";")[9].replace(";","");
    this.searchAs = this.message.split(";")[10].replace(";","");
    this.selected_type = { id: Number.parseInt(this.message.split(";")[11].replace(";","")), type:this.searchAs};

    if(this.programID === 'undefined')
      this.dataObservable =  this.httpClient.get<Key[]>(buildLinkagesSearchURL()+this.securityID.split(' ').join('').replace(' ',''));
    else if( this.selected_type.type ==="Admin")
      this.dataObservable =  this.httpClient.get<Key[]>(buildLinkagesSearchURL()+this.securityID.split(' ').join('').replace(' ','')+"/"+this.programID);
    else
      this.dataObservable =  this.httpClient.get<Key[]>(buildLinkagesSearchURL()+"/authorizedLinkages/"+this.selected_type.id+"/"+this.securityID.split(' ').join('').replace(' ','')+"/"+this.programID);
    this.dataObservable.subscribe(b => this.getLinkages(b))

    this.dataObservable =  this.httpClient.get<Program[]>(buildProgramsURL());
    this.dataObservable.subscribe(c => this.initPrograms(c));

    this.dataObservable =  this.httpClient.get<LinkageType[]>(buildLinkageTypesURL());
    this.dataObservable.subscribe(t => this.initLinkageTypes(t));
    
  }

  initLinkageTypes(types: LinkageType[]){
    if(this.searchAs==="Admin"){
      this.linkageTypes = types;
    }
    else{
      for(let temp of types){
        console.log(temp.type +" -- " + this.searchAs)
        if(this.searchAs===temp.type){
          this.linkageTypes.push(temp);
          console.log("added "+ temp.type);
        }
      }
    }
    //this.linkageTypes = types;
    //this.selectedType = "CRA";
  }

  initPrograms(programs){
    this.programs = programs;
  }

  updateLinkages() {
    //filter list of linkages by program
    var list: LinkageData[]=[];
    this.selected_program = this.programs[this.selected_program_id-1];
    if (this.selected_program_id != -1){
      for (let link of this.allLinkages){
        console.log(this.selected_program.name);
        if ((link.program1 === ""+this.selected_program.id && link.key1!=this.securityID) || (link.program2 === ""+this.selected_program.id && link.key2!=this.securityID))
          list.push(link);
      }
    this.linkages = list;
    }
    else{
      this.linkages = this.allLinkages;
    }

    //filter list of linkages by linkage-type
    var temp:LinkageData[] = this.linkages;
    var selected_type_id = -1;
    list = [];
    for(let x of this.linkageTypes){
      if(x.type === this.selected_type_name)
        selected_type_id = x.id;
    }
    if(this.selected_type_name==="Transitive"){
      selected_type_id = 0;
    }
    if(selected_type_id!=-1){
      this.dataObservable =  this.httpClient.get<LinkageData[]>(buildLinkagesSearchURL()+this.securityID.split(" ").join("").replace(" ","")+"/"+this.programID+"/"+selected_type_id);
      this.dataObservable.subscribe(array => {

        if(this.selected_type_name != "All Types"){
          //this.selected_type = this.linkageTypes[this.selected_type_id-1];
          //console.log(this.selected_type.type +" - " +this.selected_type_id);
          for (let a of temp){
            for(let b of array){
              if ((a.key1 === b.key1 && a.key2 === b.key2) || (a.key2 === b.key1 && a.key1 == b.key2)){
                list.push(a);
                break;
              }
            }

          }
          this.linkages = list;
        }
        else{
          this.selected_type = {id:-1, type: "All Types"};
          this.selected_type_name= this.selected_type.type;
          this.linkages = temp;
        }
        if(this.linkages.length>0)
          this.row_click(this.linkages[0]);
        else
          this.metaData = {id:-1, key_id:-1, metaData: "N/A", timestamp:"N/A"};
      });

    }
    else{
      if(this.linkages.length>0)
        this.row_click(this.linkages[0]);
      else
        this.metaData = {id:-1, key_id:-1, metaData: "N/A", timestamp:"N/A"};
    }

    for(let link of this.linkages){
      link.key1=this.formatInput(link.key1, link.key1_type);
      link.key2=this.formatInput(link.key2, link.key2_type);
    }
    
    console.log("Updating Linkages");
    
  }
  getLinkages(linkages){
    this.allLinkages=linkages;
    this.linkages=linkages;
    console.log(this.allLinkages.length +" Linkages found");
    this.selected_program = {id:-1, name: "All Programs"};
    this.selected_program_id = this.selected_program.id;
    this.selected_type = {id:-1, type: "All Types"};
    this.selected_type_name = this.selected_type.type;
    //this.selected_type_id = this.selected_type.id;
    this.updateLinkages();
    
  }


defaultValues(records: object){

     this.records = Object(records).tombstone_array;

        this.data.currentMessage.subscribe(message => this.message = message)
        this.securityID = this.message.split(";")[9].replace(";","");

  }

  getBackgroundColor(link:LinkageData){
    if(link === this.selected_link){
      return "rgb(168, 222, 255)";
    }
    else
      return"";
  }

  row_click(checked_key:LinkageData){
    //var count = 0;
    this.selected_link = checked_key;
    if (checked_key.key1.split(' ').join('').replace(' ','')=== this.securityID && checked_key.program1 === this.programID)
      this.dataObservable = this.httpClient.get<MetaData[]>(buildLinkagesMetaDataSearchURL()+checked_key.key2.split(" ").join("").replace(" ","")+"/"+ checked_key.program2);
    else
      this.dataObservable = this.httpClient.get<MetaData[]>(buildLinkagesMetaDataSearchURL()+checked_key.key1.split(" ").join("").replace(" ","")+"/"+ checked_key.program1);
    this.dataObservable.subscribe(array => {
        this.metaData = array[0];
    });
  }

  link(){
    this.data.changeMessage2(this.securityID+"");
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