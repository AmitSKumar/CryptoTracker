import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';
@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit {
  bannerData:any
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];
  dataSource!: MatTableDataSource<any>;
  currency:string="INR"

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
constructor(private api :ApiService, private router: Router,private currencyService :CurrencyService){

}
ngOnInit(): void {
  this.getBannerData();
  this.getAllData(); 
  this.currencyService.getCurrency().subscribe(val=>{
    this.currency=val
    this.getBannerData();
    this.getAllData(); 
  })
}
getBannerData(){
this.api.getTrendingCurrency(this.currency).subscribe(res=>{
  console.log(res)
  this.bannerData=res
})
}
getAllData(){
  this.api.getCurrencyData(this.currency).subscribe(res=>{
    console.log(res)
    this.dataSource= new MatTableDataSource(res)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  })
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getCdetails(row:any){
console.log(row)
this.router.navigate(['coin-details',row.id])
  }
}
