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
            From: body.email,
            Subject: body.subject
          }
        }
      
      const sendBulkEmails = (emailMessageData: EmailMessageData): void => {
        emailsApi.emailsPost(emailMessageData).then((response) => {
            console.log('API called successfully.');
            console.log(response.data);
        }).catch((error) => {
            console.error(error);
        });
      };
      
      sendBulkEmails(emailMessageData)

      Response.redirect(`${emailConfig.site.base_url}${emailConfig.site.base_path}/contact-thank-you`, 301)
    } else {
        res.status(405).send('Method Not Allowed');
    }
}