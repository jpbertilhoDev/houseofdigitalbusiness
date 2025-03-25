export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  features: string[];
  process: {
    step: number;
    title: string;
    description: string;
  }[];
  caseStudies: {
    title: string;
    client: string;
    description: string;
    image: string;
    results: string[];
  }[];
}
