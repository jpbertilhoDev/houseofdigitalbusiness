export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  serviceInterest?: string;
  howDidYouHear?: string;
  agreeToTerms: boolean;
}

export interface Office {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  hours: string;
}
