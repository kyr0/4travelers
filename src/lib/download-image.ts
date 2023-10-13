import { createHash } from "crypto";
import { promises as fs } from "fs";
import { fileTypeFromBuffer } from "file-type";
import { IS_PRODUCTION_BUILD } from "@config/variables";

const IMAGES_PATH = "./src/images/";
const POSTS_PATH = `${IMAGES_PATH}posts/`;
const POST_RETURN_PATH = "/images/posts/";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch (error) {
    return false; // File doesn't exist or some other error
  }
}

export async function downloadImage(
  src: string,
  width?: number,
  height?: number
): Promise<string> {
  const hash = createHash("sha256").update(src).digest("hex");
  const filePathPrefix = `${hash}_${width}_${height}`;

  const files = await fs.readdir(POSTS_PATH);
  const found = files.find((f) => f.startsWith(filePathPrefix));
  if (found && !IS_PRODUCTION_BUILD) {
    console.log(`cached img ${POST_RETURN_PATH}${found}`);
    return `${POST_RETURN_PATH}${found}`;
  }

  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${src}`);
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const fileType = await fileTypeFromBuffer(buffer);
    const filename = `${filePathPrefix}.${fileType?.ext}`;
    const filepath = `${POSTS_PATH}${filename}`;

    if (!(await fileExists(filepath))) {
      await fs.writeFile(filepath, buffer, { encoding: "binary" });
      console.log(`Downloaded image saved as ${filepath}`);
    }
    return `${POST_RETURN_PATH}${filepath}`;
  } catch (e) {
    if (IS_PRODUCTION_BUILD) {
      throw e;
    }
    return `${POST_RETURN_PATH}image_not_found.jpg`;
  }
}
