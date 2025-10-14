interface SaleCardProps {
  name: string;
  price: number;
  city: string;
  date: string;
  image: string;
}

export default function SaleCard({ name, price, city, date, image }: SaleCardProps) {
  return (
    <div className="border rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition">
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-green-700 font-bold">${price.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{city}</p>
        <p className="text-xs text-gray-400">📅 {date}</p>
      </div>
    </div>
  );
}
