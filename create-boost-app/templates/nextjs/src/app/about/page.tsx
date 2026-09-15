import { ShieldCheck, Sparkles, HeartHandshake, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full">
          Our Story
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-950 mt-4 mb-6 leading-tight">
          Crafting Premium D2C Experiences for Modern India
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          We believe that everyday essentials should blend relentless craftsmanship, sustainable engineering, and honest pricing. Founded with a mission to deliver direct-to-consumer excellence.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Artisanal Quality</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Every product is designed with obsessive attention to raw materials and finishing standards.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Express Pan-India Delivery</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Connected directly with tier-1 logistics to deliver across 27,000+ verified Indian pincodes.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Comprehensive Warranty</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            We stand by our work with hassle-free digital warranty registration and rapid claim replacement.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Customer First</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Direct human customer service via WhatsApp and Phone with zero chatbots or runarounds.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              To eliminate traditional retail markups and middle-layers, bringing international-grade products directly from makers to your door.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Our Vision</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering consumers with conscious, high-utility lifestyle goods backed by transparent guarantees and peerless support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
