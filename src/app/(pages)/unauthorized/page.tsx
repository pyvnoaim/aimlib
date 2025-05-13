'use client';

import ErrorPage from '@/components/error-pages';

export default function Unauthorized() {
  return (
    <ErrorPage
      code="403"
      title="Unauthorized Access"
      description="You do not have the necessary permissions to view this page."
    />
  );
}
