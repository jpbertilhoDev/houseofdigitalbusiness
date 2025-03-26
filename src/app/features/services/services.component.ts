import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  features: string[];
  process: {
step: any; title: string; description: string
}[];
  caseStudies: { title: string; client: string; description: string; results: string[] }[];
}

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('800ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('staggerList', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
    trigger('staggerBenefits', [
      transition(':enter', [
        query('.benefit-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class ServicesComponent implements OnInit, OnDestroy {
  serviceCategories: { id: string; name: string }[] = [];
  services: Service[] = [];
  filteredServices: Service[] = [];
  benefits: Benefit[] = [];
  statistics: { value: string; label: string }[] = [];
  testimonials: { text: string; name: string; position: string; company: string }[] = [];
  activeCategory: string = 'all';
  selectedService: Service | null = null;
  private langChangeSubscription!: Subscription;
  servicesPage: { title: string; subtitle: string; }[] = [];

  constructor( private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadAllData();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(() => {
      this.loadAllData();
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private loadAllData(): void {
    this.loadServiceCategories();
    this.loadServices();
    this.loadBenefits();
    this.loadStatistics();
    this.loadTestimonials();
    this.filterServices(this.activeCategory);
  }

  private loadServiceCategories(): void {
    this.serviceCategories = [
      { id: 'all', name: this.translocoService.translate('servicesPage.filter.all') },
      { id: 'web', name: this.translocoService.translate('servicesPage.filter.web') },
      { id: 'mobile', name: this.translocoService.translate('servicesPage.filter.mobile') },
      { id: 'design', name: this.translocoService.translate('servicesPage.filter.design') },
      { id: 'marketing', name: this.translocoService.translate('servicesPage.filter.marketing') },
      { id: 'consulting', name: this.translocoService.translate('servicesPage.filter.consulting') },
    ];
  }

  private loadServices(): void {
    this.services = this.translocoService.translate('servicesPage.services');
  }

  private loadBenefits(): void {
    this.benefits = this.translocoService.translate('servicesPage.whyChooseUs.benefits');
  }

  private loadStatistics(): void {
    this.statistics = this.translocoService.translate('servicesPage.whyChooseUs.statistics');
  }

  private loadTestimonials(): void {
    this.testimonials = this.translocoService.translate('servicesPage.testimonials.items');
  }

  filterServices(categoryId: string): void {
    this.activeCategory = categoryId;
    if (categoryId === 'all') {
      this.filteredServices = this.services;
    } else {
      const categoryMap: { [key: string]: string[] } = {
        web: ['web-development'],
        mobile: ['mobile-app-development'],
        design: ['ui-ux-design'],
        marketing: ['digital-marketing'],
        consulting: ['business-consulting'],
      };
      const serviceIds = categoryMap[categoryId] || [];
      this.filteredServices = this.services.filter((service) => serviceIds.includes(service.id));
    }
    this.selectedService = null;
  }

  selectService(service: Service): void {
    this.selectedService = service;
    setTimeout(() => {
      const element = document.getElementById('service-details');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  clearSelectedService(): void {
    this.selectedService = null;
  }
}
