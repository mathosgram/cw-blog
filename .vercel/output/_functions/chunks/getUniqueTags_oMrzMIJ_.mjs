import { s as slugifyStr } from "./slugify_Bj2zK5b-.mjs";
import { p as postFilter } from "./postFilter_C9ULwrNi.mjs";
const getUniqueTags = (posts) => {
  const tags = posts.filter(postFilter).flatMap((post) => post.data.tags).map((tag) => ({ tag: slugifyStr(tag), tagName: tag })).filter(
    (value, index, self) => self.findIndex((tag) => tag.tag === value.tag) === index
  ).sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
  return tags;
};
export {
  getUniqueTags as g
};
