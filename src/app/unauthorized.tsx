import ErrorPage from '@/components/errorPages';

export default function UnauthorizedError() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized Error"
      description="Please log in to access this page."
    />
  );
}
