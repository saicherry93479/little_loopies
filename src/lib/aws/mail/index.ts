
import { SESProvider } from "./ses-provider";
import { ResendProvider } from "./resend-provider";
import type {
  EmailProvider,
  SendEmailParams,
  OrderEmailParams,
  PasswordEmailParams,
  SendPasswordSetupEmailParams,
} from "./types";
import { env } from "@/lib/utils/env";

const emailProvider = env("EMAIL_PROVIDER").toLowerCase();
const provider =
  emailProvider === "resend" ? new ResendProvider() : new SESProvider();

const sendEmail = (params: SendEmailParams) => {
  return provider.sendEmail(params);
};

const sendOrderConfirmationEmail = (params: OrderEmailParams) => {
  return provider.sendOrderConfirmationEmail(params);
};

const sendPasswordEmail = (params: PasswordEmailParams) => {
  return provider.sendPasswordEmail(params);
};

const sendEmailForPassword = (params: SendPasswordSetupEmailParams) => {
  return provider.sendEmailForPassword(params);
};

export const mailSender = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendPasswordEmail,
  sendEmailForPassword,
};

