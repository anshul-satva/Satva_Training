import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { getErrorMessage } from '../../services/api';
import { projectService } from '../../services/projects';
import { useSelectedOrganization } from './shared';

export function BoardRedirectPage() {
  const navigate = useNavigate();
  const { activeOrganizationId } = useSelectedOrganization();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFirstBoard = async () => {
      if (!activeOrganizationId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const projects = await projectService.list(activeOrganizationId);
        if (projects[0]?.id) {
          navigate(`/projects/${projects[0].id}/board`, { replace: true });
          return;
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void loadFirstBoard();
  }, [activeOrganizationId, navigate]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to open board" subtitle={error} />;
  return <EmptyState title="No board available" description="Create a project first to open a board." />;
}
