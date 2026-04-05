import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  eventsEndpoint,
  formatEventDate,
  quickFilters,
  slugifyFilter,
} from "../lib/eventFilters";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(eventsEndpoint);

        if (!response.ok) {
          throw new Error("Unable to load events.");
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError("Could not connect to the events server. Start json-server on port 3001.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const featuredEvents = events.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <div className="flex flex-col gap-6">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-emerald-300">
                Discover Events
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
                Explore what&apos;s happening in Lagos
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Browse standout experiences, community meetups, concerts, workshops,
                and city moments curated for a lively Lagos events homepage.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_auto]">
              <input
                type="text"
                placeholder="Search events, categories, or venues"
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-sm text-slate-400 outline-none"
              />
              <input
                type="text"
                placeholder="Lagos, Nigeria"
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-sm text-slate-400 outline-none"
              />
              <Link
                to="/discover/all"
                className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Find events
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {quickFilters.map((filter) => (
                <Link
                  key={filter}
                  to={`/discover/${slugifyFilter(filter)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  {filter}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
                Quick Picks
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickFilters.map((filter) => (
                  <Link
                    key={filter}
                    to={`/discover/${slugifyFilter(filter)}`}
                    className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                  >
                    {filter}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
                Browse
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <p>Conferences</p>
                <p>Festivals</p>
                <p>Workshops</p>
                <p>Night outings</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
                Price
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <p>Free</p>
                <p>Paid</p>
                <p>Premium</p>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                Trending Now
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Events in Lagos</h2>
            </div>
            <p className="text-sm text-slate-400">
              {loading ? "Loading events..." : `${events.length} events available`}
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredEvents.map((eventItem) => (
              <Link
                key={eventItem.id}
                to={`/events/${eventItem.id}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={eventItem.image}
                    alt={eventItem.title}
                    className="h-full w-full object-cover transition duration-500 {/*group-hover:scale-105*/}"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    {eventItem.category}
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <p className="text-sm font-medium text-cyan-300">
                    {formatEventDate(eventItem.date)} at {eventItem.time || "TBA"}
                  </p>
                  <h3 className="text-xl font-semibold text-white transition group-hover:text-emerald-300">
                    {eventItem.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-300">
                    {eventItem.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
                    <span>
                      {eventItem.location} | {eventItem.venue}
                    </span>
                    <span className="font-semibold text-white">{eventItem.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!loading && featuredEvents.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-slate-400">
              No events found yet.
            </div>
          ) : null}

          <section className="mt-12 rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/12 via-white/5 to-emerald-500/12 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                  Editor&apos;s Pick
                </p>
                <h2 className="mt-3 text-3xl font-semibold">
                  Plan your next Lagos weekend in one scroll
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  From waterfront concerts and founder brunches to outdoor fitness
                  runs and art-house evenings, this homepage is set up to feel full,
                  polished, and ready for real event data later.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-3xl font-bold text-emerald-300">{events.length}</p>
                  <p className="mt-2 text-sm text-slate-400">Live sample events</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-3xl font-bold text-cyan-300">8</p>
                  <p className="mt-2 text-sm text-slate-400">Quick filter paths</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-3xl font-bold text-white">Lagos</p>
                  <p className="mt-2 text-sm text-slate-400">City-wide experiences</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Home;
