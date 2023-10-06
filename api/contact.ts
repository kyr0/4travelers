import Email from 'vercel-email';
import config from "../src/config/config.json";
export const runtime = 'edge';

// config.contactinfo.name

export default async function handler(req, res) {
  const { body } = req;
    
    if (req.method === 'POST') {

      console.log('test', {
          to: config.contactinfo.email,
          from: body.email,
          subject: body.subject,
          text: body.message + "\n\n by " + body.name,
      })

      await Email.send({
          to: config.contactinfo.email,
          from: body.email,
          subject: body.subject,
          text: body.message + "\n\n by " + body.name,
      });

      Response.redirect(`${config.site.base_url}${config.site.base_path}/contact-thank-you`, 301)
    } else {
        res.status(405).send('Method Not Allowed');
    }
}