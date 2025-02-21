// src/components/EmailCampaignManager.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Editor } from './Editor';
import { RecipientSelector } from './RecipientSelector';
import { PreviewEmail } from './PreviewEmail';
import type { EmailCampaign } from './types';
import PageContainer from '@/components/dashbaord/PageContainer';

export const EMAIL_TEMPLATES = {
  blank: {
    subject: '',
    content: '',
  },
  flashSale: {
    subject: '🔥 Flash Sale: {{productName}} - {{discountPercent}}% OFF',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
          <h1 style="color: #e63946;">Flash Sale Alert! 🔥</h1>
          <h2 style="color: #1d3557;">{{discountPercent}}% OFF {{productName}}</h2>
        </div>

        <div style="padding: 20px;">
          <div style="text-align: center; margin: 20px 0;">
            <img src="{{productImage}}" alt="{{productName}}" style="max-width: 300px; border-radius: 8px;" />
          </div>

          <div style="background-color: #f1faee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 24px; color: #1d3557; text-align: center;">
              <span style="text-decoration: line-through; color: #e63946;">{{originalPrice}}</span>
              <span style="font-size: 32px; margin-left: 10px; color: #2a9d8f;">{{discountedPrice}}</span>
            </div>
            <p style="text-align: center; color: #e63946; font-weight: bold;">
              Save {{savingsAmount}}!
            </p>
          </div>

          <p style="color: #1d3557; font-size: 16px;">
            Dear {{customerName}},
          </p>
          <p>
            Don't miss out on this incredible offer! For a limited time only, get {{discountPercent}}% off on {{productName}}.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{productUrl}}" style="background-color: #e63946; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Shop Now
            </a>
          </div>

          <p style="color: #457b9d; font-size: 14px;">
            Hurry! Offer ends in {{hoursRemaining}} hours.
          </p>
        </div>

        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px;">
          <p>
            <a href="{{unsubscribeLink}}" style="color: #457b9d;">Unsubscribe</a> |
            <a href="{{preferencesLink}}" style="color: #457b9d;">Email Preferences</a>
          </p>
        </div>
      </div>
    `,
  },
  productShowcase: {
    subject: '✨ New Arrivals: {{productName}} Collection',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
          <h1 style="color: #2a9d8f;">Just Launched</h1>
          <h2 style="color: #264653;">{{productName}}</h2>
        </div>

        <div style="padding: 20px;">
          <div style="text-align: center; margin: 20px 0;">
            <img src="{{productImage}}" alt="{{productName}}" style="max-width: 300px; border-radius: 8px;" />
          </div>

          <p style="color: #264653; font-size: 16px;">
            Dear {{customerName}},
          </p>
          
          <p>{{productDescription}}</p>

          <div style="background-color: #f1faee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 24px; color: #264653; text-align: center;">
              {{productPrice}}
            </div>
            {{#hasDiscount}}
            <p style="text-align: center; color: #e63946; font-weight: bold;">
              Limited Time Offer: {{discountPercent}}% OFF
            </p>
            {{/hasDiscount}}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{productUrl}}" style="background-color: #2a9d8f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Shop Now
            </a>
          </div>
        </div>

        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px;">
          <p>
            <a href="{{unsubscribeLink}}" style="color: #457b9d;">Unsubscribe</a> |
            <a href="{{preferencesLink}}" style="color: #457b9d;">Email Preferences</a>
          </p>
        </div>
      </div>
    `,
  },
  abandonedCart: {
    subject: 'Complete Your Purchase - Special Offer Inside! 🛍️',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
          <h1 style="color: #457b9d;">Your Cart Misses You!</h1>
        </div>

        <div style="padding: 20px;">
          <p style="color: #1d3557; font-size: 16px;">
            Hi {{customerName}},
          </p>
          
          <p>We noticed you left some great items in your cart. Here's what you're missing:</p>

          {{#cartItems}}
          <div style="margin: 20px 0; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
            <div style="display: flex; align-items: center; padding: 15px;">
              <img src="{{productImage}}" alt="{{productName}}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;" />
              <div style="margin-left: 15px;">
                <h3 style="margin: 0; color: #1d3557;">{{productName}}</h3>
                <p style="color: #457b9d; margin: 5px 0;">Quantity: {{quantity}}</p>
                <p style="color: #2a9d8f; font-size: 18px; margin: 5px 0;">{{price}}</p>
              </div>
            </div>
          </div>
          {{/cartItems}}

          <div style="background-color: #f1faee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Subtotal:</span>
              <span>{{subtotal}}</span>
            </div>
            {{#hasDiscount}}
            <div style="display: flex; justify-content: space-between; color: #e63946; margin-bottom: 10px;">
              <span>Special Discount:</span>
              <span>-{{discountAmount}}</span>
            </div>
            {{/hasDiscount}}
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
              <span>Total:</span>
              <span>{{total}}</span>
            </div>
          </div>

          {{#hasPromoCode}}
          <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f1faee; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #2a9d8f;">
              Use code: {{promoCode}} for an extra {{promoDiscount}}% off!
            </p>
            <p style="margin: 5px 0; font-size: 14px; color: #457b9d;">
              Valid for {{promoHours}} hours only
            </p>
          </div>
          {{/hasPromoCode}}

          <div style="text-align: center; margin: 30px 0;">
            <a href="{{cartUrl}}" style="background-color: #457b9d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Complete Your Purchase
            </a>
          </div>
        </div>

        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px;">
          <p>
            <a href="{{unsubscribeLink}}" style="color: #457b9d;">Unsubscribe</a> |
            <a href="{{preferencesLink}}" style="color: #457b9d;">Email Preferences</a>
          </p>
        </div>
      </div>
    `,
  },
};
export const EmailCampaignManager = () => {
    const { toast } = useToast();
  const [campaign, setCampaign] = useState<Partial<EmailCampaign>>({
    name: '',
    subject: '',
    content: '',
    status: 'draft',
    recipientFilter: {},
  });

  const [previewData, setPreviewData] = useState<{
    showPreview: boolean;
    testEmail?: string;
  }>({ showPreview: false });

  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [recipientCount, setRecipientCount] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);

  // Handle template selection
  const handleTemplateSelect = (templateKey: string) => {
    const template = EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES];
    setCampaign({
      ...campaign,
      subject: template.subject,
      content: template.content,
    });
  };

  // Handle recipient count preview
  const handlePreviewCount = async (filter: any) => {
    try {
      const response = await fetch('/api/email/preview-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter }),
      });
      const data = await response.json();
      setRecipientCount(data.count);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch recipient count',
        variant: 'destructive',
      });
    }
  };

  // Handle scheduling option
  const handleSchedulingOption = (value: string) => {
    setCampaign({
      ...campaign,
      status: value === 'schedule' ? 'scheduled' : 'draft',
    });
  };

  // Handle time change for scheduled campaigns
  const handleTimeChange = (timeString: string) => {
    if (scheduledTime && timeString) {
      const [hours, minutes] = timeString.split(':');
      const newDate = new Date(scheduledTime);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      setScheduledTime(newDate);
    }
  };

  // Validate campaign before sending
  const validateCampaign = (): boolean => {
    if (!campaign.name?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Campaign name is required',
        variant: 'destructive',
      });
      return false;
    }

    if (!campaign.subject?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Subject line is required',
        variant: 'destructive',
      });
      return false;
    }

    if (!campaign.content?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Email content is required',
        variant: 'destructive',
      });
      return false;
    }

    if (!campaign.content.includes('{{unsubscribeLink}}')) {
      toast({
        title: 'Validation Error',
        description: 'Email must include an unsubscribe link',
        variant: 'destructive',
      });
      return false;
    }

    if (campaign.status === 'scheduled' && !scheduledTime) {
      toast({
        title: 'Validation Error',
        description: 'Please select a schedule time',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  // Handle saving draft
  const handleSaveDraft = async () => {
    try {
      const response = await fetch('/api/email/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });

      if (!response.ok) throw new Error('Failed to save draft');

      toast({
        title: 'Success',
        description: 'Campaign draft saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save campaign draft',
        variant: 'destructive',
      });
    }
  };

  // Handle sending test email
  const handleSendTest = async () => {
    if (!previewData.testEmail) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a test email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/email/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: previewData.testEmail,
          subject: campaign.subject,
          content: campaign.content,
          previewData: {
            customerName: "Test User",
            lastOrderDate: "2024-03-15",
            totalOrders: 5,
            location: "Test Location",
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to send test email');

      toast({
        title: 'Success',
        description: 'Test email sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      });
    }
  };

  // Handle send or schedule campaign
  const handleSendOrSchedule = async () => {
    if (!validateCampaign()) return;
    
    setIsSending(true);
    try {
      const endpoint = campaign.status === 'scheduled' ? '/api/email/schedule' : '/api/email/send';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaign,
          scheduledTime: scheduledTime?.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to process campaign');

      toast({
        title: 'Success',
        description: campaign.status === 'scheduled' 
          ? 'Campaign scheduled successfully' 
          : 'Campaign sent successfully',
      });

      // Reset form after successful send/schedule
      setCampaign({
        name: '',
        subject: '',
        content: '',
        status: 'draft',
        recipientFilter: {},
      });
      setScheduledTime(null);

    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${campaign.status === 'scheduled' ? 'schedule' : 'send'} campaign`,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageContainer>
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Email Campaign Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compose" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="preview">Preview & Test</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Campaign Name</Label>
                <Input 
                  value={campaign.name}
                  onChange={(e) => setCampaign({...campaign, name: e.target.value})}
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <Label>Template</Label>
                <Select 
                  onValueChange={(value) => handleTemplateSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flashSale">flashSale</SelectItem>
                    <SelectItem value="productShowcase">Product ShowCase</SelectItem>
                    <SelectItem value="abandonedCart">Abandoded Cart</SelectItem>
                    <SelectItem value="promotion">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject Line</Label>
                <Input 
                  value={campaign.subject}
                  onChange={(e) => setCampaign({...campaign, subject: e.target.value})}
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <Label>Email Content</Label>
                <Editor 
                  value={campaign.content}
                  onChange={(content) => setCampaign({...campaign, content})}
                  variables={[
                    'customerName',
                    'lastOrderDate',
                    'totalOrders',
                    'location',
                    'unsubscribeLink'
                  ]}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipients">
            <RecipientSelector 
              value={campaign.recipientFilter}
              onChange={(filter) => setCampaign({...campaign, recipientFilter: filter})}
              onPreviewCount={handlePreviewCount}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Select
                  value={campaign.status === 'scheduled' ? 'schedule' : 'send'}
                  onValueChange={(value) => handleSchedulingOption(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose sending option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send">Send Immediately</SelectItem>
                    <SelectItem value="schedule">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {campaign.status === 'scheduled' && (
                <div>
                  <Label>Schedule Date and Time</Label>
                  <Calendar
                    mode="single"
                    selected={scheduledTime}
                    onSelect={setScheduledTime}
                    className="rounded-md border"
                  />
                  <div className="mt-2">
                    <Input
                      type="time"
                      value={scheduledTime?.toISOString().split('T')[1].slice(0, 5)}
                      onChange={(e) => handleTimeChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <div>
                <Label>Send Test Email</Label>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter test email address"
                    value={previewData.testEmail}
                    onChange={(e) => setPreviewData({...previewData, testEmail: e.target.value})}
                  />
                  <Button onClick={handleSendTest}>Send Test</Button>
                </div>
              </div>

              <div>
                <Label>Preview Campaign</Label>
                <PreviewEmail
                  subject={campaign.subject}
                  content={campaign.content}
                  previewData={{
                    customerName: "John Doe",
                    lastOrderDate: "2024-03-15",
                    totalOrders: 5,
                    location: "New York",
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSendOrSchedule}>
            {campaign.status === 'scheduled' ? 'Schedule Campaign' : 'Send Campaign'}
          </Button>
        </div>
      </CardContent>
    </Card>
    </PageContainer>
  );
};