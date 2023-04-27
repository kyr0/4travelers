
import { getCollection } from "astro:content";

export const getCollectionEntries = async <T extends "about" | "authors" | "pages" | "posts">(collection: T) => {
  const allPage = await getCollection<T>(collection);

  // @ts-ignore
  const removeIndex = allPage.filter((data) => data.id !== "_index.md");
  // @ts-ignore
  const removeDrafts = removeIndex.filter((data) => !data.draft);

  return removeDrafts;
};
