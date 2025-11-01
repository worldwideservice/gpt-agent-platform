const AgentsLoading = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="h-12 w-full max-w-xl animate-pulse rounded bg-gray-100" />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="space-y-4 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-5 w-5 animate-pulse rounded bg-gray-100" />
              <div className="h-5 flex-1 animate-pulse rounded bg-gray-100" />
              <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentsLoading;
