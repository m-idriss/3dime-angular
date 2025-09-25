import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-stuff',
  imports: [],
  templateUrl: './stuff.html',
  styleUrl: './stuff.scss'
})
export class Stuff implements OnInit {
  stuffs: LinkItem[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
    this.dataService.getStuffs().subscribe((data: LinkItem[]) => {
      this.stuffs = data;
    });
  }
}
