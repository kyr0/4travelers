import Email from 'vercel-email';
import config from "../src/config/config.json";
export const runtime = 'edge';

// config.contactinfo.name

export default async function handler(req, res) {
  const { body } = req;
  /*
    await Email.send({
        to: 'hello@4travelers.blog',
        from: 'me@example.com',
        subject: 'Hello World',
        html: '<h1>Hello World</h1>',
    });
    */
    
    if (req.method === 'POST') {
      let email = body.email;

      // Do whatever you need to do with the data here
      // (e.g., store in a database, perform some logic, etc.)

      // Respond to the client
      res.status(200).send('Form submitted successfully!' + email + ':' + config.contactinfo.name);
    } else {
        // Handle any other HTTP methods
        res.status(405).send('Method Not Allowed');
    }

    // Response.redirect(`${config.site.base_url}${config.site.base_path}/contact-thank-you`, 301)

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    });
}