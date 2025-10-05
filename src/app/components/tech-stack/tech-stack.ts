import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-tech-stack',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechStack implements OnInit {
  techStack: LinkItem[] = [];
  isLoading = true;

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.techStack = this.notionService.getTechStacks();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
}
