/**
 * update-ignite-speakers.ts
 * 
 * Updates weeks 1-3 with confirmed speaker details and deletes weeks 4-8.
 * Run: npx tsx scripts/update-ignite-speakers.ts
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import path from "path";

// Load .env.local manually
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WEEKS_DATA = [
  {
    week_number: 1,
    title: "Own Your Future",
    event_date: "2026-09-20",
    event_time: "6:30 PM WAT",
    speaker: "Dr. Helen K Joy",
    speaker_title: "Assistant Professor, Christ University Bangalore | Coordinator, Centre for AI | IEEE EdSoc Distinguished Lecturer 2026-27",
    speaker_bio: `Dr. Helen K Joy is an innovator, educator and researcher working at the intersection of deep learning, video compression and digital image processing. She is currently an Assistant Professor at Christ University Bangalore and coordinates the Centre for Artificial Intelligence. Dr. Helen holds a PhD from Reva University, a Gold Medal in M E Applied Electronics from Satyabhama University and a B E in Electronics and Communication from Anna University. She is also a Google Certified Educator who actively integrates technology enhanced learning into her teaching and research.

Her research focuses on deep learning, video compression, convolutional neural networks, digital image processing and embedded machine learning. She has published extensively in journals, conferences and edited volumes and is the author of two books that reflect her interest in making complex ideas accessible. She has mentored students in advanced areas of computing and has guided the development of impactful projects including Report Rover, ledger flow etc. She also contributes as a reviewer for scientific journals, supporting high quality research in her field.

Dr. Helen is an active IEEE senior member, IEEE Edsoc distinguished lecturer 2026-27, a recipient of the Dr. Madhavan Nair Award, Sri prahalad p Chabaria IEEE early careers award and holds several professional certifications in artificial intelligence, machine learning and digital content creation.`,
    description: "Kickoff: The Future Starts Here. An exploration of deliberate career planning and community involvement — building a personal brand as an engineering student, turning coursework into a portfolio, and why community leadership accelerates career growth. Plus a first reveal of what AXIS 2026 is and why it matters.",
  },
  {
    week_number: 2,
    title: "Growing Beyond Campus",
    event_date: "2026-09-27",
    event_time: "6:30 PM WAT",
    speaker: "Professor Celestine Iwendi",
    speaker_title: "IEEE Brand Ambassador | Professor of AI, University of Greater Manchester | Head, Centre of Intelligence of Things (CIoTh)",
    speaker_bio: `Professor Celestine Iwendi is an IEEE Brand Ambassador, TEDx Speaker, Professor of Artificial Intelligence, and Head of the Centre of Intelligence of Things, CIoTh, at the University of Greater Manchester, Bolton, United Kingdom. He holds a PhD in Electronics Engineering and has more than 25 years of technical, academic, research, and professional experience across artificial intelligence, machine learning, wireless sensor networks, Internet of Things, intelligent systems, cybersecurity, data driven innovation, and applied digital transformation.

He is a Senior Member of the Institute of Electrical and Electronics Engineers, a Chartered Engineer, a Fellow of the Higher Education Academy in the United Kingdom, and a Fellow of the Institute of Management Consultants. Professor Iwendi has received prestigious recognition from the Royal Academy of Engineering under the Exceptional Talent Scheme for his contributions to artificial intelligence and medical applications. He has also been listed in Elsevier's World's Top 2 Percent Influential Scientists for five consecutive years.

His scholarly work spans 13 of the 17 United Nations Sustainable Development Goals, with 92.6 percent of his publications internationally co-authored and 60.7 percent ranking among the top 25 percent most cited globally.`,
    description: "A conversation with an IEEE professional. Understanding the value of IEEE membership beyond graduation, how to get involved at chapter and section level, mentorship and networking pathways, and an industry perspective on where the field is heading.",
  },
  {
    week_number: 3,
    title: "New Frontiers",
    event_date: "2026-10-04",
    event_time: "6:30 PM WAT",
    speaker: "Abdullah AlSalmani",
    speaker_title: "TEDx Speaker | Co-Founder & CEO, SpacePoint | MIT Bootcamps Alumnus",
    speaker_bio: `Abdullah AlSalmani is a TEDx Speaker, Co-Founder & CEO of SpacePoint, a UAE-based EdTech startup making satellite development accessible to students from middle school through university. An electrical engineer with an MSc in Space Science and an MIT Bootcamps alumnus, Abdullah is also the system engineer behind AlAinSat-1, the first satellite built in Al Ain, where he led the development of a Made in the UAE onboard computer that flew onboard the satellite as a payload.

Passionate about innovation, youth empowerment, and climate action, he served on the Youth Advisory Council of the Al Ghurair Foundation. His contributions to education and space have earned him recognition as one of the Top 25 STEM & Space Educators for Climate, a Young Arab Pioneer in the Space and Technology Category, among the 20 MIT Innovators Under 35 - MENA 2025, and a winner of the Rising Star Award at SEF2026.`,
    description: "Beyond Earth: Space Tech & the African Opportunity. An introduction to the growing African space and satellite technology sector, career paths in aerospace and geospatial engineering, and how SpacePoint's work connects to everyday problems.",
  },
];

async function main() {
  console.log("Starting AXIS Ignite speaker update...\n");

  // Get the congress record
  const { data: congress, error: congressError } = await supabase
    .from("axis_congress")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (congressError || !congress) {
    console.error("Could not find axis_congress record:", congressError);
    process.exit(1);
  }

  console.log(`Found congress: ${congress.id}`);

  // Update weeks 1-3
  for (const week of WEEKS_DATA) {
    const { error } = await supabase
      .from("axis_ignite")
      .update({
        title: week.title,
        event_date: week.event_date,
        event_time: week.event_time,
        speaker: week.speaker,
        speaker_title: week.speaker_title,
        speaker_bio: week.speaker_bio,
        description: week.description,
      })
      .eq("congress_id", congress.id)
      .eq("week_number", week.week_number);

    if (error) {
      console.error(`Error updating week ${week.week_number}:`, error);
    } else {
      console.log(`Updated week ${week.week_number}: ${week.speaker}`);
    }
  }

  // Delete weeks 4-8
  const { error: deleteError, count } = await supabase
    .from("axis_ignite")
    .delete()
    .eq("congress_id", congress.id)
    .gte("week_number", 4);

  if (deleteError) {
    console.error("Error deleting weeks 4-8:", deleteError);
  } else {
    console.log(`Deleted ${count ?? 0} rows (weeks 4-8)`);
  }

  console.log("\nDone! Ignite speaker data updated.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
