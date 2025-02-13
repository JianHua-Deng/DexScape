import { useState } from "react";
import { getCoverUrl } from "../../utils/mangaDexApi";

export default function SliderItem({ manga }) {
    const [isLoading, setIsLoading] = useState(true);
    const coverUrl = getCoverUrl(manga);

    return (
        <div className="relative h-[450px] w-full overflow-hidden">
            {/* Background image with blur effect */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/30 z-10" />
                <img 
                    src={coverUrl}
                    alt="background"
                    className="w-full h-full object-cover"
                    onLoad={() => setIsLoading(false)}
                />
            </div>

            {/* Content overlay */}
            <div className="relative z-20 h-full flex items-center px-8 md:px-16 gap-8">
                {/* Cover image */}
                <div className="flex-shrink-0">
                    <img 
                        src={coverUrl}
                        alt={manga.attributes?.title?.en || "Manga cover"}
                        className="w-48 h-72 object-cover rounded shadow-lg"
                    />
                </div>

                {/* Manga details */}
                <div className="flex flex-col text-white max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">
                        {manga.attributes?.title?.en}
                    </h2>
                    <div className="flex gap-2 mb-4">
                        {manga.attributes?.tags?.map((tag, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 bg-white/20 rounded-full text-sm"
                            >
                                {tag.attributes?.name?.en}
                            </span>
                        )).slice(0, 4)}
                    </div>
                    <p className="line-clamp-3 text-lg text-gray-200">
                        {manga.attributes?.description?.en}
                    </p>
                </div>
            </div>
        </div>
    );

}