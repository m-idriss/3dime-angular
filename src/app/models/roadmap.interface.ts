export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  items: RoadmapItem[];
  createdAt: Date;
  updatedAt: Date;
}