import rss from '@astrojs/rss'
import config from "../config/config.json"
import { getSinglePage } from "@lib/contentParser";

export const get = async (context) => {
  const posts = await getSinglePage("posts");
  return rss({
    title: config.site.title,
    description: config.site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: post.slug,
    })),
  })
}
