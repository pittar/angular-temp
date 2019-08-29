import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject("default message");
  private messageSource2 = new BehaviorSubject("default message 2");
  currentMessage = this.messageSource.asObservable();
  currentMessage2 = this.messageSource2.asObservable();
  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  changeMessage2(message: string) {
    this.messageSource2.next(message)
  }

}