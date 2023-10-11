import { buildForBrowser } from "@jsheaven/easybuild"

await buildForBrowser({
    entryPoint: './src/sw.ts',
    outfile: '.vercel/output/static/sw.js',
})