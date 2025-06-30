import ErrorPage from '@/components/errorPages';

export default function ForbiddenError() {
  return (
    <ErrorPage
      code="403"
      title="Forbidden Error"
      description="You are not authorized to access this resource."
    />
  );
}
