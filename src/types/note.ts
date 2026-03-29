export interface Subject {
  id: string;
  name: string;
  icon: string;
  order: number;
  createdAt?: any;
}

export interface Unit {
  id: string;
  name: string;
  order: number;
  chatCount: number;
}

export interface SavedChat {
  id: string;
  question: string;
  answer: string;
  editData?: string | null;
  order: number;
  savedAt?: any;
}
