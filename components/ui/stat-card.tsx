type Props = {
  title: string;
  value: number;
};

export function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}