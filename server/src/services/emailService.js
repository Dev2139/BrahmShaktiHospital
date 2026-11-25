import nodemailer from 'nodemailer';

/**
 * Creates and configures the Nodemailer transporter.
 * If SMTP credentials exist in environment variables, it uses them.
 * In development, if credentials are missing or invalid, it gracefully falls back
 * to a test/mock transporter or Ethereal, printing the OTP and dispatch details cleanly.
 */

let transporter = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'dev.patel.codinggita@gmail.com';
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const pass = rawPass.replace(/\s+/g, '');
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  // 1. If using Gmail service
  if ((process.env.EMAIL_SERVICE === 'gmail' || (!host && user.includes('@gmail.com'))) && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
      console.log(`[EmailService] Configured Gmail SMTP transport for ${user}`);
      return transporter;
    } catch (err) {
      console.error('[EmailService] Failed to initialize Gmail transport:', err.message);
    }
  }

  // 2. Custom SMTP host
  if (host && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false
        }
      });
      console.log(`[EmailService] Configured live SMTP transport with host: ${host}`);
      return transporter;
    } catch (err) {
      console.error('[EmailService] Failed to initialize live SMTP transport:', err.message);
    }
  }

  // Fallback for development: Ethereal test account or stream transport
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(`[EmailService] Using Ethereal test mailer: ${testAccount.user}`);
    return transporter;
  } catch {
    // Ultimate fallback: JSON transport so server never crashes
    transporter = nodemailer.createTransport({
      jsonTransport: true
    });
    console.log('[EmailService] Using JSON/stream fallback mailer');
    return transporter;
  }
};

/**
 * Sends a hospital-branded HTML OTP email to the user.
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.otp - 6-digit OTP code
 * @param {string} [options.patientName] - Patient's name
 * @param {string} [options.type] - 'registered_patient' | 'new_patient'
 * @param {string} [options.uhid] - Optional UHID if known
 */
export const sendOtpEmail = async ({ to, otp, patientName = 'Valued Patient', type = 'registered_patient', uhid = '' }) => {
  try {
    const transport = await createTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Brahm Shakti Hospital" <dev.patel.codinggita@gmail.com>';

    const isRegistered = type === 'registered_patient';
    const emailSubject = isRegistered
      ? `Brahm Shakti Hospital - Verification Code: ${otp}`
      : `Brahm Shakti Hospital - Registration OTP: ${otp}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F0FBFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F0FBFC; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(1, 138, 174, 0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- Hospital Header with 3-Color Wave Palette -->
          <tr>
            <td style="background: linear-gradient(135deg, #018AAE 0%, #0DAFD5 100%); padding: 26px 30px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                      BRAHM SHAKTI HOSPITAL
                    </div>
                    <div style="font-size: 11px; font-weight: 600; color: #CEF5FA; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px;">
                      OPD APPOINTMENT &amp; PATIENT PORTAL &bull; TRUST OF GENERATIONS
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 30px 24px 30px;">
              <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                Dear ${patientName},
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                ${
                  isRegistered
                    ? `We received a request to connect your registered patient profile${uhid ? ` (UHID: <strong>${uhid}</strong>)` : ''} to the OPD appointment portal.`
                    : 'Thank you for registering with Brahm Shakti Hospital. Please verify your email address to complete your registration and issue your Unique Hospital Identification (UHID).'
                }
              </p>

              <!-- OTP Verification Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #F0FBFC; border: 2px dashed #018AAE; border-radius: 12px; padding: 20px 30px; text-align: center; display: inline-block; min-width: 240px;">
                      <div style="font-size: 11px; font-weight: 800; color: #018AAE; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px;">
                        YOUR 6-DIGIT VERIFICATION CODE
                      </div>
                      <div style="font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #018AAE; font-family: 'Courier New', Courier, monospace; margin: 4px 0;">
                        ${otp}
                      </div>
                      <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 6px;">
                        Valid for 10 minutes only
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Advisory -->
              <div style="background-color: #F8FAFC; border-left: 4px solid #018AAE; border-radius: 6px; padding: 12px 16px; margin: 24px 0 16px 0;">
                <div style="font-size: 12px; font-weight: 700; color: #0A7A74; margin-bottom: 3px;">
                  Security Note:
                </div>
                <div style="font-size: 12px; line-height: 1.5; color: #64748b;">
                  Brahm Shakti Hospital staff will never call or ask you for this OTP code. Do not share this code with anyone. If you did not request this verification, please contact our hospital helpdesk immediately.
                </div>
              </div>

              <!-- Hospital Credentials & Contacts -->
              <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.5;">
                <strong>Hospital Location:</strong> Pocket C, Budh Vihar Phase I, New Delhi - 110085<br/>
                <strong>24x7 Emergency Helpline:</strong> 7840089703 &bull; <strong>Reception:</strong> 011-27531683<br/>
                <strong>NABH &amp; NABL Accredited Healthcare Facility</strong>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 16px 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              &copy; ${new Date().getFullYear()} Brahm Shakti Hospital &amp; Research Centre. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const info = await transport.sendMail({
      from: fromAddress,
      to,
      subject: emailSubject,
      text: `Your Brahm Shakti Hospital verification code is: ${otp}. It is valid for 10 minutes.`,
      html: htmlContent
    });

    console.log(`[EmailService] OTP sent successfully to ${to}. MessageId: ${info.messageId}`);
    
    // In Ethereal / test mode, log the preview URL for dev convenience
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[EmailService] Preview Email URL: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    };
  } catch (error) {
    console.error('[EmailService] Error dispatching OTP email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
