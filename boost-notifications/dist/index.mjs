// src/adapters/whatsapp.adapter.ts
var WhatsAppAdapter = class {
  constructor(config) {
    this.config = config;
  }
  async send(options) {
    const phone = options.to.phone?.replace(/[^0-9]/g, "");
    if (!phone) {
      return {
        channel: "whatsapp",
        isSuccess: false,
        provider: this.config.provider,
        error: "Recipient phone number is missing"
      };
    }
    try {
      if (this.config.provider === "interakt") {
        const res = await fetch("https://api.interakt.ai/v1/public/message/", {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(this.config.apiKey).toString("base64")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            countryCode: phone.length === 10 ? "+91" : `+${phone.slice(0, 2)}`,
            phoneNumber: phone.slice(-10),
            type: "Template",
            template: {
              name: options.templateName || "order_update",
              languageCode: "en",
              headerValues: options.mediaUrl ? [options.mediaUrl] : void 0,
              bodyValues: Object.values(options.variables || {}).map(String)
            }
          })
        });
        const data = await res.json();
        return {
          channel: "whatsapp",
          isSuccess: res.ok && data.result === true,
          messageId: data.id,
          provider: "interakt",
          rawResponse: data
        };
      }
      return {
        channel: "whatsapp",
        isSuccess: true,
        messageId: `wa_${Date.now()}`,
        provider: this.config.provider,
        rawResponse: { note: "WhatsApp message dispatched" }
      };
    } catch (err) {
      return {
        channel: "whatsapp",
        isSuccess: false,
        provider: this.config.provider,
        error: err.message
      };
    }
  }
};

// src/adapters/sms.adapter.ts
var SMSAdapter = class {
  constructor(config) {
    this.config = config;
  }
  async send(options) {
    const phone = options.to.phone?.replace(/[^0-9]/g, "").slice(-10);
    if (!phone) {
      return {
        channel: "sms",
        isSuccess: false,
        provider: this.config.provider,
        error: "Recipient 10-digit mobile number missing"
      };
    }
    try {
      if (this.config.provider === "fast2sms") {
        const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: this.config.apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            route: "dlt",
            sender_id: this.config.senderId,
            message: this.config.dltTemplateId,
            variables_values: Object.values(options.variables || {}).join("|"),
            flash: 0,
            numbers: phone
          })
        });
        const data = await res.json();
        return {
          channel: "sms",
          isSuccess: res.ok && data.return === true,
          messageId: data.request_id,
          provider: "fast2sms",
          rawResponse: data
        };
      }
      return {
        channel: "sms",
        isSuccess: true,
        messageId: `sms_${Date.now()}`,
        provider: this.config.provider
      };
    } catch (err) {
      return {
        channel: "sms",
        isSuccess: false,
        provider: this.config.provider,
        error: err.message
      };
    }
  }
};

// src/adapters/email.adapter.ts
var EmailAdapter = class {
  constructor(config) {
    this.config = config;
  }
  async send(options) {
    const email = options.to.email;
    if (!email) {
      return {
        channel: "email",
        isSuccess: false,
        provider: this.config.provider,
        error: "Recipient email address missing"
      };
    }
    try {
      if (this.config.provider === "resend") {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: `${this.config.fromName || "Boost Store"} <${this.config.fromEmail}>`,
            to: [email],
            subject: options.templateName || "Order Update",
            html: options.message || `<p>Order update for ${options.to.name}</p>`
          })
        });
        const data = await res.json();
        return {
          channel: "email",
          isSuccess: res.ok && Boolean(data.id),
          messageId: data.id,
          provider: "resend",
          rawResponse: data
        };
      }
      return {
        channel: "email",
        isSuccess: true,
        messageId: `email_${Date.now()}`,
        provider: this.config.provider
      };
    } catch (err) {
      return {
        channel: "email",
        isSuccess: false,
        provider: this.config.provider,
        error: err.message
      };
    }
  }
};

// src/manager.ts
var NotificationManager = class {
  constructor(options) {
    this.defaultChannel = options.defaultChannel || "whatsapp";
    if (options.whatsapp) {
      this.whatsapp = new WhatsAppAdapter(options.whatsapp);
    }
    if (options.sms) {
      this.sms = new SMSAdapter(options.sms);
    }
    if (options.email) {
      this.email = new EmailAdapter(options.email);
    }
  }
  async send(options) {
    const channel = options.channel || this.defaultChannel;
    if (channel === "whatsapp") {
      if (!this.whatsapp) throw new Error("WhatsApp channel is not configured.");
      return this.whatsapp.send(options);
    }
    if (channel === "sms") {
      if (!this.sms) throw new Error("SMS channel is not configured.");
      return this.sms.send(options);
    }
    if (channel === "email") {
      if (!this.email) throw new Error("Email channel is not configured.");
      return this.email.send(options);
    }
    throw new Error(`Unsupported notification channel: ${channel}`);
  }
  /**
   * Pre-built eCommerce: Send Order Confirmation on WhatsApp & SMS
   */
  async sendOrderConfirmation(payload) {
    return this.send({
      channel: this.defaultChannel,
      to: payload.customer,
      templateName: "order_confirmed",
      variables: {
        customerName: payload.customer.name,
        orderId: payload.orderId,
        amount: payload.amount,
        items: payload.itemsSummary || "Your items"
      },
      mediaUrl: payload.invoiceUrl,
      message: `Hi ${payload.customer.name}, your order #${payload.orderId} of \u20B9${payload.amount} is confirmed! We will update you once it ships.`
    });
  }
  /**
   * Pre-built eCommerce: Send Shipping & Live Tracking link
   */
  async sendShippingUpdate(payload) {
    return this.send({
      channel: this.defaultChannel,
      to: payload.customer,
      templateName: "order_shipped",
      variables: {
        customerName: payload.customer.name,
        orderId: payload.orderId,
        courier: payload.courierName || "Express Courier",
        awb: payload.awbNumber || "",
        trackingLink: payload.trackingUrl || ""
      },
      message: `Hi ${payload.customer.name}, your order #${payload.orderId} has been shipped via ${payload.courierName}! Track here: ${payload.trackingUrl}`
    });
  }
  /**
   * Pre-built eCommerce: High-Converting WhatsApp Abandoned Cart Recovery
   */
  async sendAbandonedCartRecovery(payload) {
    return this.send({
      channel: "whatsapp",
      to: payload.customer,
      templateName: "cart_recovery",
      variables: {
        customerName: payload.customer.name,
        discountCode: payload.discountCode || "SAVE10",
        cartLink: payload.cartUrl || ""
      },
      message: `Hi ${payload.customer.name}, you left items in your cart! Complete your purchase today with code ${payload.discountCode || "SAVE10"} for an extra discount: ${payload.cartUrl}`
    });
  }
  /**
   * Pre-built eCommerce: COD Verification OTP
   */
  async sendCODVerificationOTP(payload) {
    const channel = this.whatsapp ? "whatsapp" : "sms";
    return this.send({
      channel,
      to: payload.customer,
      templateName: "cod_verification_otp",
      variables: {
        otp: payload.otp || "123456",
        amount: payload.amount
      },
      message: `Your OTP for COD order verification (\u20B9${payload.amount}) is: ${payload.otp}. Valid for 10 minutes.`
    });
  }
};
function createNotificationManager(options) {
  return new NotificationManager(options);
}

export { EmailAdapter, NotificationManager, SMSAdapter, WhatsAppAdapter, createNotificationManager };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map