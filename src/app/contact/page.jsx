import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us | Drone Bangladesh - Official DJI Dealer',
  description:
    'Get in touch with Drone Bangladesh. Call, email, or visit our showroom for expert advice on drones, handheld cameras, and accessories. 24/7 customer support.',
  openGraph: {
    title: 'Contact Us | Drone Bangladesh',
    description:
      'Reach out to Drone Bangladesh for inquiries about DJI products, orders, warranty, and expert support.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
