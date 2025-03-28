import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
} from '@angular/animations';
import { ContactForm, Office } from './contact.interface';
import { SafeResourceUrlPipe } from '../../shared/pipes/safe-resource-url.pipe';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
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
export class ContactComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  formSubmitted = false;
  formSuccess = false;
  formError = false;

  // Services list for dropdown
  services: { id: string; name: string }[] = [];

  // How did you hear about us options
  referralSources: string[] = [];

  // Office locations
  offices: Office[] = [];

  // Selected office for mobile view
  selectedOffice!: Office;

  // FAQ questions
  faqs: { question: string; answer: string }[] = [];

  // Toggle state for FAQs
  faqToggleState: boolean[] = [];

  // Subscription para mudanças de idioma
  private langChangeSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadServices();
    this.loadOffices();
    this.loadFaqs();

    // Assinar mudanças de idioma
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(
      () => {
        this.loadServices();
        this.loadOffices();
        this.loadFaqs();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  // Initialize the contact form
  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
      serviceInterest: [''],
      howDidYouHear: [''],
      agreeToTerms: [false, Validators.requiredTrue],
    });
  }

  // Submit the contact form
  onSubmit(): void {
    this.formSubmitted = true;

    if (this.contactForm.valid) {
      // In a real application, you would send the form data to a backend service
      console.log('Form submitted:', this.contactForm.value);

      // Simulate API call
      setTimeout(() => {
        this.formSuccess = true;
        this.formError = false;
        this.contactForm.reset();
        this.formSubmitted = false;
      }, 1500);
    } else {
      this.formError = true;
      this.markFormGroupTouched(this.contactForm);
    }
  }

  // Helper method to check if a form control is invalid and touched
  isInvalidAndTouched(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  // Helper method to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Select office (for mobile view)
  selectOffice(office: Office): void {
    this.selectedOffice = office;
  }

  // Toggle FAQ
  toggleFaq(index: number): void {
    // Fechar todos os outros FAQs quando um é aberto (comportamento de acordeão)
    if (!this.faqToggleState[index]) {
      this.faqToggleState = this.faqToggleState.map(() => false);
    }

    // Toggle o estado do FAQ clicado
    this.faqToggleState[index] = !this.faqToggleState[index];

    // Garantir que o elemento esteja visível na tela após expandir
    if (this.faqToggleState[index]) {
      setTimeout(() => {
        const faqElements = document.querySelectorAll('.faq-item');
        if (faqElements && faqElements.length > index) {
          faqElements[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, 300);
    }
  }

  // Carregar serviços do arquivo de tradução
  private loadServices(): void {
    this.services = [
      {
        id: 'web-development',
        name: this.translocoService.translate('servicesPage.services.0.title'),
      },
      {
        id: 'mobile-app-development',
        name: this.translocoService.translate('servicesPage.services.1.title'),
      },
      {
        id: 'ui-ux-design',
        name: this.translocoService.translate('servicesPage.services.2.title'),
      },
      {
        id: 'digital-marketing',
        name: this.translocoService.translate('servicesPage.services.3.title'),
      },
      {
        id: 'business-consulting',
        name: this.translocoService.translate('servicesPage.services.4.title'),
      },
      {
        id: 'other',
        name: this.translocoService.translate('servicesPage.filter.all'),
      },
    ];

    this.referralSources = [
      this.translocoService.translate('contact.form.referral_sources.google'),
      this.translocoService.translate('contact.form.referral_sources.social'),
      this.translocoService.translate('contact.form.referral_sources.referral'),
      this.translocoService.translate('contact.form.referral_sources.ads'),
      this.translocoService.translate('contact.form.referral_sources.event'),
      this.translocoService.translate('contact.form.referral_sources.other'),
    ];
  }

  // Carregar escritórios do arquivo de tradução
  private loadOffices(): void {
    this.offices = [
      {
        city: 'Berlin',
        country: 'Germany',
        address: this.translocoService.translate('contact.info.location.value'),
        phone: '+49 30 1234 5678',
        email: 'berlin@houseofdigitalbusiness.com',
        mapUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.654394609506!2d13.411046715667417!3d52.52068004355785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851d00f714303%3A0xb7b0148f3cd5c61a!2sAlexanderplatz%2C%20Berlin%2C%20Germany!5e0!3m2!1sen!2sus!4v1625584267004!5m2!1sen!2sus',
        hours: this.translocoService.translate('contact.info.phone.hours'),
      },
      {
        city: 'Munich',
        country: 'Germany',
        address: 'Maximilianstraße 25, 80539 Munich, Germany',
        phone: '+49 89 9876 5432',
        email: 'munich@houseofdigitalbusiness.com',
        mapUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.8408146557856!2d11.57752231555205!3d48.13883027922384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e758b1e3e5199%3A0x9a9550c9bea3c4d6!2sMaximilianstra%C3%9Fe%2C%20Munich%2C%20Germany!5e0!3m2!1sen!2sus!4v1625584349481!5m2!1sen!2sus',
        hours: this.translocoService.translate('contact.info.phone.hours'),
      },
    ];

    this.selectedOffice = this.offices[0];
  }

  // Carregar FAQs do arquivo de tradução
  private loadFaqs(): void {
    try {
      // Obter as questões e respostas do FAQ
      const questions = this.translocoService.translate(
        'contact.faq.questions'
      );
      const answers = this.translocoService.translate('contact.faq.answers');

      // Verificar se os dados foram carregados corretamente como arrays
      if (
        questions &&
        answers &&
        Array.isArray(questions) &&
        Array.isArray(answers) &&
        questions.length === answers.length
      ) {
        this.faqs = questions.map((question, index) => ({
          question: question,
          answer: answers[index],
        }));
      } else {
        // Fallback para o método individual
        this.loadFaqsIndividually();
      }
    } catch (error) {
      console.error('Erro ao carregar FAQs:', error);
      this.loadFaqsIndividually();
    }

    // Reset toggle state
    this.faqToggleState = new Array(this.faqs.length).fill(false);
  }

  // Método alternativo para carregar FAQs usando chaves individuais
  private loadFaqsIndividually(): void {
    // Total de FAQs conforme visto nos arquivos JSON
    const totalFaqs = 5;

    this.faqs = [];
    for (let i = 0; i < totalFaqs; i++) {
      const questionKey = `contact.faq.questions.${i}`;
      const answerKey = `contact.faq.answers.${i}`;

      const question = this.translocoService.translate(questionKey);
      const answer = this.translocoService.translate(answerKey);

      // Verificar se as traduções são válidas
      if (
        question &&
        answer &&
        typeof question === 'string' &&
        typeof answer === 'string'
      ) {
        // Verificar se as chaves não estão sendo retornadas como estão (o que acontece quando não há tradução)
        if (!question.includes(questionKey) && !answer.includes(answerKey)) {
          this.faqs.push({
            question: question,
            answer: answer,
          });
        }
      }
    }

    // Se nenhum FAQ foi carregado, adicionar mensagem de erro
    if (this.faqs.length === 0) {
      console.error(
        'Não foi possível carregar os FAQs a partir dos arquivos de tradução'
      );
    }
  }
}
