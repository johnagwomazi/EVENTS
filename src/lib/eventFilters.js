export const eventsEndpoint = "http://localhost:3001/events";

export const quickFilters = [
  "Today",
  "This weekend",
  "Free",
  "Music",
  "Business",
  "Food & Drink",
  "Nightlife",
  "Tech",
];

export function slugifyFilter(filterLabel) {
  return filterLabel.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

export function formatEventDate(dateValue) {
  if (!dateValue) {
    return "Date to be announced";
  }

  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}

function isSameDay(leftDate, rightDate) {
  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
}

function getWeekendWindow(referenceDate) {
  const start = new Date(referenceDate);
  const end = new Date(referenceDate);
  const day = referenceDate.getDay();
  const daysUntilSaturday = day <= 6 ? (6 - day) % 7 : 0;

  start.setDate(referenceDate.getDate() + daysUntilSaturday);
  start.setHours(0, 0, 0, 0);

  end.setDate(start.getDate() + 1);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function includesKeyword(eventItem, keywords) {
  const haystack = [
    eventItem.title,
    eventItem.category,
    eventItem.description,
    eventItem.venue,
    eventItem.location,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) => haystack.includes(keyword));
}

export function matchesFilter(eventItem, filterSlug, referenceDate = new Date()) {
  const eventDate = eventItem.date ? new Date(eventItem.date) : null;

  switch (filterSlug) {
    case "today":
      return eventDate ? isSameDay(eventDate, referenceDate) : false;
    case "this-weekend": {
      if (!eventDate) {
        return false;
      }

      const { start, end } = getWeekendWindow(referenceDate);
      return eventDate >= start && eventDate <= end;
    }
    case "free":
      return (eventItem.price || "").trim().toLowerCase() === "free";
    case "music":
      return includesKeyword(eventItem, ["music", "concert", "live", "dj"]);
    case "business":
      return includesKeyword(eventItem, ["business", "founder", "startup", "investor"]);
    case "food-and-drink":
      return includesKeyword(eventItem, ["food", "drink", "kitchen", "brunch"]);
    case "nightlife":
      return includesKeyword(eventItem, ["nightlife", "rooftop", "sunset", "evening", "party"]);
    case "tech":
      return includesKeyword(eventItem, ["tech", "startup", "product", "founder"]);
    default:
      return true;
  }
}

export function getFilterLabel(filterSlug) {
  return quickFilters.find((filter) => slugifyFilter(filter) === filterSlug) || "Filtered events";
}
