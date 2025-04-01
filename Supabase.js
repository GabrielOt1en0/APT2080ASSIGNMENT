import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Replace with your Supabase project details
const SUPABASE_URL = "Yhttps://ekvcblitmfvjxuqddwxa.supabase.coL";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdmNibGl0bWZ2anh1cWRkd3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NDA5NTIsImV4cCI6MjA1ODIxNjk1Mn0.7e90Uo9xH3Pjb1VppikcmeoL3ORFWhCPsXa_yh-TGek";

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
