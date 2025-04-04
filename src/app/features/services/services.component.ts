import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
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
  state,
} from '@angular/animations';
import { Service } from './service.interface';
import { Benefit } from './services.interface';

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
      state(
        'default',
        style({ transform: 'perspective(1000px) rotateY(0deg)' })
      ),
      state(
        'flipped',
        style({ transform: 'perspective(1000px) rotateY(180deg)' })
      ),
      transition('default => flipped', animate('600ms ease-out')),
      transition('flipped => default', animate('600ms ease-out')),
    ]),
    trigger('fadeAndSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('pulseAnimation', [
      transition(':enter', [
        animate(
          '1500ms ease-in-out',
          keyframes([
            style({ transform: 'scale(1)', opacity: 1, offset: 0 }),
            style({ transform: 'scale(1.05)', opacity: 0.8, offset: 0.5 }),
            style({ transform: 'scale(1)', opacity: 1, offset: 1.0 }),
          ])
        ),
      ]),
    ]),
    // Novas animações
    trigger('staggerText', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '700ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('countAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('fadeSlide', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)',
        visibility: 'visible'
      })),
      state('out', style({
        opacity: 0,
        transform: 'translateX(20px)',
        visibility: 'hidden'
      })),
      transition('out => in', [
        animate('400ms cubic-bezier(0.165, 0.84, 0.44, 1)')
      ]),
      transition('in => out', [
        animate('300ms cubic-bezier(0.165, 0.84, 0.44, 1)')
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
  statistics: {
    value: string;
    label: string;
    icon: string;
    prefix?: string;
    suffix?: string;
  }[] = [];
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
  techCategories: string[] = [
    'frontend',
    'backend',
    'mobile',
    'design',
    'database',
  ];
  activeTechCategory: string = 'frontend';

  industryExpertise: { industry: string; icon: string; description: string }[] =
    [];

  // Estado para animações
  isIntersecting: { [key: string]: boolean } = {
    benefits: false,
    statistics: false,
    technologies: false,
  };

  flipStates: { [key: string]: string } = {};

  // Novas propriedades para resolver erros de linting
  cardHovered: string | null = null; // Controla o card de serviço em hover
  techHovered: string | null = null; // Controla o card de tecnologia em hover

  // Propriedade para controlar qual benefício está ativo atualmente
  activeBenefit: string | null = null;

  // Propriedade para controlar qual benefício está em hover
  hoverBenefit: string | null = null;

  // Propriedade para posição do efeito de brilho
  showcaseGlowPosition = { x: 0, y: 0 };

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    // Rolando para o topo da página ao iniciar o componente
    window.scrollTo(0, 0);
    
    this.loadAllData();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      () => {
        this.loadAllData();
      }
    );

    // Inicializa o estado de flip para cada card
    setTimeout(() => {
      if (this.benefits.length > 0) {
        this.benefits.forEach((benefit) => {
          this.flipStates[benefit.id] = 'default';
        });
      }
    }, 0);

    // Definir o benefício ativo inicial
    if (this.benefits.length > 0) {
      this.activeBenefit = this.benefits[0].id;
    }
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
      threshold: 0.3,
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
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
      sections.forEach((section) => {
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
    // Garantindo que sempre vamos inicializar as categorias mesmo se falhar a tradução
    this.serviceCategories = [
      {
        id: 'all',
        name:
          this.translocoService.translate('servicesPage.filter.all') ||
          'Todos os Serviços',
        icon: 'fas fa-th-large',
      },
      {
        id: 'web',
        name:
          this.translocoService.translate('servicesPage.filter.web') ||
          'Desenvolvimento Web',
        icon: 'fas fa-laptop-code',
      },
      {
        id: 'mobile',
        name:
          this.translocoService.translate('servicesPage.filter.mobile') ||
          'Desenvolvimento Mobile',
        icon: 'fas fa-mobile-alt',
      },
      {
        id: 'design',
        name:
          this.translocoService.translate('servicesPage.filter.design') ||
          'Design & UX',
        icon: 'fas fa-paint-brush',
      },
      {
        id: 'marketing',
        name:
          this.translocoService.translate('servicesPage.filter.marketing') ||
          'Marketing Digital',
        icon: 'fas fa-chart-line',
      },
      {
        id: 'consulting',
        name:
          this.translocoService.translate('servicesPage.filter.consulting') ||
          'Consultoria Empresarial',
        icon: 'fas fa-lightbulb',
      },
    ];
  }

  private loadServices(): void {
    // Tenta obter os serviços traduzidos
    const translatedServices = this.translocoService.translate<Service[]>(
      'servicesPage.services'
    );

    if (
      translatedServices &&
      Array.isArray(translatedServices) &&
      translatedServices.length > 0
    ) {
      this.services = translatedServices;
    } else {
      // Dados padrão caso a tradução falhe
      this.services = [
        {
          id: 'web-development',
          title: this.translocoService.translate('servicesPage.filter.web'),
          shortDescription:
            'Aplicações web personalizadas para as necessidades do seu negócio.',
          fullDescription:
            'Nossa equipe de desenvolvimento web cria sites e aplicações web personalizados e de alto desempenho.',
          icon: 'fas fa-code',
          image: 'assets/images/services/web-development.jpg',
          features: [
            'Design e desenvolvimento de sites responsivos',
            'Desenvolvimento de aplicações web personalizadas',
            'Soluções de e-commerce',
          ],
          process: [
            {
              step: 1,
              title: 'Descoberta & Planejamento',
              description:
                'Analisamos suas necessidades e desenvolvemos um plano detalhado do projeto.',
            },
            {
              step: 2,
              title: 'Desenvolvimento',
              description:
                'Nossos desenvolvedores constroem sua solução usando as tecnologias mais recentes.',
            },
          ],
          caseStudies: [
            {
              title: 'Redesign de Plataforma de E-commerce',
              client: 'Varejista de Moda',
              description: 'Redesign completo de uma plataforma de e-commerce.',
              image: 'assets/images/case-studies/ecommerce.jpg',
              results: ['Aumento de 45% na taxa de conversão'],
            },
          ],
        },
        {
          id: 'mobile-app-development',
          title: this.translocoService.translate('servicesPage.filter.mobile'),
          shortDescription:
            'Aplicações móveis nativas e multiplataforma para iOS e Android.',
          fullDescription:
            'Desenvolvemos aplicações móveis de alta qualidade que engajam usuários e impulsionam o crescimento do negócio.',
          icon: 'fas fa-mobile-alt',
          image: 'assets/images/services/mobile-app.jpg',
          features: [
            'Desenvolvimento de apps nativos para iOS',
            'Desenvolvimento multiplataforma',
          ],
          process: [
            {
              step: 1,
              title: 'Conceito & Estratégia',
              description:
                'Definimos o conceito do seu app e desenvolvemos uma estratégia abrangente.',
            },
            {
              step: 2,
              title: 'Desenvolvimento do App',
              description:
                'Construímos seu app usando as tecnologias mais adequadas.',
            },
          ],
          caseStudies: [
            {
              title: 'App de Rastreamento de Fitness',
              client: 'Empresa de Saúde e Bem-Estar',
              description:
                'Desenvolvemos um app completo de rastreamento de fitness.',
              image: 'assets/images/case-studies/fitness-app.jpg',
              results: ['Mais de 100.000 downloads no primeiro mês'],
            },
          ],
        },
        {
          id: 'ui-ux-design',
          title: this.translocoService.translate('servicesPage.filter.design'),
          shortDescription:
            'Design centrado no usuário que combina estética com funcionalidade.',
          fullDescription:
            'Nossa equipe de design cria interfaces de usuário bonitas e intuitivas que melhoram a experiência do usuário e aumentam o engajamento.',
          icon: 'fas fa-paint-brush',
          image: 'assets/images/services/ui-ux-design.jpg',
          features: [
            'Pesquisa e análise de usuários',
            'Arquitetura de informação',
            'Wireframing e prototipagem',
          ],
          process: [
            {
              step: 1,
              title: 'Pesquisa e Descoberta',
              description:
                'Realizamos pesquisas com usuários para entender seu público-alvo e suas necessidades.',
            },
            {
              step: 2,
              title: 'Design e Prototipagem',
              description:
                'Criamos designs intuitivos e protótipos interativos.',
            },
          ],
          caseStudies: [
            {
              title: 'Redesign de Aplicativo Bancário',
              client: 'Instituição Financeira',
              description:
                'Redesign completo da interface de usuário de um aplicativo bancário.',
              image: 'assets/images/case-studies/banking-app.jpg',
              results: ['Aumento de 35% na satisfação do usuário'],
            },
          ],
        },
        {
          id: 'digital-marketing',
          title: this.translocoService.translate(
            'servicesPage.filter.marketing'
          ),
          shortDescription:
            'Estratégias de marketing digital para aumentar sua presença online.',
          fullDescription:
            'Nossos especialistas em marketing digital ajudam você a alcançar seu público-alvo e aumentar conversões.',
          icon: 'fas fa-chart-line',
          image: 'assets/images/services/digital-marketing.jpg',
          features: [
            'SEO (Otimização para mecanismos de busca)',
            'Marketing de conteúdo',
            'Campanhas de mídia social',
          ],
          process: [
            {
              step: 1,
              title: 'Análise e Estratégia',
              description:
                'Analisamos seu mercado e desenvolvemos uma estratégia personalizada.',
            },
            {
              step: 2,
              title: 'Implementação e Otimização',
              description:
                'Implementamos campanhas e otimizamos continuamente para melhores resultados.',
            },
          ],
          caseStudies: [
            {
              title: 'Campanha de Marketing Digital',
              client: 'Empresa de Varejo',
              description:
                'Desenvolvimento e execução de campanha integrada de marketing digital.',
              image: 'assets/images/case-studies/marketing-campaign.jpg',
              results: ['Aumento de 120% no tráfego do site'],
            },
          ],
        },
        {
          id: 'business-consulting',
          title: this.translocoService.translate(
            'servicesPage.filter.consulting'
          ),
          shortDescription:
            'Consultoria estratégica para transformação digital do seu negócio.',
          fullDescription:
            'Fornecemos orientação especializada para ajudar sua empresa a navegar pela transformação digital.',
          icon: 'fas fa-lightbulb',
          image: 'assets/images/services/consulting.jpg',
          features: [
            'Estratégia de transformação digital',
            'Otimização de processos',
            'Análise e inteligência de dados',
          ],
          process: [
            {
              step: 1,
              title: 'Avaliação',
              description:
                'Avaliamos sua maturidade digital atual e identificamos oportunidades.',
            },
            {
              step: 2,
              title: 'Desenvolvimento de Estratégia',
              description:
                'Criamos um roteiro personalizado para sua transformação digital.',
            },
          ],
          caseStudies: [
            {
              title: 'Transformação Digital',
              client: 'Empresa de Manufatura',
              description:
                'Implementação de estratégia de transformação digital abrangente.',
              image: 'assets/images/case-studies/digital-transformation.jpg',
              results: ['Aumento de 30% na eficiência operacional'],
            },
          ],
        },
      ];
    }
  }

  private loadBenefits(): void {
    const benefitsData = this.translocoService.translate<Benefit[]>(
      'servicesPage.whyChooseUs.benefits'
    );

    if (benefitsData && Array.isArray(benefitsData)) {
      this.benefits = benefitsData;
    } else {
      this.benefits = [];
    }
  }

  private loadStatistics(): void {
    const statsData = this.translocoService.translate<
      {
        value: string;
        label: string;
        icon: string;
        prefix?: string;
        suffix?: string;
      }[]
    >('servicesPage.whyChooseUs.statistics');

    if (statsData && Array.isArray(statsData)) {
      this.statistics = statsData;
    } else {
      this.statistics = [];
    }
  }

  private loadTestimonials(): void {
    const testimonialsData = this.translocoService.translate<
      {
        text: string;
        name: string;
        position: string;
        company: string;
        image?: string;
      }[]
    >('servicesPage.testimonials.items');

    if (testimonialsData && Array.isArray(testimonialsData)) {
      this.testimonials = testimonialsData;
    } else {
      this.testimonials = [];
    }
  }

  private loadTechnologies(): void {
    const techData = this.translocoService.translate<Technology[]>(
      'servicesPage.technologies.items'
    );

    if (techData && Array.isArray(techData)) {
      this.technologies = techData;
    } else {
      this.technologies = [];
    }
  }

  private loadIndustryExpertise(): void {
    // Verifica primeiro se há dados de tradução disponíveis
    const translatedIndustries = this.translocoService.translate<
      { industry: string; icon: string; description: string }[]
    >('servicesPage.industryExpertise.items');

    // Se houver dados de tradução disponíveis, use-os
    if (
      translatedIndustries &&
      Array.isArray(translatedIndustries) &&
      translatedIndustries.length > 0
    ) {
      this.industryExpertise = translatedIndustries;
    } else {
      // Caso contrário, use dados padrão
      this.industryExpertise = [
        {
          industry:
            this.translocoService.translate(
              'servicesPage.industryExpertise.ecommerce.title'
            ) || 'E-commerce',
          icon: 'fas fa-shopping-cart',
          description:
            this.translocoService.translate(
              'servicesPage.industryExpertise.ecommerce.description'
            ) ||
            'Soluções digitais completas para plataformas de comércio eletrônico, desde lojas virtuais até marketplaces.',
        },
        {
          industry:
            this.translocoService.translate(
              'servicesPage.industryExpertise.finance.title'
            ) || 'Finanças',
          icon: 'fas fa-chart-line',
          description:
            this.translocoService.translate(
              'servicesPage.industryExpertise.finance.description'
            ) ||
            'Aplicações financeiras seguras e responsivas para bancos, fintechs e serviços de pagamento.',
        },
        {
          industry:
            this.translocoService.translate(
              'servicesPage.industryExpertise.healthcare.title'
            ) || 'Saúde',
          icon: 'fas fa-heartbeat',
          description:
            this.translocoService.translate(
              'servicesPage.industryExpertise.healthcare.description'
            ) ||
            'Sistemas de saúde digitais que melhoram a experiência do paciente e otimizam processos clínicos.',
        },
        {
          industry:
            this.translocoService.translate(
              'servicesPage.industryExpertise.education.title'
            ) || 'Educação',
          icon: 'fas fa-graduation-cap',
          description:
            this.translocoService.translate(
              'servicesPage.industryExpertise.education.description'
            ) ||
            'Plataformas educacionais interativas para instituições de ensino e empresas de e-learning.',
        },
        {
          industry:
            this.translocoService.translate(
              'servicesPage.industryExpertise.realestate.title'
            ) || 'Imobiliário',
          icon: 'fas fa-home',
          description:
            this.translocoService.translate(
              'servicesPage.industryExpertise.realestate.description'
            ) ||
            'Soluções digitais para o setor imobiliário, incluindo portais de listagem e sistemas de gerenciamento.',
        },
        {
          industry:
            this.translocoService.translate(
              'servicesPage.industryExpertise.manufacturing.title'
            ) || 'Manufatura',
          icon: 'fas fa-industry',
          description:
            this.translocoService.translate(
              'servicesPage.industryExpertise.manufacturing.description'
            ) ||
            'Sistemas digitais para otimização de processos de fabricação e cadeia de suprimentos.',
        },
      ];
    }
  }

  filterServices(categoryId: string): void {
    this.activeCategory = categoryId;
    if (categoryId === 'all') {
      this.filteredServices = this.services;
    } else {
      const categoryMap: { [key: string]: string[] } = {
        web: [
          'web-development',
          'ecommerce-development',
          'progressive-web-apps',
        ],
        mobile: ['mobile-app-development', 'cross-platform-apps'],
        design: ['ui-ux-design', 'brand-identity'],
        marketing: [
          'digital-marketing',
          'seo-optimization',
          'social-media-marketing',
        ],
        consulting: [
          'business-consulting',
          'digital-transformation',
          'it-consulting',
        ],
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
    this.flipStates[id] =
      this.flipStates[id] === 'default' ? 'flipped' : 'default';
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

  // Método para definir o benefício ativo
  setActiveBenefit(benefitId: string): void {
    this.activeBenefit = benefitId;
  }

  // Método para atualizar a posição do efeito de brilho
  updateGlowPosition(event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    this.showcaseGlowPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}
