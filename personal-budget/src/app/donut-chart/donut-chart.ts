import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService, BudgetItem } from '../data';
``
@Component({
  selector: 'pb-donut-chart',
  imports: [],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
})

export class DonutChartComponent implements AfterViewInit {
  @ViewChild('d3Donut', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.getBudgetData().subscribe((items: BudgetItem[]) => {
      this.buildChart(items);
    });
  }

  private buildChart(items: BudgetItem[]): void {
    const data = items.map(d => ({
      label: d.title,
      value: d.budget,
    }));

    const element = this.chartContainer.nativeElement;

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range([
        '#98abc5',
        '#8a89a6',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00',
      ]);

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<{ label: string; value: number }>()
      .sort(null)
      .value(d => d.value);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    const arcs = svg
      .selectAll('path.slice')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('fill', d => color(d.data.label)!)
      .attr('d', arc as any)
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .attr('opacity', 1);

      svg
        .selectAll<SVGPathElement, d3.PieArcDatum<{ label: string; value: number }>>('path.slice')
        .on('mouseover', function (event: MouseEvent, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('transform', 'scale(1.05)');
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('transform', 'scale(1)');
        });


const labelArc = d3
  .arc<d3.PieArcDatum<{ label: string; value: number }>>()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

svg
  .selectAll('text')
  .data(pie(data))
  .enter()
  .append('text')
  .attr('dy', '.35em')
  .text(d => d.data.label)
  .attr('transform', d => {
    const pos = (labelArc.centroid(d) as [number, number]) || [0, 0];

    const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    const offset = 15;

    if (midAngle < Math.PI) {

      pos[0] += offset;
    } else {
      pos[0] -= offset;
    }

    return `translate(${pos[0]}, ${pos[1]})`;
  })
  .style('font-size', '12px')
  .style('text-anchor', d => {
    const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    return midAngle < Math.PI ? 'start' : 'end';
  });
  }
}
