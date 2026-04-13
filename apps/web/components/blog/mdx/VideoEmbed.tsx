export default function VideoEmbed({
  url,
  title = 'Video',
}: {
  url: string;
  title?: string;
}) {
  // Accept full YouTube URLs and convert to embed format
  let embedUrl = url;
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return (
    <figure className="my-8">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
        {title}
      </figcaption>
    </figure>
  );
}
