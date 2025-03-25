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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  // Services data
  services = [
    {
      icon: 'fas fa-code',
      title: 'Web Development',
      description:
        'Custom web applications built with cutting-edge technologies to meet your business requirements.',
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Applications',
      description:
        'Native and cross-platform mobile apps that deliver exceptional user experiences.',
    },
    {
      icon: 'fas fa-paint-brush',
      title: 'UI/UX Design',
      description:
        'User-centered design that combines aesthetics with functionality for optimal user engagement.',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Digital Marketing',
      description:
        'Strategic digital marketing solutions to grow your online presence and drive conversions.',
    },
  ];

  // Featured projects data
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

  // Testimonials data
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

  constructor() {}

  ngOnInit(): void {
    this.startTestimonialRotation();
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  startTestimonialRotation(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  setTestimonial(index: number): void {
    this.currentTestimonial = index;
    // Reset interval when manually changing testimonial
    clearInterval(this.testimonialInterval);
    this.startTestimonialRotation();
  }

  prevTestimonial(): void {
    this.currentTestimonial =
      this.currentTestimonial === 0
        ? this.testimonials.length - 1
        : this.currentTestimonial - 1;
    // Reset interval when manually changing testimonial
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
