export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content: string;
    type: 'promotional' | 'transactional' | 'newsletter' | 'product';
    variables: string[];
    createdAt: string;
  }
  
  export interface EmailRecipient {
    email: string;
    name: string;
    lastOrderDate?: string;
    totalOrders?: number;
    totalSpent?: number;
    location?: string;
    tags?: string[];
    unsubscribed?: boolean;
    bounced?: boolean;
  }
  
  export interface EmailCampaign {
    id: number;
    name: string;
    subject: string;
    content: string;
    templateId?: number;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    scheduledFor?: string;
    sentAt?: string;
    recipientFilter: RecipientFilter;
    stats: CampaignStats;
  }
  
  export interface RecipientFilter {
    locations?: string[];
    minTotalOrders?: number;
    maxTotalOrders?: number;
    minTotalSpent?: number;
    maxTotalSpent?: number;
    lastOrderStart?: string;
    lastOrderEnd?: string;
    tags?: string[];
    excludeTags?: string[];
    excludeEmails?: string[];
  }
  
  export interface CampaignStats {
    totalRecipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    complaints: number;
  }