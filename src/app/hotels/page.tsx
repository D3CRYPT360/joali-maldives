'use client';
import ActivityCard from "@/components/ActivityCard";

const dummyHotels = [
  {
    id: 1,
    name: 'Ocean View Hotel',
    type: 'Luxury',
    price: 420,
    image: '/images/room1.jpg',
  },
  {
    id: 2,
    name: 'Lagoon Resort',
    type: 'Resort',
    price: 350,
    image: '/images/room2.jpg',
  },
  {
    id: 3,
    name: 'Beachside Hotel',
    type: 'Boutique',
    price: 280,
    image: '/images/room3.jpg',
  },
  {
    id: 4,
    name: 'Garden Inn',
    type: 'Inn',
    price: 200,
    image: '/images/room4.jpg',
  },
];

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3f1] to-[#f7f5f3] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#5B2415] mb-2">Our Hotels</h1>
        <p className="text-lg text-center text-[#8B4513] mb-10">Choose from a variety of luxury hotels for your perfect stay</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dummyHotels.map(hotel => (
            <ActivityCard
              key={hotel.id}
              image={hotel.image}
              title={hotel.name}
              location={hotel.type}
              price={hotel.price?.toString()}
              buttonLabel="Book Hotel"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
