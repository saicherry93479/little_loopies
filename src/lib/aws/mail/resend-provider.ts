import { Resend } from 'resend';
import type { EmailProvider, EmailResponse, SendEmailParams, OrderEmailParams, PasswordEmailParams, SendPasswordSetupEmailParams } from './types';
import { getOrderConfirmationTemplate, getPasswordSetupTemplate, getSimplePasswordTemplate ,getBaseEmailTemplate} from './templates';
import { env } from '@/lib/utils/env';

export class ResendProvider implements EmailProvider {
  private client: Resend;
  private sender: string;

  constructor() {
    this.client = new Resend(env('RESEND_API_KEY'));
    this.sender = env('EMAIL_FROM');
  }

  async sendEmail({ to, subject, html, from }: SendEmailParams): Promise<EmailResponse> {
    try {
      console.log("sending email to ", to);
      console.log("from ", this.sender);
      console.log("subject ", subject);
      console.log("html ", html);
      const resp = await this.client.emails.send({
        from: from || this.sender,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: getBaseEmailTemplate(html),
      });
      console.log("resp in sending email is ", resp);
      if(resp.error){
        return { success: false, error: resp.error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }
  }

  async sendOrderConfirmationEmail(params: OrderEmailParams): Promise<EmailResponse> {
    const template = getOrderConfirmationTemplate(params);
    return this.sendEmail({
      to: params.email,
      ...template
    });
  }

  async sendPasswordEmail(params: PasswordEmailParams): Promise<EmailResponse> {
    const template = getSimplePasswordTemplate(params);
    return this.sendEmail({
      to: params.email,
      ...template
    });
  }

  async sendEmailForPassword(params: SendPasswordSetupEmailParams): Promise<EmailResponse> {
    const template = getPasswordSetupTemplate(params);
    return this.sendEmail({
      to: params.email,
      ...template
    });
  }

  // Implementation of other methods following the same pattern as SES provider
} 