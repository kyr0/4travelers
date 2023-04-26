import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest = mailChannelsPlugin({
  personalizations: [
    {
      to: [{ name: "Aron Homberg", email: "info@aron-homberg.de" }],
    },
  ],
  from: {
    name: "Aron Homberg",
    email: "info@aron-homberg.de",
  },
  respondWith: () => {
    return new Response(
      `Thank you for submitting your enquiry. A member of the team will be in touch shortly.`
    );
  },
});
