import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const eventsEndpoint = "http://localhost:3001/events";

function formatLongDate(dateValue, timeValue) {
  if (!dateValue) {
    return timeValue ? `Time: ${timeValue}` : "Date to be announced";
  }

  const formattedDate = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));

  return timeValue ? `${formattedDate} at ${timeValue}` : formattedDate;
}

function EventDetails() {
  const { id } = useParams();
  const [eventItem, setEventItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${eventsEndpoint}/${id}`);

        if (!response.ok) {
          throw new Error("Unable to load event.");
        }

        const data = await response.json();
        setEventItem(data);
      } catch (fetchError) {
        setError("Could not load this event. Make sure json-server is running on port 3001.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-8">
          Loading event details...
        </div>
      </main>
    );
  }

  if (error || !eventItem) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-rose-400/30 bg-rose-400/10 p-8">
          <p className="text-lg font-semibold">Event unavailable</p>
          <p className="mt-3 text-sm text-rose-100">{error || "The event could not be found."}</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <Link
            to="/"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Back to events
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
                <div className="relative h-[360px] overflow-hidden">
                  <img
                    src={eventItem.image}
                    alt={eventItem.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
                  <div className="absolute left-6 top-6 rounded-full bg-slate-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                    {eventItem.category}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
                  About this event
                </p>
                <h1 className="mt-4 text-3xl font-bold md:text-5xl">{eventItem.title}</h1>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  {eventItem.description}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Date</p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {formatLongDate(eventItem.date, eventItem.time)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Venue</p>
                    <p className="mt-3 text-lg font-semibold text-white">{eventItem.venue}</p>
                    <p className="mt-1 text-sm text-slate-400">{eventItem.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
                  Tickets
                </p>
                <p className="mt-4 text-4xl font-bold">{eventItem.price}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Reserve your spot for one of Lagos&apos; most talked-about upcoming
                  events. Ideal for guests looking for a premium, polished city
                  experience.
                </p>
                <button
                  type="button"
                  className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Reserve a ticket
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                  Hosted by
                </p>
                <h2 className="mt-3 text-2xl font-semibold">City Event Studio</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  A fictional organizer profile for showcasing the layout of your
                  event details page in the same premium visual system as the admin
                  dashboard.
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Contact organizer
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                  Event highlights
                </p>
                <div className="mt-4 space-y-4 text-sm text-slate-300">
                  <p>Doors open 45 minutes before the event starts.</p>
                  <p>Designed for guests who want a polished Lagos social experience.</p>
                  <p>Photo-friendly venue with easy city access and curated programming.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Schedule</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm text-cyan-300">{formatLongDate(eventItem.date, eventItem.time)}</p>
                <h3 className="mt-2 text-xl font-semibold">Arrival and welcome</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Guests arrive, settle in, and get oriented before the main program
                  begins.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm text-cyan-300">Main experience</p>
                <h3 className="mt-2 text-xl font-semibold">Headline program and networking</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  The featured experience unfolds with enough breathing room for
                  conversation, content, and connection.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Location</p>
            <h2 className="mt-3 text-2xl font-semibold">{eventItem.venue}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{eventItem.location}</p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(34,211,238,0.08),rgba(15,23,42,0.9))] p-8">
              <p className="text-sm text-slate-300">
                Map preview area
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Great for adding a real embedded map later.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frequently asked questions</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <h3 className="text-lg font-semibold">Is registration required?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Yes. This layout assumes ticketing or RSVP is handled ahead of the
                  event, just like a typical Eventbrite detail page.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <h3 className="text-lg font-semibold">Can I share this event?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Absolutely. Every card on the home page links directly to this
                  dedicated event view.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Quick facts
          </p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-slate-500">Category</p>
              <p className="mt-1 font-semibold text-white">{eventItem.category}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-slate-500">Price</p>
              <p className="mt-1 font-semibold text-white">{eventItem.price}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-slate-500">City</p>
              <p className="mt-1 font-semibold text-white">Lagos, Nigeria</p>
            </div>
          </div>
        </aside>
      </section>
      
    </main>
  );
}

export default EventDetails;
