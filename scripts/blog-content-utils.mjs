import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://tuweb-ai.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-tuwebai.png`;

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeForSlug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function slugifyFromFilename(filename) {
  return normalizeForSlug(path.basename(filename, path.extname(filename)));
}

function slugifyHeading(value) {
  return normalizeForSlug(value);
}

function stripMarkdown(value) {
  return value
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '$1')
    .replace(/^\s*[-*+]\s+\[.\]\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) {
    return { data: {}, content: markdown };
  }

  const endIndex = markdown.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { data: {}, content: markdown };
  }

  const rawFrontmatter = markdown.slice(4, endIndex);
  const content = markdown.slice(endIndex + 5);
  const data = {};

  for (const line of rawFrontmatter.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content };
}

function renderInline(value) {
  let rendered = escapeHtml(value);

  rendered = rendered.replace(/`([^`]+)`/g, '<code>$1</code>');
  rendered = rendered.replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, (_, label, url) => {
    const safeUrl = escapeHtml(url);
    const target = safeUrl.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${safeUrl}"${target}>${label}</a>`;
  });
  rendered = rendered.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/\*(.+?)\*/g, '<em>$1</em>');

  return rendered;
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  const headings = [];
  let paragraph = [];
  let unorderedList = [];
  let orderedList = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushUnorderedList = () => {
    if (unorderedList.length === 0) {
      return;
    }

    html.push(`<ul>${unorderedList.join('')}</ul>`);
    unorderedList = [];
  };

  const flushOrderedList = () => {
    if (orderedList.length === 0) {
      return;
    }

    html.push(`<ol>${orderedList.join('')}</ol>`);
    orderedList = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushUnorderedList();
    flushOrderedList();
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    if (trimmed === '---') {
      flushAll();
      html.push('<hr />');
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugifyHeading(text);
      headings.push({ level, text, id });
      html.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      continue;
    }

    const orderedListMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedListMatch) {
      flushParagraph();
      flushUnorderedList();
      orderedList.push(`<li>${renderInline(orderedListMatch[2])}</li>`);
      continue;
    }

    const taskListMatch = trimmed.match(/^[-*]\s+\[( |x)\]\s+(.*)$/i);
    if (taskListMatch) {
      flushParagraph();
      flushOrderedList();
      const checked = taskListMatch[1].toLowerCase() === 'x' ? ' checked' : '';
      unorderedList.push(
        `<li class="task-list-item"><input type="checkbox" disabled${checked} /><span>${renderInline(taskListMatch[2])}</span></li>`,
      );
      continue;
    }

    const unorderedListMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (unorderedListMatch) {
      flushParagraph();
      flushOrderedList();
      unorderedList.push(`<li>${renderInline(unorderedListMatch[1])}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushAll();

  return { html: html.join('\n'), headings };
}

function extractDescription(markdown) {
  const blocks = markdown.replace(/\r\n/g, '\n').split(/\n\s*\n/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed === '---') {
      continue;
    }

    const plain = stripMarkdown(trimmed);
    if (plain.length > 40) {
      return plain.slice(0, 160);
    }
  }

  return '';
}

function extractExcerpt(markdown) {
  return extractDescription(markdown);
}

function extractKeywords(markdown) {
  const match = markdown.match(/\*\*Especificaciones técnicas del artículo:\*\*([\s\S]*)$/i);
  if (!match) {
    return [];
  }

  return Array.from(match[1].matchAll(/"([^"]+)"/g), (keywordMatch) => keywordMatch[1].trim());
}

function normalizeBoolean(value) {
  return String(value).trim().toLowerCase() === 'true';
}

function normalizeKeywords(frontmatterKeywords, markdownKeywords) {
  if (frontmatterKeywords) {
    return String(frontmatterKeywords)
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  return markdownKeywords;
}

function buildSeoTitle(title, keywords, seoTitleOverride) {
  if (seoTitleOverride) {
    return seoTitleOverride;
  }

  const primaryKeyword = keywords[0];

  if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return `${primaryKeyword.charAt(0).toUpperCase()}${primaryKeyword.slice(1)}: ${title}`;
  }

  return title;
}

export function buildBlogPosts(docsDir) {
  const entries = fs.readdirSync(docsDir, { withFileTypes: true });
  const markdownFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'));
  const posts = [];

  for (const entry of markdownFiles) {
    const absolutePath = path.join(docsDir, entry.name);
    const rawContent = fs.readFileSync(absolutePath, 'utf8');
    const stats = fs.statSync(absolutePath);
    const { data: frontmatter, content } = parseFrontmatter(rawContent.replace(/\r\n/g, '\n'));
    const titleMatch = content.match(/^#\s+(.+)$/m);

    if (!titleMatch) {
      console.warn(`Se omite ${entry.name}: no tiene un H1 inicial.`);
      continue;
    }

    const slug = slugifyFromFilename(entry.name);
    const title = frontmatter.title?.trim() || titleMatch[1].trim();
    const keywords = normalizeKeywords(frontmatter.keywords, extractKeywords(content));
    const description = frontmatter.description?.trim() || extractDescription(content);
    const excerpt = frontmatter.excerpt?.trim() || extractExcerpt(content);
    const publishedAt = frontmatter.publishedAt?.trim() || stats.birthtime.toISOString();
    const updatedAt = frontmatter.updatedAt?.trim() || stats.mtime.toISOString();
    const seoTitle = buildSeoTitle(title, keywords, frontmatter.seoTitle?.trim());
    const canonicalUrl = `${SITE_URL}/blog/${slug}`;
    const ogImage = frontmatter.ogImage?.trim() || DEFAULT_OG_IMAGE;
    const { html, headings } = parseMarkdown(content);

    posts.push({
      slug,
      title,
      description,
      excerpt,
      publishedAt,
      updatedAt,
      readingTimeMinutes: Math.max(1, Math.round(stripMarkdown(content).split(/\s+/).length / 220)),
      html,
      markdown: content,
      headings,
      keywords,
      sourceFile: entry.name,
      seo: {
        title: seoTitle,
        description,
        canonicalUrl,
        ogImage,
        ogType: 'article',
      },
      noindex: frontmatter.noindex ? normalizeBoolean(frontmatter.noindex) : false,
    });
  }

  posts.sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());

  return posts;
}
