import emailConfig from "../src/config/config.json";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Configuration, EmailsApi, EmailMessageData } from '@elasticemail/elasticemail-client-ts-axios';

const config = new Configuration({
  apiKey: process.env.ELASTIC_MAIL_API_KEY
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body } = req;
    
    if (req.method === 'POST') {
      const emailsApi = new EmailsApi(config);

      const emailMessageData: EmailMessageData = {
          Recipients: [
            { 
              Email: emailConfig.contactinfo.email
            }
          ],
          Content: {
            Body: [
              {
                ContentType: "PlainText",
                Charset: "utf-8",
                Content: body.message + "\n\n by " + body.name
              }
            ],
            From: emailConfig.contactinfo.email,
            ReplyTo: body.email,
            Subject: body.subject
          }
        }

      await emailsApi.emailsPost(emailMessageData)

      res.redirect(`${emailConfig.site.base_url}${emailConfig.site.base_path}/contact-thank-you`)
    } else {
      res.status(405).send('Method Not Allowed');
    }
}