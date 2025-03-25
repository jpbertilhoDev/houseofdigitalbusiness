import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
} from '@angular/animations';
import { Service } from './service.interface';

// Adicione esta interface para os benefícios
interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({ height: '0', overflow: 'hidden', opacity: 0 })
      ),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
    // Adicione esta nova animação para os benefícios
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
  ],
})
export class ServicesComponent implements OnInit {
  // Service categories
  serviceCategories = [
    { id: 'all', name: 'All Services' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Development' },
    { id: 'design', name: 'Design & UX' },
    { id: 'marketing', name: 'Digital Marketing' },
    { id: 'consulting', name: 'Business Consulting' },
  ];

  // Active category
  activeCategory: string = 'all';

  // Selected service for detailed view
  selectedService: Service | null = null;

  // Services data
  services: Service[] = [
    {
      id: 'web-development',
      title: 'Web Development',
      shortDescription:
        'Custom web applications tailored to your business needs.',
      fullDescription:
        'Our web development team creates custom, high-performance websites and web applications that deliver exceptional user experiences. We use the latest technologies and frameworks to build scalable, secure, and feature-rich solutions that help your business grow.',
      icon: 'fas fa-code',
      image: 'assets/images/services/web-development.jpg',
      features: [
        'Responsive website design and development',
        'Custom web application development',
        'E-commerce solutions',
        'Content management systems',
        'API development and integration',
        'Progressive Web Apps (PWAs)',
        'Web performance optimization',
      ],
      process: [
        {
          step: 1,
          title: 'Discovery & Planning',
          description:
            'We analyze your requirements and develop a detailed project plan.',
        },
        {
          step: 2,
          title: 'Design & Prototyping',
          description:
            'We create wireframes and interactive prototypes for your approval.',
        },
        {
          step: 3,
          title: 'Development',
          description:
            'Our developers build your solution using the latest technologies.',
        },
        {
          step: 4,
          title: 'Testing & Quality Assurance',
          description:
            'We thoroughly test your application to ensure it meets all requirements.',
        },
        {
          step: 5,
          title: 'Deployment & Support',
          description:
            'We launch your application and provide ongoing support and maintenance.',
        },
      ],
      caseStudies: [
        {
          title: 'E-commerce Platform Redesign',
          client: 'Fashion Retailer',
          description:
            'Completely redesigned and rebuilt an e-commerce platform, resulting in improved user experience and increased sales.',
          image: 'assets/images/case-studies/ecommerce.jpg',
          results: [
            '45% increase in conversion rate',
            '60% reduction in page load time',
            '30% increase in average order value',
          ],
        },
      ],
    },
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      shortDescription:
        'Native and cross-platform mobile applications for iOS and Android.',
      fullDescription:
        'We develop high-quality mobile applications that engage users and drive business growth. Our team specializes in both native (iOS/Android) and cross-platform solutions, ensuring your app delivers a seamless user experience across all devices.',
      icon: 'fas fa-mobile-alt',
      image: 'assets/images/services/mobile-development.jpg',
      features: [
        'Native iOS app development',
        'Native Android app development',
        'Cross-platform development (React Native, Flutter)',
        'Mobile app UI/UX design',
        'App Store optimization',
        'Mobile app testing and quality assurance',
        'Ongoing maintenance and support',
      ],
      process: [
        {
          step: 1,
          title: 'Concept & Strategy',
          description:
            'We define your app concept and develop a comprehensive strategy.',
        },
        {
          step: 2,
          title: 'UI/UX Design',
          description:
            'Our designers create intuitive and engaging user interfaces.',
        },
        {
          step: 3,
          title: 'App Development',
          description:
            'We build your app using the most appropriate technologies.',
        },
        {
          step: 4,
          title: 'Testing',
          description:
            'We conduct thorough testing across multiple devices and scenarios.',
        },
        {
          step: 5,
          title: 'Launch & Growth',
          description:
            'We help you launch your app and implement strategies for user acquisition.',
        },
      ],
      caseStudies: [
        {
          title: 'Fitness Tracking App',
          client: 'Health & Wellness Company',
          description:
            'Developed a comprehensive fitness tracking app with social features and personalized workout plans.',
          image: 'assets/images/case-studies/fitness-app.jpg',
          results: [
            'Over 100,000 downloads in the first month',
            '4.8/5 average rating on app stores',
            '75% user retention rate after 3 months',
          ],
        },
      ],
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design',
      shortDescription:
        'User-centered design that combines aesthetics with functionality.',
      fullDescription:
        'Our design team creates beautiful, intuitive user interfaces that enhance user experience and drive engagement. We follow a user-centered design approach, combining aesthetics with functionality to create digital products that users love.',
      icon: 'fas fa-paint-brush',
      image: 'assets/images/services/ui-ux-design.jpg',
      features: [
        'User research and analysis',
        'Information architecture',
        'Wireframing and prototyping',
        'Visual design',
        'Interaction design',
        'Usability testing',
        'Design systems creation',
      ],
      process: [
        {
          step: 1,
          title: 'Research & Discovery',
          description:
            'We conduct user research to understand your target audience and their needs.',
        },
        {
          step: 2,
          title: 'Information Architecture',
          description:
            'We organize content and define user flows for optimal user experience.',
        },
        {
          step: 3,
          title: 'Wireframing & Prototyping',
          description:
            'We create wireframes and interactive prototypes to visualize the user experience.',
        },
        {
          step: 4,
          title: 'Visual Design',
          description:
            'Our designers create beautiful, on-brand visual designs for your digital product.',
        },
        {
          step: 5,
          title: 'Usability Testing',
          description:
            'We test designs with real users to ensure they meet user needs and expectations.',
        },
      ],
      caseStudies: [
        {
          title: 'Banking App Redesign',
          client: 'Financial Services Provider',
          description:
            'Redesigned a banking app to improve user experience and increase feature adoption.',
          image: 'assets/images/case-studies/banking-app.jpg',
          results: [
            '35% increase in daily active users',
            '50% reduction in customer support inquiries',
            '28% increase in feature adoption',
          ],
        },
      ],
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      shortDescription:
        'Strategic digital marketing solutions to grow your online presence.',
      fullDescription:
        'Our digital marketing experts help you reach your target audience, increase brand awareness, and drive conversions. We develop comprehensive strategies tailored to your business goals and implement them across multiple digital channels.',
      icon: 'fas fa-chart-line',
      image: 'assets/images/services/digital-marketing.jpg',
      features: [
        'Search Engine Optimization (SEO)',
        'Pay-Per-Click (PPC) advertising',
        'Social media marketing',
        'Content marketing',
        'Email marketing',
        'Analytics and reporting',
        'Conversion rate optimization',
      ],
      process: [
        {
          step: 1,
          title: 'Strategy Development',
          description:
            'We develop a comprehensive digital marketing strategy aligned with your business goals.',
        },
        {
          step: 2,
          title: 'Channel Selection',
          description:
            'We identify the most effective channels to reach your target audience.',
        },
        {
          step: 3,
          title: 'Content Creation',
          description:
            'Our team creates engaging content that resonates with your audience.',
        },
        {
          step: 4,
          title: 'Campaign Execution',
          description:
            'We implement campaigns across selected channels to maximize reach and engagement.',
        },
        {
          step: 5,
          title: 'Analysis & Optimization',
          description:
            'We continuously analyze campaign performance and optimize for better results.',
        },
      ],
      caseStudies: [
        {
          title: 'Integrated Digital Marketing Campaign',
          client: 'Luxury Retail Brand',
          description:
            'Developed and executed a comprehensive digital marketing strategy across multiple channels.',
          image: 'assets/images/case-studies/marketing-campaign.jpg',
          results: [
            '120% increase in organic traffic',
            '200% increase in social media engagement',
            '75% increase in online sales',
          ],
        },
      ],
    },
    {
      id: 'business-consulting',
      title: 'Business Consulting',
      shortDescription:
        'Strategic guidance to optimize your digital transformation journey.',
      fullDescription:
        'Our business consulting services help you navigate the complexities of digital transformation. We provide strategic guidance on technology adoption, process optimization, and organizational change to help you achieve your business objectives.',
      icon: 'fas fa-briefcase',
      image: 'assets/images/services/business-consulting.jpg',
      features: [
        'Digital transformation strategy',
        'Technology assessment and roadmapping',
        'Process optimization',
        'Data analytics and business intelligence',
        'Innovation workshops',
        'Change management',
        'Digital maturity assessment',
      ],
      process: [
        {
          step: 1,
          title: 'Assessment',
          description:
            'We assess your current digital maturity and identify opportunities for improvement.',
        },
        {
          step: 2,
          title: 'Strategy Development',
          description:
            'We develop a tailored digital transformation strategy aligned with your business goals.',
        },
        {
          step: 3,
          title: 'Roadmap Creation',
          description:
            'We create a detailed roadmap for implementing your digital transformation strategy.',
        },
        {
          step: 4,
          title: 'Implementation Support',
          description:
            'We provide guidance and support throughout the implementation process.',
        },
        {
          step: 5,
          title: 'Measurement & Refinement',
          description:
            'We help you measure results and refine your strategy for continuous improvement.',
        },
      ],
      caseStudies: [
        {
          title: 'Digital Transformation Strategy',
          client: 'Manufacturing Company',
          description:
            'Developed and implemented a comprehensive digital transformation strategy to modernize operations.',
          image: 'assets/images/case-studies/digital-transformation.jpg',
          results: [
            '30% increase in operational efficiency',
            '25% reduction in costs',
            '40% improvement in customer satisfaction',
          ],
        },
      ],
    },
  ];

  // Filtered services based on active category
  filteredServices: Service[] = [];

  // Adicione os dados para a seção "Why Choose Us"
  benefits: Benefit[] = [
    {
      id: 'expert-team',
      icon: 'fas fa-user-tie',
      title: 'Expert Team',
      description: 'Our team consists of experienced professionals with deep expertise in their respective fields, ensuring high-quality solutions for your business.'
    },
    {
      id: 'tailored-solutions',
      icon: 'fas fa-cogs',
      title: 'Tailored Solutions',
      description: 'We develop custom solutions tailored to your specific business needs and objectives, ensuring optimal results and ROI.'
    },
    {
      id: 'innovation-focus',
      icon: 'fas fa-rocket',
      title: 'Innovation Focus',
      description: 'We stay at the forefront of technology trends to deliver innovative solutions that give your business a competitive edge.'
    },
    {
      id: 'results-driven',
      icon: 'fas fa-chart-line',
      title: 'Results-Driven',
      description: 'We focus on delivering measurable results that drive business growth, with clear metrics and performance indicators.'
    },
    {
      id: 'quality-assurance',
      icon: 'fas fa-shield-alt',
      title: 'Quality Assurance',
      description: 'Our rigorous quality assurance process ensures that all solutions meet the highest standards of performance and reliability.'
    },
    {
      id: 'client-centric',
      icon: 'fas fa-handshake',
      title: 'Client-Centric Approach',
      description: 'We prioritize your needs and maintain transparent communication throughout the project lifecycle for optimal collaboration.'
    }
  ];

  // Estatísticas para mostrar conquistas
  statistics = [
    { value: '95%', label: 'Client Satisfaction' },
    { value: '200+', label: 'Projects Completed' },
    { value: '15+', label: 'Years Experience' },
    { value: '50+', label: 'Expert Team Members' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.filterServices(this.activeCategory);
  }

  // Filter services by category
  filterServices(categoryId: string): void {
    this.activeCategory = categoryId;

    if (categoryId === 'all') {
      this.filteredServices = this.services;
    } else {
      // Map category IDs to service IDs (in a real app, you'd have proper category mapping)
      const categoryMap: { [key: string]: string[] } = {
        web: ['web-development'],
        mobile: ['mobile-app-development'],
        design: ['ui-ux-design'],
        marketing: ['digital-marketing'],
        consulting: ['business-consulting'],
      };

      const serviceIds = categoryMap[categoryId] || [];
      this.filteredServices = this.services.filter((service) =>
        serviceIds.includes(service.id)
      );
    }

    // Reset selected service when changing categories
    this.selectedService = null;
  }

  // Select a service to view details
  selectService(service: Service): void {
    this.selectedService = service;

    // Scroll to service details section
    setTimeout(() => {
      const element = document.getElementById('service-details');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // Clear selected service
  clearSelectedService(): void {
    this.selectedService = null;
  }

  // Check if a service belongs to a category
  isInCategory(service: Service, categoryId: string): boolean {
    if (categoryId === 'all') return true;

    // Map service IDs to categories (in a real app, you'd have proper category mapping)
    const serviceCategories: { [key: string]: string[] } = {
      'web-development': ['web'],
      'mobile-app-development': ['mobile'],
      'ui-ux-design': ['design'],
      'digital-marketing': ['marketing'],
      'business-consulting': ['consulting'],
    };

    return serviceCategories[service.id]?.includes(categoryId) || false;
  }
}
