export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<EmailResponse>;
  sendOrderConfirmationEmail(params: OrderEmailParams): Promise<EmailResponse>;
  sendPasswordEmail(params: PasswordEmailParams): Promise<EmailResponse>;
  sendEmailForPassword(params: SendPasswordSetupEmailParams): Promise<EmailResponse>;
}

export interface EmailResponse {
  success: boolean;
  error?: any;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface OrderEmailParams {
  email: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface PasswordEmailParams {
  email: string;
  password: string;
}

export interface SendPasswordSetupEmailParams {
  email: string;
  name: string;
  token: string;
  type: "signup" | "forgot";
  domain: string;
} 