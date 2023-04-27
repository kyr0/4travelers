import type { APIRoute } from 'astro';

import { getCollectionEntries } from "@lib/contentParser";

export const prerender = true

export const get: APIRoute = async () => {

  // Retrieve all articles
  const posts = await getCollectionEntries("posts");

  // List of items to search in
  const searchList = posts.map((item) => ({
    slug: item.slug,
    data: item.data,
    content: item.body,
  }));


  return {
    body: JSON.stringify({
      searchList,
    }),
  }
}
