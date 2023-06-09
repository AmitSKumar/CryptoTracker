import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {
  coinData: any;
  coinId!: string;
  days: number = 30;
   currency: string = 'INR';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },

    plugins: {
      legend: { display: true },
    },
  };
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) mylineChart!: BaseChartDirective;
  constructor(
    private api: ApiService,
    private activatedroute: ActivatedRoute,
    private currencyService :CurrencyService
  ) {}
  ngOnInit() {
    this.activatedroute.params.subscribe((val) => {
      this.coinId = val['id'];
    });
    this.getCoinData();
    this.getGraphData(this.days);
    this.currencyService.getCurrency().subscribe(val=>{
      this.currency=val
      this.getCoinData();
      this.getGraphData(this.days);
    })
  }
  getCoinData() {
    console.log(this.coinId);
    this.api.getCurrencyById(this.coinId).subscribe((data) => {
      console.log(data);
      if(this.currency==="USD"){
        data.market_data.current_price.inr=data.market_data.current_price.usd;
        data.market_data.market_cap.inr=data.market_data.market_cap.usd
      }
      data.market_data.current_price.inr=data.market_data.current_price.inr;
      data.market_data.market_cap.inr=data.market_data.market_cap.inr
      this.coinData = data;
    });
  }
  getGraphData(days:number) {
    this.api
      .getGrpahicalCurrencyData(this.coinId, this.currency, days)
      .subscribe((gdata) => {
        setTimeout(()=>{
          this.mylineChart.chart?.update();
        },200)
        this.lineChartData.datasets[0].data = gdata.prices.map((a: any) => {
          return a[1];
        });
        this.lineChartData.labels = gdata.prices.map((a: any) => {
          let date = new Date(a[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12}:${date.getMinutes()} PM`
              : `${date.getHours()}:${date.getMinutes()} AM`;
          return days === 1 ? time : date.toLocaleDateString();
        });
      });
  }
}
