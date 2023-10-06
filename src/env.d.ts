/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import type { DirectoryRuntime } from '@astrojs/cloudflare';
import type { CookieManager } from "@lib/utils/CookieManager"

declare global {
  interface Window {
    CM: CookieManager;
  }
}

declare namespace App {
  interface Locals extends DirectoryRuntime {
    user: {
      name: string;
      surname: string;
    };
  }
}