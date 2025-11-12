// src/components/ui/SectionLoader.tsx
const SectionLoader = () => {
  return (
    <div className="w-full h-96 flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
};

export default SectionLoader;