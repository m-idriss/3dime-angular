import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.html'
})
export class Hobbies implements OnInit {
  hobbies: LinkItem[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
    this.dataService.getHobbies().subscribe((data: LinkItem[]) => {
      this.hobbies = data;
    });
  }
}
