import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';
import { Card } from '../card/card';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [Card],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience implements OnInit {
  experiences: LinkItem[] = [];
  isLoading = true;

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.experiences = this.notionService.getExperiences();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
}
