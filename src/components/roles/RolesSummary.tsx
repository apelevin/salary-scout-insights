
interface RolesSummaryProps {
  count: number;
}

const RolesSummary = ({ count }: RolesSummaryProps) => {
  return (
    <div className="text-sm text-gray-500">
      Всего ролей: {count}
    </div>
  );
};

export default RolesSummary;
