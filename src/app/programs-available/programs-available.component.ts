import { Component, OnInit } from '@angular/core';
import { Program } from 'src/app/app.component';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { stringify } from '@angular/core/src/util';
import { buildProgramsURL } from '../util/environmentHelper';

/*
 * This is a view component responsible for the Control and View of the available Programs
 */
@Component({
  selector: 'app-programs-available',
  templateUrl: './programs-available.component.html',
  styleUrls: ['./programs-available.component.css']
})
export class ProgramsAvailableComponent implements OnInit {
  dataObservable : Observable<object>;

  
  programs: Program[] = [/*{name:'Program-A',assessment:'', certainty:99, select:true},*/
                          {id : 1, name: 'Program T1'},
                          /*{name: "Children's Special Allowance", assessment:'Partial Match', certainty:30, select:false},
                          {name: 'Corporate Income Tax (T2)', assessment:'No Match', certainty:98, select:false},
{name: 'Payroll Source Deductions (T4)', assessment:'No Match', certainty:85, select:false}*/];
  constructor(private  httpClient:HttpClient) { }

  ngOnInit() {
    this.dataObservable =  this.httpClient.get<Program[]>(buildProgramsURL());
    this.dataObservable.subscribe(a => this.initPrograms(a));
  }

  initPrograms(programs){
    this.programs = programs;
  }
}
