import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './hobbies.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hobbies implements OnInit {
  hobbies: LinkItem[] = [];
  isLoading = true;

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.hobbies = this.notionService.getHobbies();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
}
