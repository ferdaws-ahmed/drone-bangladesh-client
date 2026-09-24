import AboutPage from '@/components/about/AboutPage';

export const metadata = {
  title: 'About Us | Drone Bangladesh — Official DJI Authorized Dealer',
  description:
    'Learn about Drone Bangladesh — the official DJI authorized dealer in Bangladesh. Genuine products, certified technicians, nationwide delivery, and expert after-sales support.',
  openGraph: {
    title: 'About Us | Drone Bangladesh',
    description:
      'Bangladesh\'s most trusted source for genuine DJI drones, handheld cameras, and professional maintenance services.',
    type: 'website',
  },
};

export default function AboutUsPage() {
  return <AboutPage />;
}
