import type { 
  OrderEmailParams, 
  PasswordEmailParams, 
  SendPasswordSetupEmailParams 
} from '../types';

export function getBaseEmailTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #f8f9fa;
        padding: 20px;
        text-align: center;
        border-radius: 5px;
      }
      .content {
        padding: 20px 0;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #000;
        color: #fff !important;
        text-decoration: none;
        border-radius: 5px;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #6c757d;
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
      <div class="footer">
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  </body>
</html>
`;
}

export function getOrderConfirmationTemplate(props: OrderEmailParams) {
  const itemsList = props.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px;">${item.name}</td>
          <td style="padding: 10px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right;">₹${item.subtotal.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const trackingSection = props.trackingNumber
    ? `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Track Your Order</h3>
        <p>Tracking Number: ${props.trackingNumber}</p>
        ${props.estimatedDelivery ? `<p>Estimated Delivery: ${props.estimatedDelivery}</p>` : ""}
        <a href="/track/${props.trackingNumber}" class="button">Track Package</a>
      </div>
    `
    : "";

  return {
    subject: `Order Confirmation #${props.orderNumber}`,
    html: `
      <div class="header">
        <h2>Order Confirmation</h2>
        <p>Order #${props.orderNumber}</p>
      </div>
      <div class="content">
        <p>Thank you for your order! We'll notify you when your order ships.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
            <tr style="border-top: 2px solid #dee2e6;">
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right;"><strong>₹${props.total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Shipping Address</h3>
          <p style="margin: 0;">${props.shippingAddress}</p>
        </div>

        ${trackingSection}

        <p>If you have any questions about your order, please contact our customer service.</p>
      </div>
    `
  };
}

export function getSimplePasswordTemplate(props: PasswordEmailParams) {
  return {
    subject: `Your Password for ${props.email}`,
    html: `
      <div class="header">
        <h2>Your Password for ${props.email}</h2>
      </div>
      <div class="content">
        <p>Your password is: ${props.password}</p>
        <p>Please keep this password secure and change it after your first login.</p>
      </div>
    `
  };
}

export function getPasswordSetupTemplate(props: SendPasswordSetupEmailParams) {
  const setupLink = `${props.domain}/set-password?token=${props.token}`;
  const emailConfig = PASSWORD_EMAIL_TEMPLATES[props.type];
  
  return {
    subject: emailConfig.subject,
    html: `
      <div class="header">
        <h2>${emailConfig.headerText}</h2>
      </div>
      <div class="content">
        <p>Hello ${props.name},</p>
        <p>${emailConfig.mainText}</p>
        <center>
          <a href="${setupLink}" class="button">
            ${emailConfig.buttonText}
          </a>
        </center>
        <p>This link will expire in 24 hours for security reasons.</p>
        <p>If you didn't request this email, please ignore it.</p>
        <p>If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${setupLink}</p>
      </div>
    `
  };
}

const PASSWORD_EMAIL_TEMPLATES: Record<"signup" | "forgot", {
  subject: string;
  headerText: string;
  mainText: string;
  buttonText: string;
}> = {
  signup: {
    subject: "Complete Your Registration - Set Your Password",
    headerText: "Welcome to Our Store!",
    mainText: "Thank you for signing up! To complete your registration and set up your password, please click the button below:",
    buttonText: "Set Your Password",
  },
  forgot: {
    subject: "Reset Your Password",
    headerText: "Password Reset Request",
    mainText: "We received a request to reset your password. If you didn't make this request, you can safely ignore this email.",
    buttonText: "Reset Password",
  },
}; 