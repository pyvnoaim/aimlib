'use client';
import ErrorPage from '@/components/errorPages';

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      description="Oops! The page you are looking for does not exist."
    />
  );
}
