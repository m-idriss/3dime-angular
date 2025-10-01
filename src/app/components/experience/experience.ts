import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Experience implements OnInit {
  experiences: LinkItem[] = [];

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.experiences = this.notionService.getExperiences();
      this.cdr.markForCheck();
    });
  }
}
