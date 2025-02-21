import type {
  EmailProvider,
  EmailResponse,
  SendEmailParams,
  OrderEmailParams,
  PasswordEmailParams,
  SendPasswordSetupEmailParams,
} from "./types";
import {
  getBaseEmailTemplate,
  getOrderConfirmationTemplate,
  getPasswordSetupTemplate,
  getSimplePasswordTemplate,
} from "./templates";
import { env } from "@/lib/utils/env";

const nodemailer: typeof import("nodemailer") = await import(
  import.meta.env.DEV ? "nodemailer" : "npm:nodemailer"
).catch(() => process.exit(1));

export class SESProvider implements EmailProvider {
  private transporter;
  private config;

  constructor() {
    this.config = {
      host: env("EMAIL_HOST"),
      port: 587,
      secure: false,
      auth: {
        user: env("EMAIL_USER"),
        pass: env("EMAIL_PASSWORD"),
      },
      sender: {
        email: env("EMAIL_FROM"),
        name: "Packed Freshly",
      },
    };

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: this.config.auth,
    });
  }

  async sendEmail({
    to,
    subject,
    html,
    text,
    from,
  }: SendEmailParams): Promise<EmailResponse> {
    try {
      await this.transporter.sendMail({
        from: {
          name: this.config.sender.name,
          address: from || this.config.sender.email,
        },
        to: Array.isArray(to) ? to : [to],
        subject,
        html: getBaseEmailTemplate(html),
        text,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false, error };
    }
  }

  async sendOrderConfirmationEmail(
    params: OrderEmailParams,
  ): Promise<EmailResponse> {
    const template = getOrderConfirmationTemplate(params);
    return this.sendEmail({
      to: params.email,
      ...template,
    });
  }

  async sendPasswordEmail(params: PasswordEmailParams): Promise<EmailResponse> {
    const template = getSimplePasswordTemplate(params);
    return this.sendEmail({
      to: params.email,
      ...template,
    });
  }

  async sendEmailForPassword(
    params: SendPasswordSetupEmailParams,
  ): Promise<EmailResponse> {
    const template = getPasswordSetupTemplate(params);
    return this.sendEmail({
      to: params.email,
      ...template,
    });
  }

  // Implementation of other methods...
  // Reference existing implementations:
}

