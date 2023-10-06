import nodemailer from 'nodemailer';
import emailConfig from "../src/config/config.json";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { body } = req;
    
    if (req.method === 'POST') {

      const transport = nodemailer.createTransport('direct')

      const mailOptions = {
          to: emailConfig.contactinfo.email,
          from: body.email,
          subject: body.subject,
          text: body.message + "\n\n by " + body.name,
      }

      let info = await transport.sendMail(mailOptions);
      console.log('Message sent:', info.response);

      Response.redirect(`${emailConfig.site.base_url}${emailConfig.site.base_path}/contact-thank-you`, 301)
    } else {
        res.status(405).send('Method Not Allowed');
    }
}