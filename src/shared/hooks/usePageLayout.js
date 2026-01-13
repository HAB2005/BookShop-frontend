import { useEffect, useMemo } from 'react';
import { useLayout } from '../../app/providers';

export const usePageLayout = ({ title, breadcrumbs }) => {
  const { updateLayout } = useLayout();

  // Memoize breadcrumbs để tránh re-render không cần thiết
  const memoizedBreadcrumbs = useMemo(() => breadcrumbs, [JSON.stringify(breadcrumbs)]);

  useEffect(() => {
    updateLayout({ title, breadcrumbs: memoizedBreadcrumbs });
  }, [title, memoizedBreadcrumbs, updateLayout]);
};