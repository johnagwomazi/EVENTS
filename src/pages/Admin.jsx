import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  category: "",
  date: "",
  time: "",
  venue: "",
  location: "",
  price: "",
  image: "",
  description: "",
};

const eventsEndpoint = "http://localhost:3001/events";

function Admin() {
  const [activeView, setActiveView] = useState("add");
  const [formData, setFormData] = useState(initialForm);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

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

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      date: formData.date,
      time: formData.time,
      venue: formData.venue.trim(),
      location: formData.location.trim(),
      price: formData.price.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(eventsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to save event.");
      }

      const savedEvent = await response.json();

      setEvents((currentEvents) => [savedEvent, ...currentEvents]);
      setFormData(initialForm);
      setMessage("Event added successfully.");
      setActiveView("manage");
    } catch (submitError) {
      setError("Could not save the event. Make sure json-server is running on port 3001.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(eventId) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${eventsEndpoint}/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete event.");
      }

      setEvents((currentEvents) =>
        currentEvents.filter((savedEvent) => savedEvent.id !== eventId),
      );
      setMessage("Event removed successfully.");
    } catch (deleteError) {
      setError("Could not delete the event right now.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <div className="border-b border-white/10 bg-linear-to-r from-emerald-500/20 via-cyan-500/10 to-transparent px-6 py-8 md:px-10">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-300">
              Website Admin
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              Event dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Switch between adding a new upcoming event and managing the events
              already saved in your database.
            </p>
          </div>

          <div className="grid gap-8 px-6 py-8 md:grid-cols-[240px_1fr] md:px-10">
            <aside className="space-y-4">
              <button
                type="button"
                onClick={() => setActiveView("add")}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  activeView === "add"
                    ? "border-emerald-400 bg-emerald-400/20 text-white"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <span className="block text-lg font-semibold">Add Events</span>
                <span className="mt-1 block text-sm text-slate-300">
                  Create a new event record for your site.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("manage")}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                  activeView === "manage"
                    ? "border-cyan-400 bg-cyan-400/20 text-white"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <span className="block text-lg font-semibold">Manage Events</span>
                <span className="mt-1 block text-sm text-slate-300">
                  Review and remove events from the database.
                </span>
              </button>
            </aside>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 md:p-7">
              {message ? (
                <div className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="mb-5 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              {activeView === "add" ? (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <h2 className="text-2xl font-semibold">Add upcoming event</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Fill in the event details below and submit to save them in
                      `db.json`.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Event title</span>
                      <input
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                        placeholder="Lagos Tech Expo"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Category</span>
                      <input
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                        placeholder="Conference"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Date</span>
                      <input
                        required
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Time</span>
                      <input
                        required
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Venue</span>
                      <input
                        required
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                        placeholder="Eko Convention Centre"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Location</span>
                      <input
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                        placeholder="Victoria Island, Lagos"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Price</span>
                      <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                        placeholder="NGN 10,000 or Free"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Image URL</span>
                      <input
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                        placeholder="https://example.com/event-banner.jpg"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-sm text-slate-300">Description</span>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition focus:border-emerald-400"
                      placeholder="Write a short summary of the event."
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Saving event..." : "Submit Event"}
                  </button>
                </form>
              ) : (
                <div>
                  <div className="flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">Manage events</h2>
                      <p className="mt-2 text-sm text-slate-400">
                        Your saved events appear here. You can review them and
                        remove any item you no longer want to display.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchEvents}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      Refresh list
                    </button>
                  </div>

                  {loading ? (
                    <p className="pt-6 text-sm text-slate-400">Loading events...</p>
                  ) : events.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-center text-slate-400">
                      No events found yet. Use the Add Events tab to create one.
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-4">
                      {events.map((savedEvent) => (
                        <article
                          key={savedEvent.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                                  {savedEvent.category || "Event"}
                                </p>
                                <h3 className="mt-2 text-xl font-semibold text-white">
                                  {savedEvent.title}
                                </h3>
                              </div>

                              <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                                <p>
                                  <span className="text-slate-500">Date:</span>{" "}
                                  {savedEvent.date || "Not set"}
                                </p>
                                <p>
                                  <span className="text-slate-500">Time:</span>{" "}
                                  {savedEvent.time || "Not set"}
                                </p>
                                <p>
                                  <span className="text-slate-500">Venue:</span>{" "}
                                  {savedEvent.venue || "Not set"}
                                </p>
                                <p>
                                  <span className="text-slate-500">Location:</span>{" "}
                                  {savedEvent.location || "Not set"}
                                </p>
                                <p>
                                  <span className="text-slate-500">Price:</span>{" "}
                                  {savedEvent.price || "Free"}
                                </p>
                              </div>

                              <p className="max-w-3xl text-sm leading-7 text-slate-300">
                                {savedEvent.description || "No description added."}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDelete(savedEvent.id)}
                              className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/20"
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Admin;
