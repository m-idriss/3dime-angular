import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements OnInit {
 about: { title: string; content: string } | null = null;

 constructor(private readonly dataService: DataService) {}

 ngOnInit() {
   this.dataService.getAbout().subscribe(data => {
     this.about = data;
   });
 }
}
