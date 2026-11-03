import { BrevoClient } from "@getbrevo/brevo";

// Initialize Brevo API client using official Brevo SDK
const brevoApiKey = process.env.BREVO_API_KEY;
const brevoClient = brevoApiKey ? new BrevoClient({ apiKey: brevoApiKey }) : null;

const DEFAULT_SENDER = {
  name: process.env.BREVO_SENDER_NAME || "Kala Samputah",
  email: process.env.BREVO_SENDER_EMAIL || "contact@kalasamputah.com",
};

const STUDIO_EMAIL = process.env.STUDIO_ALERT_EMAIL || "sikrinancy@gmail.com";

/**
 * Generic transactional email sender via Brevo API
 */
export async function sendEmail({ to, subject, htmlContent, replyTo }) {
  if (!brevoClient) {
    console.warn("[Brevo] BREVO_API_KEY is not defined. Email skipped.");
    return { skipped: true };
  }

  try {
    const payload = {
      sender: DEFAULT_SENDER,
      to: Array.isArray(to) ? to : [{ email: to.email || to, name: to.name || "" }],
      subject,
      htmlContent,
    };

    if (replyTo) {
      payload.replyTo = typeof replyTo === "string" ? { email: replyTo } : replyTo;
    }

    const response = await brevoClient.transactionalEmails.sendTransacEmail(payload);
    return { success: true, messageId: response?.messageId };
  } catch (err) {
    console.error("[Brevo] Error sending email:", err?.body || err?.message || err);
    return { success: false, error: err?.message || "Email delivery failed" };
  }
}

/**
 * 1. Alert Email to Nancy Sikri (Studio) on New Artwork Inquiry
 */
export async function sendInquiryAlertToStudio({ name, email, phone, message, artworkTitle, source }) {
  const subject = `[New Inquiry] ${name} — ${artworkTitle || "Studio Consultation"}`;

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background-color: #F8F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C1C1C;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E6DCCD; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
                
                <!-- Gold Accent Header -->
                <tr>
                  <td style="background-color: #121110; padding: 24px 32px; text-align: left; border-bottom: 2px solid #C9A96E;">
                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #C9A96E; font-weight: 600;">Nancy Sikri Atelier</span>
                    <h1 style="margin: 6px 0 0 0; font-size: 20px; color: #FFFFFF; font-weight: 400; font-family: Georgia, serif;">New Acquisition Inquiry</h1>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 32px;">
                    <p style="font-size: 15px; line-height: 1.6; color: #333333; margin-top: 0;">
                      Hello Nancy, you have received a new collector inquiry through <strong>kalasamputah.com</strong>.
                    </p>

                    <!-- Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2; border-radius: 8px; border: 1px solid #EBE3D5; margin: 20px 0; padding: 16px 20px;">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EFE8DC;">
                          <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7B6B;">Collector:</strong><br />
                          <span style="font-size: 15px; color: #1C1C1C; font-weight: 600;">${name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EFE8DC;">
                          <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7B6B;">Email:</strong><br />
                          <a href="mailto:${email}" style="font-size: 14px; color: #1C1C1C; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EFE8DC;">
                          <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7B6B;">Phone / WhatsApp:</strong><br />
                          <span style="font-size: 14px; color: #1C1C1C;">${phone}</span>
                        </td>
                      </tr>
                      ` : ""}
                      ${artworkTitle ? `
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #EFE8DC;">
                          <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7B6B;">Artwork of Interest:</strong><br />
                          <span style="font-size: 14px; color: #C9A96E; font-weight: 600;">${artworkTitle}</span>
                        </td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding: 8px 0 0 0;">
                          <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8A7B6B;">Message:</strong><br />
                          <p style="font-size: 14px; line-height: 1.6; color: #2A2A2A; margin: 4px 0 0 0; white-space: pre-wrap;">${message}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Quick Reply Actions -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                      <tr>
                        <td>
                          <a href="mailto:${email}?subject=Re: Inquiry regarding ${encodeURIComponent(artworkTitle || 'Kala Samputah Original Artwork')}" style="display: inline-block; background-color: #121110; color: #FFFFFF; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-right: 12px;">Reply via Email</a>
                          ${waLink ? `
                          <a href="${waLink}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; padding: 12px 24px; border-radius: 6px;">Chat on WhatsApp</a>
                          ` : ""}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #FAF7F2; padding: 16px 32px; border-top: 1px solid #EFE8DC; text-align: center;">
                    <p style="font-size: 11px; color: #8A7B6B; margin: 0; text-transform: uppercase; letter-spacing: 0.15em;">
                      Kala Samputah · Atelier Studio · New Delhi
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: { email: STUDIO_EMAIL, name: "Nancy Sikri" },
    subject,
    htmlContent,
    replyTo: { email, name },
  });
}

/**
 * 2. Elegant Receipt & Acknowledgment Email to Collector
 */
export async function sendInquiryReceiptToCollector({ name, email, artworkTitle }) {
  const subject = `Inquiry Received: ${artworkTitle ? `"${artworkTitle}"` : "Nancy Sikri Atelier"}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background-color: #F8F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C1C1C;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E6DCCD; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
                
                <!-- Gold Accent Header -->
                <tr>
                  <td style="background-color: #121110; padding: 28px 32px; text-align: center; border-bottom: 2px solid #C9A96E;">
                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.35em; color: #C9A96E; font-weight: 600; display: block; margin-bottom: 6px;">Atelier Studio</span>
                    <h1 style="margin: 0; font-size: 24px; color: #FFFFFF; font-weight: 300; font-family: Georgia, serif; letter-spacing: 0.08em;">KALA SAMPUTAH</h1>
                    <span style="font-size: 11px; color: rgba(245,240,232,0.6); font-style: italic; display: block; margin-top: 4px;">Nancy Sikri</span>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="font-size: 18px; color: #1C1C1C; font-weight: 500; font-family: Georgia, serif; margin: 0 0 16px 0;">
                      Thank you for connecting, ${name}.
                    </h2>

                    <p style="font-size: 14px; line-height: 1.8; color: #3A3A3A; margin: 0 0 16px 0;">
                      We have received your message regarding ${artworkTitle ? `the original painting <strong>"${artworkTitle}"</strong>` : "your acquisition inquiry"}.
                    </p>

                    <p style="font-size: 14px; line-height: 1.8; color: #3A3A3A; margin: 0 0 24px 0;">
                      Nancy Sikri personally reviews all studio inquiries to discuss acquisition details, provenance, and commissioning requirements. We will get back to you within 24 hours.
                    </p>

                    <!-- Quote Block -->
                    <div style="border-left: 2px solid #C9A96E; padding-left: 16px; margin: 24px 0; font-style: italic; color: #665D52; font-size: 13px; line-height: 1.7;">
                      "Every work is a conversation between two strangers."
                    </div>

                    <p style="font-size: 13px; line-height: 1.6; color: #6B6256; margin: 24px 0 0 0;">
                      Warm regards,<br />
                      <strong>Nancy Sikri & The Studio Team</strong><br />
                      <a href="https://kalasamputah.com" style="color: #C9A96E; text-decoration: none;">kalasamputah.com</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #FAF7F2; padding: 20px 32px; border-top: 1px solid #EFE8DC; text-align: center;">
                    <p style="font-size: 11px; color: #8A7B6B; margin: 0 0 6px 0;">
                      Need immediate assistance? Reach out directly on WhatsApp at <a href="https://wa.me/919818817291" style="color: #25D366; text-decoration: none; font-weight: 600;">+91 98188 17291</a>
                    </p>
                    <p style="font-size: 10px; color: #AAA090; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">
                      Kala Samputah · New Delhi, India
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: { email, name },
    subject,
    htmlContent,
    replyTo: { email: DEFAULT_SENDER.email, name: DEFAULT_SENDER.name },
  });
}

/**
 * 3. Alert Email to Studio on New Artwork Order
 */
export async function sendOrderAlertToStudio(order) {
  const subject = `[New Order #${order.orderNumber}] ${order.customerName} — ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, sans-serif; background: #F8F5F0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6DCCD; overflow: hidden;">
          <div style="background: #121110; padding: 20px; border-bottom: 2px solid #C9A96E;">
            <h2 style="color: #FFFFFF; margin: 0; font-family: Georgia, serif;">New Order Confirmed (#${order.orderNumber})</h2>
          </div>
          <div style="padding: 24px;">
            <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
            <p><strong>Phone:</strong> ${order.customerPhone || "N/A"}</p>
            <p><strong>Artwork:</strong> ${order.artworkTitle} (Qty: ${order.quantity || 1})</p>
            <p><strong>Total Amount:</strong> ₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}</p>
            <p><strong>Shipping Address:</strong><br />${order.customerAddress || "N/A"}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus || "pending"}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: { email: STUDIO_EMAIL, name: "Nancy Sikri" },
    subject,
    htmlContent,
  });
}
