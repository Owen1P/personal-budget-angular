import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';

export interface BudgetItem {
  title: string;
  budget: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
   private budgetData: BudgetItem[] | null = null;
   private budgetRequest$: Observable<BudgetItem[]> | null = null;

  constructor(private http: HttpClient) {}

  getBudgetData(): Observable<BudgetItem[]> {
    // if fetched data already return cached value
    if (this.budgetData) {
      return of(this.budgetData);
    }

    // if it is already in flight use

    if(this.budgetRequest$) {
      return this.budgetRequest$
    }

    this.budgetRequest$ = this.http
      .get<{ myBudget: BudgetItem[] }>('http://localhost:3000/budget')
      .pipe(
        map(res => res.myBudget),
        tap(data => {
          this.budgetData = data;
        }),
        shareReplay(1)
      );

      return this.budgetRequest$
  }
}
