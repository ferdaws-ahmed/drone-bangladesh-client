'use client';

export default function ViewMoreButton({ targetId }) {
  const handleScroll = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button 
      onClick={handleScroll}
      className="text-xs font-bold text-[#E11D48] hover:underline mt-1 inline-block cursor-pointer"
    >
      View More Info →
    </button>
  );
}