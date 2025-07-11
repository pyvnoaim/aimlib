'use client';

import ErrorPage from '@/components/errorPages';

export default function ServerError() {
  return (
    <ErrorPage
      code="500"
      title="Server Error"
      description="Something went wrong on our end. Please try again later."
    />
  );
}
