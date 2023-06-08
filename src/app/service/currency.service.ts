import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
private selecteCurrency$ :BehaviorSubject<string>=new BehaviorSubject<string>("INR")
  constructor() { }
  getCurrency(){
    return this.selecteCurrency$.asObservable();
  }
  setCurrency(currency:any){
    this.selecteCurrency$.next(currency)
  }
}
