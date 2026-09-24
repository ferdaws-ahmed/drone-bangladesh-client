import Footer from '@/components/common/footer/Footer';
import './globals.css';
import Navbar from '@/components/common/navbar/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { CartWishlistProvider } from '@/context/CartWishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import TopBar from '@/components/common/navbar/TopBar';

export const metadata = {
  title: 'Drone Bangladesh - Official DJI Dealer',
  description: 'Pixel-perfect e-commerce platform for drones, handhelds, and accessories.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <ToastProvider>
          <AuthProvider>
            <CartWishlistProvider>
              <TopBar></TopBar>
              {/* Global Navbar */}
              <Navbar />
              
              {/* Main Content */}
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </CartWishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}