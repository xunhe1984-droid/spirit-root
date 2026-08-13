// Helper to pick the bilingual field of an article for the current language.
// Falls back to the Chinese value when the English field is empty/missing,
// so older articles without translations still display normally.

export function pickField(article, base, lang) {
  const en = article && article[base + 'En'];
  if (lang === 'en' && en && String(en).trim() !== '') return en;
  return article ? article[base] : '';
}

export function localizedArticle(article, lang) {
  if (!article) return article;
  return {
    ...article,
    title: pickField(article, 'title', lang),
    category: pickField(article, 'category', lang),
    tags: pickField(article, 'tags', lang),
    excerpt: pickField(article, 'excerpt', lang),
    overview: pickField(article, 'overview', lang),
    body: pickField(article, 'body', lang),
  };
}

export function splitTags(tags) {
  return (tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
