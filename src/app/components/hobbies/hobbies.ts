import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';
import { Card } from '../card/card';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [Card],
  templateUrl: './hobbies.html',
  styleUrl: './hobbies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hobbies implements OnInit {
  hobbies: LinkItem[] = [];
  isLoading = true;

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.hobbies = this.notionService.getHobbies();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
}
