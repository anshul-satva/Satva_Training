import { Empty, Result, Skeleton, Spin } from 'antd';

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spin size="large" />
    </div>
  );
}

export function CardLoader() {
  return <Skeleton active paragraph={{ rows: 4 }} />;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <Empty description={<span><strong>{title}</strong><br />{description}</span>} />;
}

export function ErrorState({ title, subtitle }: { title: string; subtitle?: string }) {
  return <Result status="error" title={title} subTitle={subtitle} />;
}
