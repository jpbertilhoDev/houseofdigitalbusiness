import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AboutComponent implements OnInit, OnDestroy {
  companyValues: CompanyValue[] = [];
  teamMembers: TeamMember[] = [];
  milestones: Milestone[] = [];
  companyStats: { value: string; label: string }[] = [];
  private langChangeSubscription!: Subscription;

  constructor(public translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadAllData();
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      () => {
        this.loadAllData();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private loadAllData(): void {
    this.loadCompanyValues();
    this.loadCompanyStats();
    this.loadMilestones();
    this.loadTeamMembers();
  }

  private loadCompanyValues(): void {
    const valuesTranslation = this.translocoService.translate('aboutPage.companyValues');
    if (Array.isArray(valuesTranslation)) {
      this.companyValues = valuesTranslation;
    }
  }

  private loadCompanyStats(): void {
    const translation = this.translocoService.translate('aboutPage.companyStats');
    if (Array.isArray(translation)) {
      this.companyStats = translation;
    }
  }

  private loadMilestones(): void {
    const milestonesTranslation = this.translocoService.translate('aboutPage.milestones');
    if (Array.isArray(milestonesTranslation)) {
      this.milestones = milestonesTranslation;
    }
  }

  private loadTeamMembers(): void {
    const membersTranslation = this.translocoService.translate('aboutPage.teamMembers');
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
    const paragraphs = this.translocoService.translate('aboutPage.ourStory.paragraphs');
    return Array.isArray(paragraphs) ? paragraphs : [];
  }

  getSignatureName(): string {
    return this.translocoService.translate('aboutPage.ourStory.signature.name');
  }

  getSignaturePosition(): string {
    return this.translocoService.translate('aboutPage.ourStory.signature.position');
  }
}
