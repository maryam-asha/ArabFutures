import { AppLocale } from "@i18n/config";
import env from "@lib/env";
import { getTranslations } from "next-intl/server";
import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },

  connectionTimeout: 5000,
  greetingTimeout: 5000,
});

export async function sendContactFormEmail(data: ContactFormData, locale: AppLocale): Promise<void> {
  // Load translations for the specified locale
  const t = await getTranslations({ locale, namespace: "Email" });

  const { name, email, message } = data;

  const subject = t("contactSubject", { name });
  const htmlContent = `
    <html>
      <body>
        <h2>${t("contactTitle")}</h2>
        <p>${t("contactIntro")}</p>
        <hr>
        <table>
          <tr><td><strong>${t("name")}:</strong></td><td>${name}</td></tr>
          <tr><td><strong>${t("email")}:</strong></td><td>${email}</td></tr>
          <tr><td><strong>${t("message")}:</strong></td><td>${message.replace(/\n/g, "<br>")}</td></tr>
        </table>
      </body>
    </html>
  `;
  const textContent = `${t("contactTitle")}\n\n${t("name")}: ${name}\n${t("email")}: ${email}\n${t("message")}: ${message}`;

  const mailOptions = {
    from: `"${env.SMTP_SENDER_NAME}" <${env.SMTP_SENDER_EMAIL}>`,
    to: env.CONTACT_FORM_RECIPIENT,
    subject: subject,
    text: textContent,
    html: htmlContent,
    replyTo: email,
  };

  await transporter.sendMail(mailOptions);
}
