import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  state,
} from '@angular/animations';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-out', style({ opacity: 1 })),
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
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '600ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate(
          '800ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(50px)', opacity: 0 }),
        animate(
          '800ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
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
                '800ms cubic-bezier(0.35, 0, 0.25, 1)',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('parallax', [
      state('scrolled', style({ transform: 'translateY({{offset}}px)' }), {
        params: { offset: 0 },
      }),
    ]),
  ],
})
export class AboutComponent implements OnInit, OnDestroy {
  // Dados da página
  companyValues: CompanyValue[] = [];
  teamMembers: TeamMember[] = [];
  milestones: Milestone[] = [];
  companyStats: { value: string; label: string }[] = [];

  // Flags para animações de scroll
  isHeroVisible: boolean = true;
  isStoryVisible: boolean = false;
  isValuesVisible: boolean = false;
  isStatsVisible: boolean = false;
  isTimelineVisible: boolean = false;
  isTeamVisible: boolean = false;
  isCTAVisible: boolean = false;

  // Variáveis para efeito parallax
  parallaxOffset: number = 0;
  scrollY: number = 0;

  private langChangeSubscription!: Subscription;

  constructor(public translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadAllData();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      () => {
        this.loadAllData();
      }
    );

    // Inicializar observadores de interseção para animações baseadas em scroll
    this.initScrollObservers();
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.scrollY = window.scrollY;
    this.parallaxOffset = this.scrollY * 0.4; // Ajuste este valor para controlar a velocidade do efeito parallax
  }

  /**
   * Inicializa os observadores de interseção para acionar animações quando os elementos entram em view
   */
  private initScrollObservers(): void {
    // Usando IntersectionObserver para acionar animações baseadas em visibilidade
    const sections = [
      {
        id: 'our-story',
        setter: (visible: boolean) => (this.isStoryVisible = visible),
      },
      {
        id: 'values',
        setter: (visible: boolean) => (this.isValuesVisible = visible),
      },
      {
        id: 'stats',
        setter: (visible: boolean) => (this.isStatsVisible = visible),
      },
      {
        id: 'timeline',
        setter: (visible: boolean) => (this.isTimelineVisible = visible),
      },
      {
        id: 'team',
        setter: (visible: boolean) => (this.isTeamVisible = visible),
      },
      {
        id: 'cta-section',
        setter: (visible: boolean) => (this.isCTAVisible = visible),
      },
    ];

    // Criando um observador para cada seção
    setTimeout(() => {
      sections.forEach((section) => {
        const element = document.querySelector(`.${section.id}`);
        if (element) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                section.setter(true);
                observer.unobserve(entry.target); // Parar de observar após acionar
              }
            },
            { threshold: 0.15 } // Acionar quando pelo menos 15% da seção estiver visível
          );

          observer.observe(element);
        }
      });
    }, 1000); // Pequeno delay para garantir que o DOM esteja pronto
  }

  /**
   * Carrega todos os dados necessários para a página
   */
  private loadAllData(): void {
    this.loadCompanyValues();
    this.loadCompanyStats();
    this.loadMilestones();
    this.loadTeamMembers();
  }

  private loadCompanyValues(): void {
    try {
      this.companyValues =
        this.translocoService.translate('aboutPage.companyValues') || [];
    } catch (error) {
      console.error('Error loading company values:', error);
      this.companyValues = [];
    }
  }

  private loadCompanyStats(): void {
    const translation = this.translocoService.translate(
      'aboutPage.companyStats'
    );
    if (Array.isArray(translation)) {
      this.companyStats = translation;
    }
  }

  private loadMilestones(): void {
    const milestonesTranslation = this.translocoService.translate(
      'aboutPage.milestones'
    );
    if (Array.isArray(milestonesTranslation)) {
      this.milestones = milestonesTranslation;
    }
  }

  private loadTeamMembers(): void {
    const membersTranslation = this.translocoService.translate(
      'aboutPage.teamMembers'
    );
    if (Array.isArray(membersTranslation)) {
      this.teamMembers = membersTranslation;
    }
  }

  // Métodos auxiliares para acessar traduções de forma segura
  getHeroTitle(): string {
    return this.translocoService.translate('aboutPage.hero.title');
  }

  getHeroSubtitle(): string {
    return this.translocoService.translate('aboutPage.hero.subtitle');
  }

  getStoryParagraphs(): string[] {
    const paragraphs = this.translocoService.translate(
      'aboutPage.ourStory.paragraphs'
    );
    return Array.isArray(paragraphs) ? paragraphs : [];
  }

  getSignatureName(): string {
    return this.translocoService.translate('aboutPage.ourStory.signature.name');
  }

  getSignaturePosition(): string {
    return this.translocoService.translate(
      'aboutPage.ourStory.signature.position'
    );
  }

  /**
   * Calcula o valor do offset para efeito parallax
   * @param factor Fator de multiplicação para ajustar a velocidade
   * @returns valor de offset calculado para aplicar ao transform
   */
  getParallaxOffset(factor: number): number {
    return this.scrollY * factor;
  }
}
