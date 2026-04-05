import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  eventsEndpoint,
  formatEventDate,
  getFilterLabel,
  matchesFilter,
  quickFilters,
  slugifyFilter,
} from "../lib/eventFilters";

function FilterResults() {
  const { filterSlug } = useParams();
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
  }, [filterSlug]);

  const normalizedFilter = filterSlug || "all";
  const visibleEvents =
    normalizedFilter === "all"
      ? events
      : events.filter((eventItem) => matchesFilter(eventItem, normalizedFilter));
  const filterLabel = normalizedFilter === "all" ? "All events" : getFilterLabel(normalizedFilter);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <Link
            to="/"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Back to home
          </Link>

          <div className="mt-6 max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-emerald-300">
              Filtered Discovery
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              {filterLabel}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Browse a dedicated page for this event filter while keeping the same
              public-facing design system as the rest of the site.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/discover/all"
              className={`rounded-full border px-4 py-2 text-sm transition ${
                normalizedFilter === "all"
                  ? "border-emerald-400 bg-emerald-400/20 text-white"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              All events
            </Link>
            {quickFilters.map((filter) => {
              const slug = slugifyFilter(filter);

              return (
                <Link
                  key={filter}
                  to={`/discover/${slug}`}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    normalizedFilter === slug
                      ? "border-emerald-400 bg-emerald-400/20 text-white"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {filter}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Browse Results
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{filterLabel}</h2>
          </div>
          <p className="text-sm text-slate-400">
            {loading ? "Loading events..." : `${visibleEvents.length} matches found`}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {!loading && visibleEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center text-slate-400">
            No events matched this filter yet.
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleEvents.map((eventItem) => (
            <Link
              key={eventItem.id}
              to={`/events/${eventItem.id}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={eventItem.image}
                  alt={eventItem.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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
      </section>
    </main>
  );
}

export default FilterResults;
