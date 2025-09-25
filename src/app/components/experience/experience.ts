import { Component, OnInit } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience implements OnInit {
  experiences: LinkItem[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
    this.dataService.getExperiences().subscribe((data: LinkItem[]) => {
      this.experiences = data;
    });
  }
}
