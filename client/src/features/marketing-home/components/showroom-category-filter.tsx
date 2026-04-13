interface ShowroomCategoryFilterProps {
  activeCategory: string;
  categories: string[];
  categoryNames: Record<string, string>;
  onSelect: (category: string) => void;
}

export default function ShowroomCategoryFilter({
  activeCategory,
  categories,
  categoryNames,
  onSelect,
}: ShowroomCategoryFilterProps) {
  return (
    <div className="mb-10 flex justify-center">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`rounded-full px-4 py-2 text-sm ${
              activeCategory === category
                ? 'bg-[image:var(--gradient-brand)] text-white'
                : 'editorial-surface-card editorial-surface-card--interactive text-gray-400 hover:text-white'
            }`}
          >
            {categoryNames[category] || category}
          </button>
        ))}
      </div>
    </div>
  );
}
