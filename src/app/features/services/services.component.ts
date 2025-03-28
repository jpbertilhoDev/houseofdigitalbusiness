import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  keyframes,
  state
} from '@angular/animations';
import { Service } from './service.interface';

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface Technology {
  id: string;
  name: string;
  icon: string;
  category: string;
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
        animate(
          '800ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('staggerList', [
      transition(':enter', [
        query(
          '.stagger-item',
          [
            style({ opacity: 0, transform: 'translateY(30px)' }),
            stagger(100, [
              animate(
                '600ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('staggerBenefits', [
      transition(':enter', [
        query(
          '.benefit-card',
          [
            style({ opacity: 0, transform: 'translateY(30px)' }),
            stagger(100, [
              animate(
                '600ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('rotate3d', [
      state('default', style({ transform: 'perspective(1000px) rotateY(0deg)' })),
      state('flipped', style({ transform: 'perspective(1000px) rotateY(180deg)' })),
      transition('default => flipped', animate('600ms ease-out')),
      transition('flipped => default', animate('600ms ease-out'))
    ]),
    trigger('fadeAndSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulseAnimation', [
      transition(':enter', [
        animate('1500ms ease-in-out',
          keyframes([
            style({ transform: 'scale(1)', opacity: 1, offset: 0 }),
            style({ transform: 'scale(1.05)', opacity: 0.8, offset: 0.5 }),
            style({ transform: 'scale(1)', opacity: 1, offset: 1.0 })
          ])
        )
      ])
    ])
  ],
})
export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('techStackSection') techStackSection!: ElementRef;

  serviceCategories: { id: string; name: string; icon: string }[] = [];
  services: Service[] = [];
  filteredServices: Service[] = [];
  benefits: Benefit[] = [];
  statistics: { value: string; label: string; icon: string; prefix?: string; suffix?: string }[] = [];
  testimonials: {
    text: string;
    name: string;
    position: string;
    company: string;
    image?: string;
  }[] = [];
  technologies: Technology[] = [];

  activeCategory: string = 'all';
  selectedService: Service | null = null;
  private langChangeSubscription!: Subscription;
  private scrollSubscription!: Subscription;

  // Novas propriedades
  techCategories: string[] = ['frontend', 'backend', 'mobile', 'design', 'database'];
  activeTechCategory: string = 'frontend';

  industryExpertise: { industry: string; icon: string; description: string }[] = [];

  // Estado para animações
  isIntersecting: { [key: string]: boolean } = {
    benefits: false,
    statistics: false,
    technologies: false
  };

  flipStates: { [key: string]: string } = {};

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadAllData();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      () => {
        this.loadAllData();
      }
    );

    // Inicializa o estado de flip para cada card
    setTimeout(() => {
      if (this.benefits.length > 0) {
        this.benefits.forEach(benefit => {
          this.flipStates[benefit.id] = 'default';
        });
      }
    }, 0);
  }

  ngAfterViewInit(): void {
    this.setupScrollObserver();
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  private setupScrollObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && this.isIntersecting.hasOwnProperty(sectionId)) {
              this.isIntersecting[sectionId] = true;
            }
          }
        });
      }, options);

      // Observa as seções principais
      const sections = document.querySelectorAll('.observe-section');
      sections.forEach(section => {
        observer.observe(section);
      });
    }
  }

  private loadAllData(): void {
    this.loadServiceCategories();
    this.loadServices();
    this.loadBenefits();
    this.loadStatistics();
    this.loadTestimonials();
    this.loadTechnologies();
    this.loadIndustryExpertise();
    this.filterServices(this.activeCategory);
  }

  private loadServiceCategories(): void {
    this.serviceCategories = [
      {
        id: 'all',
        name: this.translocoService.translate('servicesPage.filter.all'),
        icon: 'fas fa-th-large',
      },
      {
        id: 'web',
        name: this.translocoService.translate('servicesPage.filter.web'),
        icon: 'fas fa-laptop-code',
      },
      {
        id: 'mobile',
        name: this.translocoService.translate('servicesPage.filter.mobile'),
        icon: 'fas fa-mobile-alt',
      },
      {
        id: 'design',
        name: this.translocoService.translate('servicesPage.filter.design'),
        icon: 'fas fa-paint-brush',
      },
      {
        id: 'marketing',
        name: this.translocoService.translate('servicesPage.filter.marketing'),
        icon: 'fas fa-chart-line',
      },
      {
        id: 'consulting',
        name: this.translocoService.translate('servicesPage.filter.consulting'),
        icon: 'fas fa-lightbulb',
      },
    ];
  }

  private loadServices(): void {
    this.services = this.translocoService.translate('servicesPage.services');
  }

  private loadBenefits(): void {
    this.benefits = this.translocoService.translate(
      'servicesPage.whyChooseUs.benefits'
    );
  }

  private loadStatistics(): void {
    this.statistics = this.translocoService.translate(
      'servicesPage.whyChooseUs.statistics'
    );
  }

  private loadTestimonials(): void {
    this.testimonials = this.translocoService.translate(
      'servicesPage.testimonials.items'
    );
  }

  private loadTechnologies(): void {
    this.technologies = this.translocoService.translate(
      'servicesPage.technologies.items'
    ) || [];
  }

  private loadIndustryExpertise(): void {
    this.industryExpertise = this.translocoService.translate(
      'servicesPage.industryExpertise'
    ) || [];
  }

  filterServices(categoryId: string): void {
    this.activeCategory = categoryId;
    if (categoryId === 'all') {
      this.filteredServices = this.services;
    } else {
      const categoryMap: { [key: string]: string[] } = {
        web: ['web-development', 'ecommerce-development', 'progressive-web-apps'],
        mobile: ['mobile-app-development', 'cross-platform-apps'],
        design: ['ui-ux-design', 'brand-identity'],
        marketing: ['digital-marketing', 'seo-optimization', 'social-media-marketing'],
        consulting: ['business-consulting', 'digital-transformation', 'it-consulting'],
      };
      const serviceIds = categoryMap[categoryId] || [];
      this.filteredServices = this.services.filter((service) =>
        serviceIds.includes(service.id)
      );
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

  filterTechnologies(category: string): void {
    this.activeTechCategory = category;
  }

  toggleFlipState(id: string): void {
    this.flipStates[id] = this.flipStates[id] === 'default' ? 'flipped' : 'default';
  }

  scrollToServices(): void {
    const servicesSection = document.querySelector('.services-grid');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Monitora o evento de rolagem para animações
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Implementa lógica de animação baseada em rolagem se necessário
  }
}
