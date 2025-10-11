import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';
import { Card } from '../card/card';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [Card],
  templateUrl: './education.html',
  styleUrl: './education.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Education implements OnInit {
  education: LinkItem[] = [];
  isLoading = true;

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.education = this.notionService.getEducations();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
}
