import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-stuff',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './stuff.html',
  styleUrls: ['./stuff.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Stuff implements OnInit {
  stuffs: LinkItem[] = [];
  isLoading = true;

  constructor(
    private readonly notionService: NotionService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.stuffs = this.notionService.getStuffs();
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }
}
