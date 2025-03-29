import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import emailjs from '@emailjs/browser';
import { ContactForm } from './contact.interface';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly SERVICE_ID = 'service_pedpnwf'; // Substitua pelo seu Service ID do EmailJS
  private readonly TEMPLATE_ID = 'template_jgvafms'; // Substitua pelo seu Template ID do EmailJS
  private readonly USER_ID = '95mJSrv7cbtJRe0CD'; // Substitua pela sua Public Key do EmailJS

  constructor() {
    // Inicializa o EmailJS com a chave pública
    emailjs.init(this.USER_ID);
  }

  /**
   * Envia o formulário de contato por email usando EmailJS
   * @param form Dados do formulário de contato
   * @returns Observable com o resultado do envio
   */
  sendContactForm(form: ContactForm): Observable<any> {
    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      phone: form.phone || 'Não informado',
      company: form.company || 'Não informado',
      subject: form.subject,
      message: form.message,
      service_interest: form.serviceInterest || 'Não informado',
      referral_source: form.howDidYouHear || 'Não informado',
    };

    // Converte a Promise do EmailJS em um Observable
    return from(
      emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams)
    );
  }
}
