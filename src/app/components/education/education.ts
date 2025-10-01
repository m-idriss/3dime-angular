import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-education',
  standalone: true,
  templateUrl: './education.html',
  styleUrl: './education.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Education implements OnInit {
  education: LinkItem[] = [];

  constructor(private readonly notionService: NotionService) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.education = this.notionService.getEducations();
   });
  }
}
