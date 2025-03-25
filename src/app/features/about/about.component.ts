import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('800ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('800ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(50px)', opacity: 0 }),
        animate('800ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('staggerList', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {
  // Company values
  companyValues = [
    {
      title: 'Innovation',
      description: 'We constantly seek new and creative solutions to meet our clients\' evolving needs.',
      icon: 'fas fa-lightbulb'
    },
    {
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from design to development to client service.',
      icon: 'fas fa-award'
    },
    {
      title: 'Integrity',
      description: 'We build relationships based on trust, transparency, and ethical business practices.',
      icon: 'fas fa-shield-alt'
    },
    {
      title: 'Collaboration',
      description: 'We work closely with our clients and each other to achieve exceptional results.',
      icon: 'fas fa-hands-helping'
    }
  ];

  // Team members
  teamMembers: TeamMember[] = [
    {
      name: 'Alexander Schmidt',
      position: 'CEO & Founder',
      bio: 'With over 15 years of experience in digital transformation, Alexander leads our company with vision and expertise.',
      image: 'assets/images/team/team1.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        email: 'alexander@housedigitalofbusiness.com'
      }
    },
    {
      name: 'Julia Weber',
      position: 'Creative Director',
      bio: 'Julia brings creativity and strategic thinking to every project, ensuring our designs are both beautiful and effective.',
      image: 'assets/images/team/team2.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        email: 'julia@housedigitalofbusiness.com'
      }
    },
    {
      name: 'Markus Müller',
      position: 'Technical Lead',
      bio: 'Markus oversees all technical aspects of our projects, bringing innovative solutions to complex challenges.',
      image: 'assets/images/team/team3.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        email: 'markus@housedigitalofbusiness.com'
      }
    },
    
  ];

  // Company milestones
  milestones: Milestone[] = [
    {
      year: '2015',
      title: 'Company Founded',
      description: 'House Digital of Business was established in Berlin with a vision to transform digital experiences.',
      icon: 'fas fa-flag'
    },
    {
      year: '2017',
      title: 'Expanded Services',
      description: 'Added digital marketing and UX/UI design to our core service offerings.',
      icon: 'fas fa-expand-alt'
    },
    {
      year: '2019',
      title: 'International Expansion',
      description: 'Opened our first international office and began serving clients across Europe.',
      icon: 'fas fa-globe-europe'
    },
    {
      year: '2021',
      title: 'Digital Innovation Award',
      description: 'Received recognition for our innovative approaches to digital business solutions.',
      icon: 'fas fa-trophy'
    },
    {
      year: '2023',
      title: 'Strategic Partnerships',
      description: 'Formed strategic partnerships with leading technology providers to enhance our offerings.',
      icon: 'fas fa-handshake'
    }
  ];

  // Stats
  companyStats = [
    { value: '100+', label: 'Clients Worldwide' },
    { value: '250+', label: 'Projects Completed' },
    { value: '15+', label: 'Industry Awards' },
    { value: '25+', label: 'Expert Team Members' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
