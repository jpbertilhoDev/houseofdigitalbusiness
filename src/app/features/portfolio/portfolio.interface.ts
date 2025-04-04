export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  fullDescription?: string;
  date: string;
  image: string;
  hoverImage?: string;
  technologies: string[];
  link?: string;
  features?: string[];
  gallery?: string[];
  videoUrl?: string;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  icon: string;
} 