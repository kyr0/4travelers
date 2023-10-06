import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { fileTypeFromBlob, fileTypeFromBuffer } from 'file-type';

const IMAGES_PATH = './src/images/posts/';

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true; // File exists
    } catch (error) {
        return false; // File doesn't exist or some other error
    }
}

export async function downloadImage(src: string, width?: number, height?: number): Promise<string> {
const hash = createHash('sha256').update(src).digest('hex');

  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${src}`);
  }

  const blob = await response.blob()
  const buffer = Buffer.from(await (blob).arrayBuffer())
  const fileType = await fileTypeFromBuffer(buffer)
  const filename = `${hash}_${width}_${height}.${fileType?.ext}`;
  const filepath = `${IMAGES_PATH}${filename}`

  if (!(await fileExists(filepath))) { 
    await fs.writeFile(filepath, buffer, { encoding: 'binary' });
    console.log(`Downloaded image saved as ${filepath}`);
  }
  return filepath
}