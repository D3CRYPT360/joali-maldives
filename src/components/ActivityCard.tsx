import Image from 'next/image';

interface ActivityCardProps {
  image: string;
  title: string;
  location?: string;
  price?: string;
}

export default function ActivityCard({ image, title, location, price }: ActivityCardProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden">
      <div className="aspect-[4/3] relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <h4 className="text-white text-xl font-medium">{title}</h4>
        {location && (
          <p className="text-white/80 text-sm">{location}</p>
        )}
        {price && (
          <div className="absolute top-4 right-4 bg-white/90 px-4 py-1 rounded-full">
            <span className="text-sm font-medium">${price}</span>
          </div>
        )}
      </div>
    </div>
  );
}
