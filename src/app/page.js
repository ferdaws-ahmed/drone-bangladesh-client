import HeroSection from '@/components/home/HeroSection';
import BrandBanner from '@/components/home/BrandBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import VisitOurStores from '@/components/home/VisitOurStores';
import ProductSection from '@/components/home/ProductSection';
import HonorableCustomers from '@/components/home/HonorableCustomers';

export default function HomePage() {
  return (
    <main className="w-full">

      {/* ── 1. Hero Slider ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. Brand Strip  (DJI / DJI Enterprise) ─────────────────── */}
      <BrandBanner />

      {/* ── 3. Featured Categories  (dynamic, isFeatured: true) ─────── */}
      <FeaturedCategories />

      {/* ── 4. Visit Our Stores strip  (compact, static) ────────────── */}
      <VisitOurStores />

      {/* ── 5. New Arrivals ─────────────────────────────────────────── */}
      <ProductSection
        flag="isNewArrival"
        title="New Arrivals"
        viewAllHref="/drones"
        limit={10}
        bgColor="bg-white"
      />

      {/* ── 6. DJI Drones ───────────────────────────────────────────── */}
      <ProductSection
        flag="isDjiDrone"
        title="DJI Drones"
        viewAllHref="/drones"
        limit={10}
        bgColor="bg-slate-50"
      />

      {/* ── 7. Honorable Customers slider ───────────────────────────── */}
      <HonorableCustomers />

      {/* ── 8. Personal Drones ──────────────────────────────────────── */}
      <ProductSection
        flag="isPersonalDrone"
        title="Personal Drones"
        viewAllHref="/drones"
        limit={10}
        bgColor="bg-white"
      />

      {/* ── 9. Beginner Drones ──────────────────────────────────────── */}
      <ProductSection
        flag="isBeginnerDrone"
        title="Beginner Drones"
        viewAllHref="/drones"
        limit={10}
        bgColor="bg-slate-50"
      />

    </main>
  );
}
