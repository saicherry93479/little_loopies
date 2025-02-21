// src/components/PreviewEmail.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Smartphone, Monitor, Mail } from 'lucide-react';

interface PreviewEmailProps {
  subject: string;
  content: string;
  previewData: {
    customerName?: string;
    lastOrderDate?: string;
    totalOrders?: number;
    location?: string;
    [key: string]: any;
  };
}

interface DeviceFrame {
  width: string;
  height: string;
  className?: string;
}

const DEVICES: Record<string, DeviceFrame> = {
  desktop: { width: 'w-full', height: 'h-[600px]' },
  mobile: { width: 'w-[375px]', height: 'h-[667px]' },
  tablet: { width: 'w-[768px]', height: 'h-[1024px]' },
};

export const PreviewEmail = ({ subject, content, previewData }: PreviewEmailProps) => {
  const [device, setDevice] = useState<keyof typeof DEVICES>('desktop');
  const [testEmail, setTestEmail] = useState('');
  const [previewType, setPreviewType] = useState<'rendered' | 'raw'>('rendered');
  const [selectedPreset, setSelectedPreset] = useState('default');

  // Presets for different customer types
  const presets = {
    default: previewData,
    newCustomer: {
      ...previewData,
      customerName: 'New Customer',
      lastOrderDate: 'First Time',
      totalOrders: 0,
    },
    vipCustomer: {
      ...previewData,
      customerName: 'VIP Customer',
      lastOrderDate: '2024-03-20',
      totalOrders: 50,
    },
    inactiveCustomer: {
      ...previewData,
      customerName: 'Past Customer',
      lastOrderDate: '2023-09-15',
      totalOrders: 3,
    },
  };

  const replaceVariables = (text: string, data: any) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return data[variable] !== undefined ? data[variable] : match;
    });
  };

  // Function to inline CSS styles
  const inlineStyles = (html: string) => {
    // Add default email-safe styles
    const styledHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        ${html}
      </div>
    `;
    
    // Replace common HTML elements with email-safe versions
    return styledHtml
      .replace(/<a /g, '<a style="color: #007bff; text-decoration: underline;" ')
      .replace(/<h1 /g, '<h1 style="font-size: 24px; margin: 20px 0;" ')
      .replace(/<h2 /g, '<h2 style="font-size: 20px; margin: 16px 0;" ')
      .replace(/<p /g, '<p style="margin: 16px 0;" ')
      .replace(/<button /g, '<a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;" ');
  };

  const processedContent = inlineStyles(replaceVariables(content, presets[selectedPreset as keyof typeof presets]));

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={device === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice('desktop')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={device === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <Select value={selectedPreset} onValueChange={setSelectedPreset}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select preview data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Preview</SelectItem>
            <SelectItem value="newCustomer">New Customer</SelectItem>
            <SelectItem value="vipCustomer">VIP Customer</SelectItem>
            <SelectItem value="inactiveCustomer">Inactive Customer</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as 'rendered' | 'raw')}>
          <TabsList>
            <TabsTrigger value="rendered">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw HTML</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Email Preview Frame */}
      <Card className={`mx-auto overflow-hidden ${DEVICES[device].width}`}>
        <CardContent className="p-0">
          {/* Email Header */}
          <div className="border-b p-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500">From:</span>
                <span className="ml-2">Your Company Name &lt;noreply@yourcompany.com&gt;</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500">Subject:</span>
                <span className="ml-2">{replaceVariables(subject, presets[selectedPreset as keyof typeof presets])}</span>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className={`${DEVICES[device].height} overflow-auto`}>
            {previewType === 'rendered' ? (
              <div 
                className="p-4"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            ) : (
              <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
                {processedContent}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Email Section */}
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Label>Send Test Email To:</Label>
          <Input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <Button 
          onClick={() => {
            // Implement send test email functionality
            console.log('Sending test email to:', testEmail);
          }}
        >
          <Mail className="h-4 w-4 mr-2" />
          Send Test
        </Button>
      </div>

      {/* Spam Score Warning */}
      <div className="text-sm text-gray-500">
        <p>Spam Score Analysis:</p>
        <ul className="list-disc pl-5">
          {subject.length > 60 && (
            <li className="text-yellow-600">Subject line is longer than recommended (60 characters)</li>
          )}
          {content.includes('!') && (
            <li className="text-yellow-600">Contains exclamation marks (may affect spam score)</li>
          )}
          {!content.includes('{{unsubscribeLink}}') && (
            <li className="text-red-600">Missing unsubscribe link (required)</li>
          )}
        </ul>
      </div>
    </div>
  );
};