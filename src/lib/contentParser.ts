
import { getCollection } from "astro:content";

export const getSinglePage = async (collection: any) => {
  const allPage = await getCollection(collection);
  const removeIndex = allPage.filter((data) => data.id !== "_index.md");
  const removeDrafts = removeIndex.filter((data) => !data.draft);

  return removeDrafts;
};
