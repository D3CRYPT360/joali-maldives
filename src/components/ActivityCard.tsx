import Image from "next/image";

interface ActivityCardProps {
  image: string;
  title: string;
  location?: string;
  price?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function ActivityCard({
  image,
  title,
  location,
  price,
  buttonLabel = "Book Now",
  onButtonClick,
}: ActivityCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={(e) =>
            (e.currentTarget.src =
              "https://source.unsplash.com/featured/?hotel,activity")
          }
        />
      </div>
      <div className="p-6 flex flex-col gap-2 flex-1">
        <h2 className="text-xl font-semibold text-[#5B2415]">{title}</h2>
        {location && <p className="text-sm text-[#8B4513]">{location}</p>}
        <div className="mt-2 flex justify-between items-center">
          {price && (
            <span className="text-lg font-bold text-[#152C5B]">${price}</span>
          )}
          <button
            className="bg-[#8B4513] hover:bg-[#5B2415] text-white px-4 py-2 rounded-lg text-sm transition"
            onClick={onButtonClick}
            type="button"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
