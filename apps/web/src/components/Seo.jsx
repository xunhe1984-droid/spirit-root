import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

export default function Seo({ title, description, image, type = 'website' }) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title}` : 'Spirit Root — Chinese Cultivation Culture & Xianxia';
  const desc =
    description ||
    'A personal knowledge website dedicated to Chinese cultivation culture, Xianxia fiction, Daoist philosophy, and Buddhist practice.';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={`https://spiritroot.online${pathname}`} />
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}
