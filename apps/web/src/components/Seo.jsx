import React from 'react';
import { Helmet } from 'react-helmet';

export default function Seo({ title, description, image, type = 'website' }) {
  const fullTitle = title ? `${title}` : 'Spirit Root — Chinese Cultivation Culture & Xianxia';
  const desc =
    description ||
    'A personal knowledge website dedicated to Chinese cultivation culture, Xianxia fiction, Daoist philosophy, and Buddhist practice.';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}
