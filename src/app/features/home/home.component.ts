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
import { Subscription } from 'rxjs';

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

  currentTestimonial = 0;
  testimonialInterval: any;
  private langChangeSubscription!: Subscription;

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadPortfolio();
    this.loadFeaturedProjects();
    this.loadTestimonials();
    this.startTestimonialRotation();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      () => {
        this.loadServices();
        this.loadPortfolio();
        this.loadFeaturedProjects();
        this.loadTestimonials();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
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
}
