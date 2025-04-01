import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Replace with your Supabase project details
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch and display events
export async function fetchEvents() {
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return;
  }

  const eventsContainer = document.getElementById("events");
  eventsContainer.innerHTML = "";

  data.forEach(event => {
    const eventElement = document.createElement("div");
    eventElement.innerHTML = `<h3>${event.title}</h3><p>${event.description}</p><small>${new Date(event.date).toLocaleString()}</small>`;
    eventsContainer.appendChild(eventElement);
  });
}

// Listen for real-time event updates
export function subscribeToEvents() {
  supabase
    .channel("events")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, (payload) => {
      console.log("New event added:", payload.new);
      fetchEvents(); // Refresh events list
    })
    .subscribe();
}
