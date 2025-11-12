export default function ProductLoading() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb loading */}
        <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery loading */}
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          
          {/* Product info loading */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
