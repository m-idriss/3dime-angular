import { Injectable, signal } from '@angular/core';
import { Roadmap, RoadmapItem } from '../models/roadmap.interface';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  private readonly STORAGE_KEY = 'roadmaps';
  
  // Signal to manage roadmaps reactively
  private roadmaps = signal<Roadmap[]>([]);
  
  constructor() {
    this.loadRoadmaps();
  }

  // Get all roadmaps as a signal
  getRoadmaps() {
    return this.roadmaps.asReadonly();
  }

  // Create a new roadmap
  createRoadmap(name: string, description: string): string {
    const id = this.generateId();
    const roadmap: Roadmap = {
      id,
      name,
      description,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.roadmaps.update(roadmaps => [...roadmaps, roadmap]);
    this.saveToStorage();
    return id;
  }

  // Update an existing roadmap
  updateRoadmap(id: string, updates: Partial<Omit<Roadmap, 'id' | 'createdAt'>>): void {
    this.roadmaps.update(roadmaps => 
      roadmaps.map(roadmap => 
        roadmap.id === id 
          ? { ...roadmap, ...updates, updatedAt: new Date() }
          : roadmap
      )
    );
    this.saveToStorage();
  }

  // Delete a roadmap
  deleteRoadmap(id: string): void {
    this.roadmaps.update(roadmaps => roadmaps.filter(roadmap => roadmap.id !== id));
    this.saveToStorage();
  }

  // Add item to roadmap
  addItemToRoadmap(roadmapId: string, title: string, description: string, priority: RoadmapItem['priority'] = 'medium', dueDate?: Date): void {
    const item: RoadmapItem = {
      id: this.generateId(),
      title,
      description,
      status: 'not-started',
      priority,
      dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.roadmaps.update(roadmaps =>
      roadmaps.map(roadmap =>
        roadmap.id === roadmapId
          ? { ...roadmap, items: [...roadmap.items, item], updatedAt: new Date() }
          : roadmap
      )
    );
    this.saveToStorage();
  }

  // Update roadmap item
  updateRoadmapItem(roadmapId: string, itemId: string, updates: Partial<Omit<RoadmapItem, 'id' | 'createdAt'>>): void {
    this.roadmaps.update(roadmaps =>
      roadmaps.map(roadmap =>
        roadmap.id === roadmapId
          ? {
              ...roadmap,
              items: roadmap.items.map(item =>
                item.id === itemId
                  ? { ...item, ...updates, updatedAt: new Date() }
                  : item
              ),
              updatedAt: new Date()
            }
          : roadmap
      )
    );
    this.saveToStorage();
  }

  // Delete roadmap item
  deleteRoadmapItem(roadmapId: string, itemId: string): void {
    this.roadmaps.update(roadmaps =>
      roadmaps.map(roadmap =>
        roadmap.id === roadmapId
          ? {
              ...roadmap,
              items: roadmap.items.filter(item => item.id !== itemId),
              updatedAt: new Date()
            }
          : roadmap
      )
    );
    this.saveToStorage();
  }

  // Get roadmap by ID
  getRoadmapById(id: string): Roadmap | undefined {
    return this.roadmaps().find(roadmap => roadmap.id === id);
  }

  // Private methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private loadRoadmaps(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const roadmaps = JSON.parse(stored);
        // Convert date strings back to Date objects
        const parsedRoadmaps = roadmaps.map((roadmap: any) => ({
          ...roadmap,
          createdAt: new Date(roadmap.createdAt),
          updatedAt: new Date(roadmap.updatedAt),
          items: roadmap.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined
          }))
        }));
        this.roadmaps.set(parsedRoadmaps);
      }
    } catch (error) {
      console.error('Error loading roadmaps from storage:', error);
      this.roadmaps.set([]);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.roadmaps()));
    } catch (error) {
      console.error('Error saving roadmaps to storage:', error);
    }
  }
}