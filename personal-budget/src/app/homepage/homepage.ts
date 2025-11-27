import { Component, inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import {isPlatformBrowser} from '@angular/common'
import { Article } from '../article/article';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js'


Chart.register(...registerables);

@Component({
  selector: 'pb-homepage',
  imports: [Article],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements AfterViewInit {


  private platformId = inject(PLATFORM_ID);


  public dataSource = {
                datasets: [
                    {
                        data: [] as number[],
                        backgroundColor: [
                            '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                        ]
                    }
                ],
                labels: [] as string[],
            };


      constructor(private http: HttpClient) {}


  ngAfterViewInit(): void {
    this.http
      .get<{ myBudget: { title: string; budget: number }[] }>(
        'http://localhost:3000/budget'
      )
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;

    }
    if (isPlatformBrowser(this.platformId)) {
          this.createChart();
        }

  });
}
    private createChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
    });
  }




}
