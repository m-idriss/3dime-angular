import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.scss'
})
export class TechStack implements OnInit {
  techStack: LinkItem[] = [];

  constructor(private readonly notionService: NotionService) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.techStack = this.notionService.getTechStacks();
    });
  }
}
