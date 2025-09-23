import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // indispensable pour *ngIf

@Component({
  selector: 'app-profile-card',
  standalone: true,   // si vous utilisez standalone components
  imports: [CommonModule],
  templateUrl: './profile-card.html',
  styleUrls: ['./profile-card.scss']
})
export class ProfileCard {
  menuOpen = false;

  toggleMenu() {
    console.log('Menu clicked'); // pour vérifier que le click est détecté
    this.menuOpen = !this.menuOpen;
  }

  cycleTheme() {
    console.log('Cycle theme');
  }

  toggleVideoBg() {
    console.log('Toggle video bg');
  }

  changeFontSize() {
    console.log('Change font size');
  }
}
