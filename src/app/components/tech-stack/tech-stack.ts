import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tech-stack',
  imports: [],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.scss'
})
export class TechStack implements OnInit {
  techStack: LinkItem[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
    this.dataService.getTechStacks().subscribe((data: LinkItem[]) => {
      this.techStack = data;
    });
  }
}
