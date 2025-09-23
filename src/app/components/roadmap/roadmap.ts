import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoadmapService } from '../../services/roadmap.service';
import { Roadmap as RoadmapInterface, RoadmapItem } from '../../models/roadmap.interface';

@Component({
  selector: 'app-roadmap',
  imports: [CommonModule, FormsModule],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.scss'
})
export class Roadmap {
  // Inject the service
  private roadmapService = inject(RoadmapService);

  // UI state signals
  showCreateRoadmap = signal(false);
  showCreateItem = signal<string | null>(null);
  selectedRoadmap = signal<string | null>(null);
  editingItem = signal<string | null>(null);

  // Form data signals
  newRoadmapName = signal('');
  newRoadmapDescription = signal('');
  newItemTitle = signal('');
  newItemDescription = signal('');
  newItemPriority = signal<RoadmapItem['priority']>('medium');
  newItemDueDate = signal('');

  // Computed values
  roadmaps = this.roadmapService.getRoadmaps();
  
  selectedRoadmapData = computed(() => {
    const selectedId = this.selectedRoadmap();
    return selectedId ? this.roadmapService.getRoadmapById(selectedId) : null;
  });

  // Roadmap CRUD operations
  createRoadmap() {
    const name = this.newRoadmapName().trim();
    const description = this.newRoadmapDescription().trim();
    
    if (name) {
      const id = this.roadmapService.createRoadmap(name, description);
      this.selectedRoadmap.set(id);
      this.newRoadmapName.set('');
      this.newRoadmapDescription.set('');
      this.showCreateRoadmap.set(false);
    }
  }

  deleteRoadmap(id: string) {
    if (confirm('Are you sure you want to delete this roadmap?')) {
      this.roadmapService.deleteRoadmap(id);
      if (this.selectedRoadmap() === id) {
        this.selectedRoadmap.set(null);
      }
    }
  }

  // Item CRUD operations
  createItem(roadmapId: string) {
    const title = this.newItemTitle().trim();
    const description = this.newItemDescription().trim();
    const dueDate = this.newItemDueDate() ? new Date(this.newItemDueDate()) : undefined;
    
    if (title) {
      this.roadmapService.addItemToRoadmap(
        roadmapId, 
        title, 
        description, 
        this.newItemPriority(),
        dueDate
      );
      this.resetItemForm();
      this.showCreateItem.set(null);
    }
  }

  updateItemStatus(roadmapId: string, itemId: string, status: RoadmapItem['status']) {
    this.roadmapService.updateRoadmapItem(roadmapId, itemId, { status });
  }

  deleteItem(roadmapId: string, itemId: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.roadmapService.deleteRoadmapItem(roadmapId, itemId);
    }
  }

  // UI helper methods
  toggleCreateRoadmap() {
    this.showCreateRoadmap.update(show => !show);
  }

  toggleCreateItem(roadmapId: string) {
    const current = this.showCreateItem();
    this.showCreateItem.set(current === roadmapId ? null : roadmapId);
    if (current !== roadmapId) {
      this.resetItemForm();
    }
  }

  selectRoadmap(id: string) {
    this.selectedRoadmap.set(this.selectedRoadmap() === id ? null : id);
  }

  private resetItemForm() {
    this.newItemTitle.set('');
    this.newItemDescription.set('');
    this.newItemPriority.set('medium');
    this.newItemDueDate.set('');
  }

  // Status helper methods
  getStatusClass(status: RoadmapItem['status']): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      default: return 'status-not-started';
    }
  }

  getPriorityClass(priority: RoadmapItem['priority']): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
