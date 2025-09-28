import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { NotionService } from '../../services/notion.service';

@Component({
  selector: 'app-hobbies',
  standalone: true,
  templateUrl: './hobbies.html'
})
export class Hobbies implements OnInit {
  hobbies: LinkItem[] = [];

  constructor(private readonly notionService: NotionService) {}

  ngOnInit() {
    this.notionService.fetchAll().subscribe(() => {
      this.hobbies = this.notionService.getHobbies();
    });
  }
}
