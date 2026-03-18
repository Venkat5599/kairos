'use client';

interface MarketplaceFiltersProps {
  selectedCategory: string;
  selectedDifficulty: string;
  onCategoryChange: (category: string) => void;
  onDifficultyChange: (difficulty: string) => void;
}

export default function MarketplaceFilters({
  selectedCategory,
  selectedDifficulty,
  onCategoryChange,
  onDifficultyChange,
}: MarketplaceFiltersProps) {
  const categories = ['all', 'transfer', 'cross-chain', 'staking', 'governance', 'defi'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 uppercase font-orbitron self-center">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 rounded text-xs font-orbitron uppercase transition-all ${
              selectedCategory === cat
                ? 'bg-cyber-blue text-white'
                : 'bg-black/40 text-gray-400 hover:text-white border border-cyber-blue/20 hover:border-cyber-blue/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 uppercase font-orbitron self-center">Level:</span>
        {difficulties.map((diff) => (
          <button
            key={diff}
            onClick={() => onDifficultyChange(diff)}
            className={`px-3 py-1 rounded text-xs font-orbitron uppercase transition-all ${
              selectedDifficulty === diff
                ? 'bg-cyber-blue text-white'
                : 'bg-black/40 text-gray-400 hover:text-white border border-cyber-blue/20 hover:border-cyber-blue/40'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>
    </div>
  );
}
