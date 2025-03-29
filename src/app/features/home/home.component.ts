import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
    trigger('staggerCards', [
      transition(':enter', [
        query(
          '.card-item',
          [
            style({ opacity: 0, transform: 'translateY(50px)' }),
            stagger(100, [
              animate(
                '800ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('wordAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('400ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  services: { icon: string; title: string; description: string }[] = [];
  portfolio!: { title: string; subtitle: string; view_all: string };
  featuredProjects: { title: string; description: string }[] = [];
  testimonialsSection: { title: string; subtitle: string } = {
    title: '',
    subtitle: '',
  };
  testimonials: {
    text: string;
    name: string;
    position: string;
    company: string;
  }[] = [];

  // Dados da seção About da página inicial
  aboutPrinciples: { icon: string; title: string; description: string }[] = [];

  // Palavras completas para animação no herói
  servicePhrases: string[] = [];

  // Frases padrão em PT, serão substituídas pelas traduzidas
  defaultServicePhrases: { [key: string]: string[] } = {
    pt: [
      'Web Design',
      'Desenvolvimento Full Stack',
      'UX/UI Design',
      'Lojas Virtuais',
      'Aplicativos Web',
      'SEO & Marketing Digital',
    ],
    en: [
      'Web Design',
      'Full Stack Development',
      'UX/UI Design',
      'E-commerce Stores',
      'Web Applications',
      'SEO & Digital Marketing',
    ],
    de: [
      'Webdesign',
      'Full-Stack-Entwicklung',
      'UX/UI-Design',
      'E-Commerce-Shops',
      'Webanwendungen',
      'SEO & Digitalmarketing',
    ],
  };

  // Configurações para animação de digitação
  currentPhraseIndex = 0;
  displayedText = '';
  isDeleting = false;
  typingSpeed = 80; // velocidade em ms para digitar/apagar
  pauseTime = 900; // tempo de pausa após completar a palavra
  typingInterval: any;

  currentTestimonial = 0;
  testimonialInterval: any;
  private langChangeSubscription!: Subscription;

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadServicePhrases();
    this.loadServices();
    this.loadPortfolio();
    this.loadFeaturedProjects();
    this.loadTestimonials();
    this.loadAboutPrinciples();
    this.startTestimonialRotation();
    this.startTypingAnimation();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      (lang) => {
        this.loadServicePhrases();
        this.loadServices();
        this.loadPortfolio();
        this.loadFeaturedProjects();
        this.loadTestimonials();
        this.loadAboutPrinciples();
        // Reinicia a animação de digitação quando o idioma muda
        this.currentPhraseIndex = 0;
        this.displayedText = '';
        this.isDeleting = false;
        if (this.typingInterval) {
          clearTimeout(this.typingInterval);
        }
        this.startTypingAnimation();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  startTypingAnimation(): void {
    // Inicia o efeito de digitação
    this.typeNextChar();
  }

  typeNextChar(): void {
    const currentWord = this.servicePhrases[this.currentPhraseIndex];

    // Limpa qualquer intervalo existente
    if (this.typingInterval) {
      clearTimeout(this.typingInterval);
    }

    // Se estamos deletando o texto
    if (this.isDeleting) {
      // Remove o último caractere
      this.displayedText = currentWord.substring(
        0,
        this.displayedText.length - 1
      );

      // Quando terminar de apagar toda a palavra
      if (this.displayedText.length === 0) {
        this.isDeleting = false;
        // Avança para a próxima palavra
        this.currentPhraseIndex =
          (this.currentPhraseIndex + 1) % this.servicePhrases.length;
        // Pequena pausa antes de começar a próxima palavra
        this.typingInterval = setTimeout(
          () => this.typeNextChar(),
          this.pauseTime / 2
        );
        return;
      }
    } else {
      // Adiciona o próximo caractere
      this.displayedText = currentWord.substring(
        0,
        this.displayedText.length + 1
      );

      // Quando completar a palavra
      if (this.displayedText === currentWord) {
        // Pausa antes de começar a apagar
        this.typingInterval = setTimeout(() => {
          this.isDeleting = true;
          this.typeNextChar();
        }, this.pauseTime);
        return;
      }
    }

    // Velocidade de digitação/deleção
    // Digita um pouco mais rápido do que apaga para efeito natural
    const charSpeed = this.isDeleting
      ? this.typingSpeed * 0.7
      : this.typingSpeed;

    // Continua o processo de digitação/deleção
    this.typingInterval = setTimeout(() => this.typeNextChar(), charSpeed);
  }

  private loadServices(): void {
    this.services = this.translocoService.translate('services.cards');
  }

  private loadPortfolio(): void {
    this.portfolio = {
      title: this.translocoService.translate('portfolio.title'),
      subtitle: this.translocoService.translate('portfolio.subtitle'),
      view_all: this.translocoService.translate('portfolio.view_all'),
    };
  }

  private loadFeaturedProjects(): void {
    this.featuredProjects = this.translocoService.translate('portfolio.cards');
  }

  private loadTestimonials(): void {
    this.testimonialsSection = {
      title: this.translocoService.translate('testimonials.title'),
      subtitle: this.translocoService.translate('testimonials.subtitle'),
    };
    this.testimonials = this.translocoService.translate('testimonials.items');
  }

  startTestimonialRotation(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  setTestimonial(index: number): void {
    this.currentTestimonial = index;
    clearInterval(this.testimonialInterval);
    this.startTestimonialRotation();
  }

  prevTestimonial(): void {
    this.currentTestimonial =
      this.currentTestimonial === 0
        ? this.testimonials.length - 1
        : this.currentTestimonial - 1;
    clearInterval(this.testimonialInterval);
    this.startTestimonialRotation();
  }

  nextTestimonial(): void {
    this.currentTestimonial =
      this.currentTestimonial === this.testimonials.length - 1
        ? 0
        : this.currentTestimonial + 1;
  }

  // Carrega as frases de animação do idioma atual
  private loadServicePhrases(): void {
    const currentLang = this.translocoService.getActiveLang();
    // Usa as frases padrão do idioma atual
    this.servicePhrases =
      this.defaultServicePhrases[currentLang] ||
      this.defaultServicePhrases['en'];
  }

  private loadAboutPrinciples(): void {
    try {
      const translatedPrinciples = [
        {
          icon: 'fas fa-users',
          title: this.translocoService.translate(
            'homePage.about.principles.team.title'
          ),
          description: this.translocoService.translate(
            'homePage.about.principles.team.description'
          ),
        },
        {
          icon: 'fas fa-lightbulb',
          title: this.translocoService.translate(
            'homePage.about.principles.solutions.title'
          ),
          description: this.translocoService.translate(
            'homePage.about.principles.solutions.description'
          ),
        },
        {
          icon: 'fas fa-rocket',
          title: this.translocoService.translate(
            'homePage.about.principles.innovation.title'
          ),
          description: this.translocoService.translate(
            'homePage.about.principles.innovation.description'
          ),
        },
        {
          icon: 'fas fa-handshake',
          title: this.translocoService.translate(
            'homePage.about.principles.client.title'
          ),
          description: this.translocoService.translate(
            'homePage.about.principles.client.description'
          ),
        },
      ];

      // Verifica se os dados foram carregados corretamente
      const isDataComplete = translatedPrinciples.every(
        (principle) =>
          principle.title &&
          !principle.title.includes('homePage.about.principles')
      );

      if (isDataComplete) {
        this.aboutPrinciples = translatedPrinciples;
      } else {
        // Fallback para valores padrão se as traduções falharem
        this.aboutPrinciples = [
          {
            icon: 'fas fa-users',
            title: 'Equipe Especializada',
            description:
              'Desenvolvedores e designers experientes que transformam ideias em realidade digital.',
          },
          {
            icon: 'fas fa-lightbulb',
            title: 'Soluções Personalizadas',
            description:
              'Criamos soluções sob medida para atender às necessidades específicas do seu negócio.',
          },
          {
            icon: 'fas fa-rocket',
            title: 'Foco em Inovação',
            description:
              'Adotamos as mais recentes tecnologias para entregar produtos de alta qualidade.',
          },
          {
            icon: 'fas fa-handshake',
            title: 'Centrados no Cliente',
            description:
              'Desenvolvemos parcerias estratégicas para garantir resultados excepcionais.',
          },
        ];
      }
    } catch (error) {
      console.error('Erro ao carregar princípios:', error);
      // Fallback para valores padrão
      this.aboutPrinciples = [
        {
          icon: 'fas fa-users',
          title: 'Equipe Especializada',
          description:
            'Desenvolvedores e designers experientes que transformam ideias em realidade digital.',
        },
        {
          icon: 'fas fa-lightbulb',
          title: 'Soluções Personalizadas',
          description:
            'Criamos soluções sob medida para atender às necessidades específicas do seu negócio.',
        },
        {
          icon: 'fas fa-rocket',
          title: 'Foco em Inovação',
          description:
            'Adotamos as mais recentes tecnologias para entregar produtos de alta qualidade.',
        },
        {
          icon: 'fas fa-handshake',
          title: 'Centrados no Cliente',
          description:
            'Desenvolvemos parcerias estratégicas para garantir resultados excepcionais.',
        },
      ];
    }
  }
}
