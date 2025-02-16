import { Link } from "react-router-dom";

export default function SectionTitle({viewAllLink, title}) {

  return (
    <div className="w-full flex justify-between mb-6">
      <h2 className="font-bold text-2xl text-gray-700">
        {title}
      </h2>
      <Link
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        to={viewAllLink}
      >
        View All →
      </Link>
    </div>
  );
}