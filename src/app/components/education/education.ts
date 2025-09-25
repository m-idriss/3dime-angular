import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-education',
  imports: [],
  templateUrl: './education.html',
  styleUrl: './education.scss'
})
export class Education implements OnInit {
  education: LinkItem[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
   this.dataService.getEducation().subscribe((data: LinkItem[]) => {
     this.education = data;
   });
  }
}
