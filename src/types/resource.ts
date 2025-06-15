export type Resource = {
  id: string;
  name: string;
  type: string;
  submittedBy: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
};
