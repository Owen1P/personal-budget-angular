import { Component, OnInit } from '@angular/core';
import { Article } from '../article/article';
import { DonutChartComponent } from '../donut-chart/donut-chart';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';

import { DataService, BudgetItem } from '../data';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [Article, DonutChartComponent, Breadcrumbs],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss'],
})
export class Homepage implements OnInit {

  public dataSource = {
    datasets: [
      {
        data: [] as number[],
        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19'],
      },
    ],
    labels: [] as string[],
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getBudgetData().subscribe((items: BudgetItem[]) => {
      for (let i = 0; i < items.length; i++) {
        this.dataSource.datasets[0].data[i] = items[i].budget;
        this.dataSource.labels[i] = items[i].title;
      }
      this.createChart();
    });
  }

  private createChart(): void {
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
