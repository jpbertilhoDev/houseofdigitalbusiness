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
  // portfolio: { title: string; description: string }[] = [];

  featuredProjects = [
    {
      title: 'E-commerce Platform',
      category: 'Web Development',
      image: 'assets/images/projects/project1.jpg',
    },
    {
      title: 'Financial Dashboard',
      category: 'UI/UX Design',
      image: 'assets/images/projects/project2.jpg',
    },
    {
      title: 'Travel Mobile App',
      category: 'Mobile Development',
      image: 'assets/images/projects/project3.jpg',
    },
  ];
  testimonials = [
    {
      text: 'House Digital of Business transformed our online presence completely. Their team delivered a solution that exceeded our expectations and helped us grow our business significantly.',
      name: 'Michael Schmidt',
      position: 'CEO',
      company: 'TechInnovate GmbH',
      image: 'assets/images/testimonials/testimonial1.jpg',
    },
    {
      text: 'Working with this team was a pleasure. They understood our needs perfectly and delivered a website that perfectly represents our brand. Highly recommended!',
      name: 'Anna Müller',
      position: 'Marketing Director',
      company: 'Lifestyle Brands',
      image: 'assets/images/testimonials/testimonial2.jpg',
    },
    {
      text: 'The e-commerce solution developed by House Digital of Business increased our online sales by 200%. Their expertise and professionalism are outstanding.',
      name: 'Thomas Weber',
      position: 'Founder',
      company: 'EcoProducts',
      image: 'assets/images/testimonials/testimonial3.jpg',
    },
  ];
  currentTestimonial = 0;
  testimonialInterval: any;
  private langChangeSubscription!: Subscription;


  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadServices();
    this.startTestimonialRotation();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      () => {
        this.loadServices();
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

  // private loadPortfolio(): void {
  //   // this.portfolio = this.translocoService.translate('portfolio.card')
  // }

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
