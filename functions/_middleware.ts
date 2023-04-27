import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";
import config from "../src/config/config.json";


export const onRequest = mailChannelsPlugin({
  personalizations: [
    {
      to: [{ name: config.contactinfo.name, email: config.contactinfo.email }],
    },
  ],
  from: {
    name: config.contactinfo.name,
    email: config.contactinfo.email,
  },
  respondWith: () => Response.redirect(`${config.site.base_url}${config.site.base_path}/contact-thank-you`, 301)
});
