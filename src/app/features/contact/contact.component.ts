import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
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
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  formSubmitted = false;
  formSuccess = false;
  formError = false;

  // Services list for dropdown
  services = [
    { id: 'web-development', name: 'Web Development' },
    { id: 'mobile-app-development', name: 'Mobile App Development' },
    { id: 'ui-ux-design', name: 'UI/UX Design' },
    { id: 'digital-marketing', name: 'Digital Marketing' },
    { id: 'business-consulting', name: 'Business Consulting' },
    { id: 'other', name: 'Other' },
  ];

  // How did you hear about us options
  referralSources = [
    'Google Search',
    'Social Media',
    'Referral',
    'Online Advertisement',
    'Conference/Event',
    'Other',
  ];

  // Office locations
  offices: Office[] = [
    {
      city: 'Berlin',
      country: 'Germany',
      address: 'Alexanderplatz 5, 10178 Berlin, Germany',
      phone: '+49 30 1234 5678',
      email: 'berlin@housedigitalofbusiness.com',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.654394609506!2d13.411046715667417!3d52.52068004355785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851d00f714303%3A0xb7b0148f3cd5c61a!2sAlexanderplatz%2C%20Berlin%2C%20Germany!5e0!3m2!1sen!2sus!4v1625584267004!5m2!1sen!2sus',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    },
    {
      city: 'Munich',
      country: 'Germany',
      address: 'Maximilianstraße 25, 80539 Munich, Germany',
      phone: '+49 89 9876 5432',
      email: 'munich@housedigitalofbusiness.com',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.8408146557856!2d11.57752231555205!3d48.13883027922384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e758b1e3e5199%3A0x9a9550c9bea3c4d6!2sMaximilianstra%C3%9Fe%2C%20Munich%2C%20Germany!5e0!3m2!1sen!2sus!4v1625584349481!5m2!1sen!2sus',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    },
  ];

  // Selected office for mobile view
  selectedOffice: Office = this.offices[0];

  // FAQ questions
  faqs = [
    {
      question: 'How soon can you start working on my project?',
      answer:
        'Our typical onboarding process takes 1-2 weeks, depending on the complexity of your project and our current workload. Well provide a specific timeline during our initial consultation.',
    },
    {
      question: 'What information do you need to provide a quote?',
      answer:
        'To provide an accurate quote, we need to understand your project requirements, timeline, and objectives. The more details you can provide, the more precise our estimate will be. We typically schedule a discovery call to gather this information.',
    },
    {
      question: 'Do you offer ongoing support after project completion?',
      answer:
        'Yes, we offer various maintenance and support packages to ensure your digital solutions continue to perform optimally. We can tailor a support plan based on your specific needs.',
    },
    {
      question: 'How do you handle project communication?',
      answer:
        'We use a combination of regular video calls, email updates, and project management tools to ensure transparent and effective communication throughout the project lifecycle. You ll have a dedicated project manager as your main point of contact.',
    },
    {
      question: 'What is your payment structure?',
      answer:
        'Our payment structure typically includes an initial deposit, followed by milestone-based payments throughout the project. The specific payment schedule will be outlined in our proposal and contract.',
    },
  ];

  // Toggle state for FAQs
  faqToggleState: boolean[] = this.faqs.map(() => false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
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

        // Reset success message after 5 seconds
        setTimeout(() => {
          this.formSuccess = false;
        }, 5000);
      }, 1500);
    } else {
      this.formError = true;
      this.markFormGroupTouched(this.contactForm);
    }
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Check if form control is invalid and touched
  isInvalidAndTouched(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return (
      !!control && control.invalid && (control.touched || this.formSubmitted)
    );
  }

  // Toggle FAQ
  toggleFaq(index: number): void {
    this.faqToggleState[index] = !this.faqToggleState[index];
  }

  // Select office for mobile view
  selectOffice(office: Office): void {
    this.selectedOffice = office;
  }

  // Check if office is selected (for mobile view)
  isOfficeSelected(office: Office): boolean {
    return this.selectedOffice === office;
  }
}
