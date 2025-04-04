import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, throttleTime } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { PortfolioItem, PortfolioCategory } from './portfolio.interface';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, FormsModule, SafeUrlPipe],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.6s ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
    trigger('expandCard', [
      state('default', style({ 
        height: '100%',
        transform: 'scale(1)'
      })),
      state('expanded', style({ 
        height: '110%',
        transform: 'scale(1.05)'
      })),
      transition('default <=> expanded', [
        animate('0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)')
      ])
    ]),
    trigger('fadeSlide', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, transform: 'translateY(20px)', display: 'none' })),
      transition('in => out', [animate('0.3s ease-out')]),
      transition('out => in', [animate('0.5s ease-out')]),
    ]),
  ],
})
export class PortfolioComponent implements OnInit, OnDestroy, AfterViewInit {
  // Injeção de serviços
  private translocoService = inject(TranslocoService);
  private destroy$ = new Subject<void>();
  
  // Referências e estados
  @ViewChild('portfolioGrid') portfolioGrid!: ElementRef;
  activeFilter: string = 'all';
  hoveredItem: string | null = null;
  selectedItem: PortfolioItem | null = null;
  modalOpen: boolean = false;
  scrollY: number = 0;
  currentGalleryIndex: number = 0;
  
  // Dados de portfólio
  portfolioItems: PortfolioItem[] = [
    {
      id: 'project-1',
      title: 'Modern E-Commerce Platform',
      category: 'web-development',
      client: 'FashionRetail GmbH',
      date: '2023',
      description: 'A full-featured e-commerce platform with modern UI and seamless payment integration.',
      fullDescription: 'A comprehensive e-commerce solution built with React, Node.js, and MongoDB. The platform features real-time inventory management, advanced product filtering, secure payment processing with Stripe, and a responsive design for all devices.',
      image: 'assets/images/portfolio/ecommerce-showcase.jpg',
      hoverImage: 'assets/images/portfolio/ecommerce-hover.jpg',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
      link: 'https://fashionretail-demo.com',
      features: [
        'Responsive design for all devices',
        'User authentication and profiles',
        'Advanced product filtering and search',
        'Secure payment processing',
        'Order tracking and management'
      ],
      gallery: [
        'assets/images/portfolio/ecommerce-1.jpg',
        'assets/images/portfolio/ecommerce-2.jpg',
        'assets/images/portfolio/ecommerce-3.jpg'
      ]
    },
    {
      id: 'project-2',
      title: 'Corporate Identity Redesign',
      category: 'branding',
      client: 'TechInnovate GmbH',
      date: '2023',
      description: 'Complete brand identity redesign including logo, color palette, and brand guidelines.',
      fullDescription: 'A comprehensive rebranding project for a leading tech company. The project involved stakeholder interviews, market research, design workshops, and the creation of a complete brand identity system including logo, color palette, typography, and brand guidelines.',
      image: 'assets/images/portfolio/branding-showcase.jpg',
      technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Brand Strategy'],
      gallery: [
        'assets/images/portfolio/branding-1.jpg',
        'assets/images/portfolio/branding-2.jpg',
        'assets/images/portfolio/branding-3.jpg'
      ]
    },
    {
      id: 'project-3',
      title: 'Financial Dashboard App',
      category: 'ui-design',
      client: 'FinTech Solutions',
      date: '2022',
      description: 'User-friendly dashboard for financial analytics with intuitive data visualization.',
      fullDescription: 'An intuitive financial dashboard application designed for both desktop and mobile. The project included user research, wireframing, prototyping, and final UI design. The dashboard features real-time data visualization, customizable widgets, and an intuitive interface that simplifies complex financial data.',
      image: 'assets/images/portfolio/dashboard-showcase.jpg',
      technologies: ['Figma', 'Sketch', 'Adobe XD', 'UI/UX Design'],
      gallery: [
        'assets/images/portfolio/dashboard-1.jpg',
        'assets/images/portfolio/dashboard-2.jpg',
        'assets/images/portfolio/dashboard-3.jpg'
      ]
    },
    {
      id: 'project-4',
      title: 'Product Launch Video',
      category: 'video-production',
      client: 'Innovate Hardware',
      date: '2023',
      description: 'Cinematic product introduction video for a new tech gadget launch.',
      fullDescription: 'A high-quality product launch video created to introduce a revolutionary tech gadget to the market. The video combined live action footage, 3D animation, and motion graphics to showcase the product features and benefits in an engaging and visually stunning way.',
      image: 'assets/images/portfolio/video-showcase.jpg',
      technologies: ['Adobe Premiere Pro', 'After Effects', 'Cinema 4D', 'Sound Design'],
      videoUrl: 'https://vimeo.com/example/product-launch',
      gallery: [
        'assets/images/portfolio/video-1.jpg',
        'assets/images/portfolio/video-2.jpg',
        'assets/images/portfolio/video-3.jpg'
      ]
    },
    {
      id: 'project-5',
      title: 'AI-Powered Chatbot',
      category: 'ai-solutions',
      client: 'Customer Service Solutions',
      date: '2023',
      description: 'Natural language processing chatbot that improves customer service efficiency.',
      fullDescription: 'An advanced AI-powered chatbot developed to enhance customer service efficiency. The solution uses natural language processing to understand and respond to customer inquiries, learn from interactions, and continuously improve its capabilities. The chatbot integrates with existing CRM systems and provides valuable insights into customer needs.',
      image: 'assets/images/portfolio/ai-showcase.jpg',
      technologies: ['Python', 'TensorFlow', 'Natural Language Processing', 'API Integration'],
      features: [
        'Natural language understanding',
        'Sentiment analysis',
        'Multi-language support',
        'CRM integration',
        'Analytics dashboard'
      ],
      gallery: [
        'assets/images/portfolio/ai-1.jpg',
        'assets/images/portfolio/ai-2.jpg',
        'assets/images/portfolio/ai-3.jpg'
      ]
    },
    {
      id: 'project-6',
      title: 'Social Media Campaign',
      category: 'social-media',
      client: 'Organic Products GmbH',
      date: '2022',
      description: 'Integrated social media campaign that doubled brand engagement and sales.',
      fullDescription: 'A comprehensive social media campaign designed to increase brand awareness and drive sales for an organic products company. The campaign included content strategy, creative design, paid advertising, influencer partnerships, and performance analytics. The campaign resulted in a 120% increase in engagement and 85% growth in direct sales from social channels.',
      image: 'assets/images/portfolio/social-showcase.jpg',
      technologies: ['Content Strategy', 'Paid Advertising', 'Analytics', 'Influencer Marketing'],
      gallery: [
        'assets/images/portfolio/social-1.jpg',
        'assets/images/portfolio/social-2.jpg',
        'assets/images/portfolio/social-3.jpg'
      ]
    }
  ];

  categories: PortfolioCategory[] = [
    { id: 'all', name: 'All Projects', icon: 'fas fa-th-large' },
    { id: 'web-development', name: 'Web Development', icon: 'fas fa-code' },
    { id: 'branding', name: 'Branding', icon: 'fas fa-paint-brush' },
    { id: 'ui-design', name: 'UI/UX Design', icon: 'fas fa-pencil-ruler' },
    { id: 'video-production', name: 'Video Production', icon: 'fas fa-film' },
    { id: 'ai-solutions', name: 'AI Solutions', icon: 'fas fa-robot' },
    { id: 'social-media', name: 'Social Media', icon: 'fas fa-hashtag' }
  ];

  filteredItems: PortfolioItem[] = [];
  
  ngOnInit(): void {
    // Rolando para o topo da página ao iniciar o componente
    window.scrollTo(0, 0);
    
    this.filteredItems = [...this.portfolioItems];
    
    // Observar mudanças de idioma
    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Atualizar dados com traduções se necessário
      });
  }

  ngAfterViewInit(): void {
    // Inicializar observadores e listeners após a visualização ser inicializada
    this.initScrollObserver();
    
    // Observar eventos de redimensionamento para ajustar o layout
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200)
      )
      .subscribe(() => {
        this.updateLayout();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Métodos para funcionalidade
  filterProjects(categoryId: string): void {
    this.activeFilter = categoryId;
    
    if (categoryId === 'all') {
      this.filteredItems = [...this.portfolioItems];
    } else {
      this.filteredItems = this.portfolioItems.filter(item => item.category === categoryId);
    }
  }
  
  selectProject(item: PortfolioItem): void {
    this.selectedItem = item;
    this.currentGalleryIndex = 0;
    this.modalOpen = true;
    this.scrollY = window.scrollY;
    document.body.classList.add('modal-open');
  }
  
  closeModal(): void {
    this.modalOpen = false;
    document.body.classList.remove('modal-open');
    window.scrollTo(0, this.scrollY);
    
    // Reset após animação de fechamento
    setTimeout(() => {
      this.selectedItem = null;
      this.currentGalleryIndex = 0;
    }, 300);
  }
  
  nextGalleryImage(): void {
    if (!this.selectedItem?.gallery) return;
    
    this.currentGalleryIndex = (this.currentGalleryIndex + 1) % this.selectedItem.gallery.length;
  }
  
  prevGalleryImage(): void {
    if (!this.selectedItem?.gallery) return;
    
    this.currentGalleryIndex = this.currentGalleryIndex === 0 
      ? this.selectedItem.gallery.length - 1 
      : this.currentGalleryIndex - 1;
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.modalOpen) return;
    
    if (event.key === 'Escape') {
      this.closeModal();
    } else if (event.key === 'ArrowRight') {
      this.nextGalleryImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevGalleryImage();
    }
  }
  
  // Utilitários
  private initScrollObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observar elementos com a classe 'observe-element'
    setTimeout(() => {
      document.querySelectorAll('.observe-element').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }
  
  private updateLayout(): void {
    // Implementar qualquer lógica de layout responsivo se necessário
  }
} 