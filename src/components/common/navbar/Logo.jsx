import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-start gap-3 shrink-0 group">
      
      <div className="relative w-48 h-16 flex items-center justify-start">
        <Image
          src="/images/logo.png" 
          alt="Drone Bangladesh Logo"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </Link>
  );
}