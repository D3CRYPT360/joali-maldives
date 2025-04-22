'use client';
import Image from 'next/image';

const dummyRooms = [
  {
    id: 1,
    name: 'Ocean Villa',
    type: 'Villa',
    price: 420,
    image: '/images/room1.jpg',
  },
  {
    id: 2,
    name: 'Lagoon Suite',
    type: 'Suite',
    price: 350,
    image: '/images/room2.jpg',
  },
  {
    id: 3,
    name: 'Beach Bungalow',
    type: 'Bungalow',
    price: 280,
    image: '/images/room3.jpg',
  },
  {
    id: 4,
    name: 'Garden Retreat',
    type: 'Retreat',
    price: 200,
    image: '/images/room4.jpg',
  },
];

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#5B2415] mb-2">Our Rooms</h1>
        <p className="text-lg text-center text-[#8B4513] mb-10">Choose from a variety of luxury rooms for your perfect stay</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dummyRooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform">
              <div className="relative h-48 w-full">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onError={e => (e.currentTarget.src = 'https://source.unsplash.com/featured/?hotel,room')}
                />
              </div>
              <div className="p-6 flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-[#5B2415]">{room.name}</h2>
                <p className="text-sm text-[#8B4513]">{room.type}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-[#152C5B]">${room.price}/night</span>
                  <button className="bg-[#8B4513] hover:bg-[#5B2415] text-white px-4 py-2 rounded-lg text-sm transition">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
