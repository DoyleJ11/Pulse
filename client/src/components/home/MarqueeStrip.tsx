export function MarqueeStrip({ items }: { items: string[] }) {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="border-y-2 border-black bg-section-golden py-3.5">
      <div className="home-marquee-track flex w-max items-center gap-12 whitespace-nowrap text-lg font-black uppercase tracking-wide">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-12">
            <span>{item}</span>
            <span
              className="h-2.5 w-2.5 rounded-full bg-black"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
