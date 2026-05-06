import fs from "fs"
import path from "path"

import MarkdownIt from "markdown-it"

const md = new MarkdownIt({ html: true })

const wrapHtml = (markdown) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.css" integrity="sha512-LX/J+iRwkfRqaipVsfmi2B1S7xrqXNHdTb6o4tWe2Ex+//EN3ifknyLIbX5f+kC31zEKHon5l9HDEwTQR1H8cg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
    .markdown-body {
      padding: 50px 100px;
    }
    tr, td {
      color: var(--color-fg-default);
    }
    @media (max-width: 768px) {
      .markdown-body {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="markdown-body">${md.render(markdown)}</div>
</body>
</html>
`

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const writeHtml = (sourcePath, targetPath) => {
  const markdown = fs.readFileSync(sourcePath, "utf8").toString()
  ensureDir(path.dirname(targetPath))
  fs.writeFileSync(targetPath, wrapHtml(markdown), "utf8")
}

const main = () => {
  const outputDir = path.resolve("m3u")
  const listDir = path.join(outputDir, "list")

  if (!fs.existsSync(outputDir)) {
    return
  }

  const readmePath = path.join(outputDir, "README.md")
  if (fs.existsSync(readmePath)) {
    writeHtml(readmePath, path.join(outputDir, "index.html"))
  }

  if (fs.existsSync(listDir)) {
    for (const file of fs.readdirSync(listDir)) {
      if (file.endsWith(".md")) {
        const sourcePath = path.join(listDir, file)
        const targetPath = path.join(listDir, file.replace(/\.md$/, ".html"))
        writeHtml(sourcePath, targetPath)
      }
    }
  }
}

main()
