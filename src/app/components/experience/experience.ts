import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { Card } from '../card/card';
import { NotionAwareComponent } from '../base/notion-aware.component';
import { LinkItem } from '../../models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [Card, MatChipsModule, MatDividerModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience extends NotionAwareComponent {
  experiences: LinkItem[] = [
    { name: 'Amadeus Order Management System', url: '#' },
    { name: 'Astek', url: '#' },
    { name: 'Oodrive Sign', url: '#' },
    { name: "Barber L'Architecte", url: '#' },
    { name: 'Erese (Habitat & territoires conseil)', url: '#' },
    { name: 'PFT Energies Propres', url: '#' },
    { name: 'Eurotelis (Valiance, now Securitas)', url: '#' }
  ];

  override ngOnInit(): void {
    // Skip loading for testing
    this.isLoading = false;
  }

  protected getProgressiveItems(): Observable<LinkItem> {
    return this.notionService.fetchExperiencesProgressively();
  }

  protected onItemLoaded(item: LinkItem): void {
    this.experiences.push(item);
  }
}
