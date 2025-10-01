import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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

  constructor(private readonly notionService: NotionService) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.experiences = this.notionService.getExperiences();
    });
  }
}
