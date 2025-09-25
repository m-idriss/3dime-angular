import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit {
  contact: LinkItem[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
   this.dataService.getContact().subscribe((data: LinkItem[]) => {
     this.contact = data;
   });
  }
}
