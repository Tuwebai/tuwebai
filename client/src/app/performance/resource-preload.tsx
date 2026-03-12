import React from 'react';
import { Helmet } from 'react-helmet';

interface ResourceProps {
  href: string;
  as: string;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface ResourcePreloadProps {
  resources: ResourceProps[];
}

export const ResourcePreload: React.FC<ResourcePreloadProps> = ({ resources }) => {
  return (
    <Helmet>
      {resources.map((resource, index) => (
        <link
          key={index}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin={resource.crossOrigin}
        />
      ))}
    </Helmet>
  );
};

export default ResourcePreload;
