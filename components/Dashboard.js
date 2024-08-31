import MonthlyCalendar from './MonthlyCalendar';

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Monthly Calendar</h2>
        <MonthlyCalendar />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Spotify Playlist</h2>
        <iframe 
          style={{borderRadius: "12px"}} 
          src="https://open.spotify.com/embed/playlist/5I4bxWhUVi9mj1Qpcb6CC5?utm_source=generator&theme=0" 
          width="100%" 
          height="500" 
          frameBorder="0" 
          allowFullScreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
