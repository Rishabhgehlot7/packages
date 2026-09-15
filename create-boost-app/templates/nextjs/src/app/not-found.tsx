import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h1 className="text-8xl md:text-9xl font-black text-gray-200 select-none tracking-widest">
        404
      </h1>
      <div className="space-y-4 -mt-8 relative z-10 flex flex-col items-center max-w-md">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">
          Page Not Found
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl px-6 py-3 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
          >
            Return Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto rounded-xl px-6 py-3 border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
