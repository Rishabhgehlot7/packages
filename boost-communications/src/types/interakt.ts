export interface InteraktTrackUserOptions {
  phoneNumber: string;
  countryCode: string;
  fullPhoneNumber?: string;
  userId?: string;
  traits?: Record<string, any>;
  tags?: string[];
  createdAt?: string;
  add_to_sales_cycle?: boolean;
}

export interface InteraktTrackEventOptions {
  phoneNumber: string;
  countryCode: string;
  fullPhoneNumber?: string;
  userId?: string;
  event: string;
  traits?: Record<string, any>;
}

export interface InteraktCampaignOptions {
  campaign_name: string;
  campaign_type: string;
  template_name: string;
  language_code: string;
}

export interface InteraktTemplateCreateOptions {
  display_name: string;
  language: string;
  category: string;
  header_format?: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | null;
  header?: string;
  header_text?: string[];
  header_handle?: string[];
  header_handle_file_url?: string;
  header_handle_file_name?: string;
  body: string;
  body_text?: string[];
  footer?: string;
  button_type?: 'Call To Action' | 'Quick Replies';
  buttons?: any[];
  button_text?: string;
  carousel_cards?: any[];
}

export interface InteraktChatAssignmentOptions {
  user_phone_number: string;
  agent_email: string;
}

export interface InteraktSendMediaOptions {
  countryCode: string;
  phoneNumber: string;
  fullPhoneNumber?: string;
  callbackData?: string;
  type: 'Text' | 'Audio' | 'Image' | 'Document' | 'Video' | 'InteractiveButton' | 'InteractiveList';
  data: any;
}

export interface InteraktSendTemplateOptions {
  countryCode: string;
  phoneNumber: string;
  fullPhoneNumber?: string;
  callbackData?: string;
  campaignId?: string;
  template_category?: string;
  type: 'Template';
  template: {
    name: string;
    languageCode: string;
    headerValues?: string[];
    bodyValues?: string[];
    buttonValues?: Record<string, string[]>;
    carouselCards?: any[];
    order_details?: any[];
    order_status?: any;
    fileName?: string;
  };
  fallback?: any[];
}

export interface InteraktRCSMessageOptions {
  countryCode: string;
  phoneNumber: string;
  message?: any;
  type: 'Text' | 'QR' | 'BUTTON_URL' | 'DIALER_ACTION' | 'Location' | 'Calender' | 'CAROUSEL' | 'STANDALONE_CAROUSEL' | 'Image' | 'Template';
  template?: {
    name: string;
    languageCode: string;
    bodyValues?: string[];
    carouselCards?: any[];
  };
  campaignId?: string;
  fallback?: any[];
  contentInfo?: {
    fileUrl: string;
    thumbnailUrl?: string;
  };
}
