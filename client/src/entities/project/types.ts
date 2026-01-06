export interface Project {
  id: string;
  name: string;
  environment: 'production' | 'staging' | 'development';
  region: string;
  organization: string;
  createdAt: string;
}
