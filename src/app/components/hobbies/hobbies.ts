import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  templateUrl: './hobbies.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hobbies implements OnInit {
  hobbies: LinkItem[] = [];

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.hobbies = this.notionService.getHobbies();
      this.cdr.markForCheck();
    });
  }
}
