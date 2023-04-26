import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

/** Estimated Reading time */
export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)

    data.astro.frontmatter.estReadingTime = readingTime.minutes
  }
}
