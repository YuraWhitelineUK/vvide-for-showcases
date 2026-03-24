"use client";

const PRODUCTS = [
  {
    name: "ELATUS Era",
    category: "Fungicide",
    description: "Broad-spectrum disease control for cereals. Protects yield potential with long-lasting activity.",
    badge: "Best Seller",
  },
  {
    name: "AMISTAR Gold",
    category: "Fungicide",
    description: "Dual-action protection against key diseases in corn and soybeans. Fast uptake, rain-resistant.",
    badge: "New",
  },
  {
    name: "FORCE EVO",
    category: "Insecticide",
    description: "Advanced soil pest protection for corn. Controls wireworms and rootworms at planting.",
    badge: null,
  },
  {
    name: "MIRAVIS Duo",
    category: "Fungicide",
    description: "Next-generation disease management for specialty crops. Excellent preventive and curative action.",
    badge: "Recommended",
  },
];

interface ProductLandingProps {
  onRestart: () => void;
}

export default function ProductLanding({ onRestart }: ProductLandingProps) {
  return (
    <div className="absolute inset-0 z-30 bg-syngenta-bg overflow-y-auto">
      <div className="min-h-full px-6 py-10 max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-syngenta-magenta/10 border border-syngenta-magenta/20 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-syngenta-magenta" />
            <span className="text-syngenta-magenta text-xs font-medium uppercase tracking-wider">Syngenta</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Protect Your Crop
          </h2>
          <p className="text-white/50 text-sm">
            Based on your journey, these products can help you make the right decisions for your field.
          </p>
        </div>

        {/* Product Cards */}
        <div className="space-y-3 mb-8">
          {PRODUCTS.map((product, i) => (
            <div
              key={product.name}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-colors duration-200"
              style={{
                animation: `badge-cascade 0.4s ease-out ${0.2 + i * 0.1}s both`,
              }}
            >
              {product.badge && (
                <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  product.badge === "Best Seller"
                    ? "bg-syngenta-magenta/20 text-syngenta-magenta"
                    : product.badge === "New"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/10 text-white/60"
                }`}>
                  {product.badge}
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-syngenta-magenta/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-syngenta-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {product.category === "Fungicide" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-6.135c-.117-1.95-1.403-3.555-3.222-3.555H8.167c-1.819 0-3.105 1.605-3.222 3.555a23.91 23.91 0 01-1.152 6.135A24.093 24.093 0 0112 12.75z" />
                    )}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                    <span className="text-white/30 text-[10px] uppercase tracking-wider">{product.category}</span>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center space-y-3"
          style={{ animation: "badge-cascade 0.4s ease-out 0.7s both" }}
        >
          <button className="w-full py-3.5 px-8 rounded-full bg-syngenta-magenta text-white font-medium
                             hover:bg-syngenta-magenta-hover active:scale-95 transition-all duration-150
                             shadow-lg shadow-syngenta-magenta/30">
            Browse All Products
          </button>
          <button className="w-full py-3.5 px-8 rounded-full bg-white/5 text-white/60 font-medium
                             hover:bg-white/10 active:scale-95 transition-all duration-150
                             border border-white/10">
            Talk to an Expert
          </button>
          <button
            onClick={onRestart}
            className="text-white/30 text-xs hover:text-white/50 transition-colors pt-2"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}
