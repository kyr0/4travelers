import Email from 'vercel-email';
import emailConfig from "../src/config/config.json";
import type { VercelRequest, VercelResponse } from '@vercel/node';
 
export const config = {
  runtime: 'edge', 
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body } = req;
    
    if (req.method === 'POST') {

      await Email.send({
          to: emailConfig.contactinfo.email,
          from: body.email,
          subject: body.subject,
          text: body.message + "\n\n by " + body.name,
      });

      Response.redirect(`${emailConfig.site.base_url}${emailConfig.site.base_path}/contact-thank-you`, 301)
    } else {
        res.status(405).send('Method Not Allowed');
    }
}