/**
 * db.ts — typed Supabase query wrappers for all CMS tables.
 * All functions run server-side using the service/publishable key.
 */

import { supabase } from "./supabase";

// ─── Type definitions ─────────────────────────────────────────────────────

export interface DbEvent {
  id: string;
  title: string;
  start_date: string;
  end_date?: string | null;
  event_time?: string | null;
  duration?: string | null;
  description?: string | null;
  image_url?: string | null;
  location?: string | null;
  registration_url?: string | null;
  vtools_url?: string | null;
  featured: boolean;
  created_at: string;
}

export interface DbTeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string | null;
  image_url?: string | null;
  linkedin?: string | null;
  session: string;
  sort_order: number;
  created_at: string;
}

export interface DbProgram {
  id: string;
  name: string;
  description?: string | null;
  sort_order: number;
  created_at: string;
}

export interface DbSubcommittee {
  id: string;
  program_id: string;
  name: string;
  session: string;
  sort_order: number;
}

export interface DbCommitteeMember {
  id: string;
  subcommittee_id: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  image_url?: string | null;
  sort_order: number;
}

export interface DbNews {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  is_featured: boolean;
  published_at?: string | null;
  created_at: string;
}

export interface DbCongressDay {
  label: string;
  date: string;
  time: string;
  venue: string;
}

export interface DbAxisCongress {
  id: string;
  edition: string;
  theme?: string | null;
  event_date?: string | null;
  end_date?: string | null;
  event_time?: string | null;
  location?: string | null;
  description?: string | null;
  banner_url?: string | null;
  flier_url?: string | null;
  registration_url?: string | null;
  days?: DbCongressDay[];
  updated_at: string;
}

export interface DbAxisIgnite {
  id: string;
  congress_id: string;
  week_number?: number | null;
  title: string;
  event_date?: string | null;
  event_time?: string | null;
  speaker?: string | null;
  speaker_title?: string | null;
  speaker_bio?: string | null;
  speaker_image_url?: string | null;
  description?: string | null;
  meet_link?: string | null;
}

export interface DbPartner {
  id: string;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  type: "partner" | "sponsor";
  sort_order: number;
  created_at: string;
}

export interface DbOpportunity {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  link?: string | null;
  deadline?: string | null;
  is_active: boolean;
  created_at: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────

function computeStatus(row: DbEvent): "upcoming" | "past" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = row.end_date ? new Date(row.end_date) : new Date(row.start_date);
  return endDate < today ? "past" : "upcoming";
}

// ─── Events ───────────────────────────────────────────────────────────────

export async function dbGetEvents(): Promise<DbEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function dbCreateEvent(
  payload: Omit<DbEvent, "id" | "created_at">
): Promise<DbEvent> {
  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateEvent(
  id: string,
  payload: Partial<Omit<DbEvent, "id" | "created_at">>
): Promise<DbEvent> {
  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export { computeStatus };

// ─── Team Members ─────────────────────────────────────────────────────────

export async function dbGetTeamMembers(session?: string): Promise<DbTeamMember[]> {
  let query = supabase
    .from("team_members")
    .select("*")
    .order("sort_order");
  if (session) query = query.eq("session", session);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function dbGetTeamSessions(): Promise<string[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("session")
    .order("session", { ascending: false });
  if (error) throw error;
  const unique = [...new Set((data ?? []).map((r) => r.session).filter(Boolean))];
  return unique;
}

export async function dbCreateTeamMember(
  payload: Omit<DbTeamMember, "id" | "created_at">
): Promise<DbTeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateTeamMember(
  id: string,
  payload: Partial<Omit<DbTeamMember, "id" | "created_at">>
): Promise<DbTeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw error;
}

// ─── Programs ─────────────────────────────────────────────────────────────

export async function dbGetPrograms(): Promise<DbProgram[]> {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function dbCreateProgram(
  payload: Omit<DbProgram, "id" | "created_at">
): Promise<DbProgram> {
  const { data, error } = await supabase
    .from("programs")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateProgram(
  id: string,
  payload: Partial<Omit<DbProgram, "id" | "created_at">>
): Promise<DbProgram> {
  const { data, error } = await supabase
    .from("programs")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteProgram(id: string): Promise<void> {
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw error;
}

// ─── Subcommittees ────────────────────────────────────────────────────────

export async function dbGetSubcommittees(programId?: string): Promise<DbSubcommittee[]> {
  let query = supabase.from("subcommittees").select("*").order("sort_order");
  if (programId) query = query.eq("program_id", programId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function dbCreateSubcommittee(
  payload: Omit<DbSubcommittee, "id">
): Promise<DbSubcommittee> {
  const { data, error } = await supabase
    .from("subcommittees")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateSubcommittee(
  id: string,
  payload: Partial<Omit<DbSubcommittee, "id">>
): Promise<DbSubcommittee> {
  const { data, error } = await supabase
    .from("subcommittees")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteSubcommittee(id: string): Promise<void> {
  const { error } = await supabase.from("subcommittees").delete().eq("id", id);
  if (error) throw error;
}

// ─── Committee Members ────────────────────────────────────────────────────

export async function dbGetCommitteeMembers(subcommitteeId?: string): Promise<DbCommitteeMember[]> {
  let query = supabase.from("committee_members").select("*").order("sort_order");
  if (subcommitteeId) query = query.eq("subcommittee_id", subcommitteeId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function dbCreateCommitteeMember(
  payload: Omit<DbCommitteeMember, "id">
): Promise<DbCommitteeMember> {
  const { data, error } = await supabase
    .from("committee_members")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateCommitteeMember(
  id: string,
  payload: Partial<Omit<DbCommitteeMember, "id">>
): Promise<DbCommitteeMember> {
  const { data, error } = await supabase
    .from("committee_members")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteCommitteeMember(id: string): Promise<void> {
  const { error } = await supabase.from("committee_members").delete().eq("id", id);
  if (error) throw error;
}

// ─── News ─────────────────────────────────────────────────────────────────

export const MAX_FEATURED_NEWS = 4;

export async function dbGetNews(featuredOnly?: boolean): Promise<DbNews[]> {
  let query = supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });
  if (featuredOnly) query = query.eq("is_featured", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function dbCreateNews(
  payload: Omit<DbNews, "id" | "created_at">
): Promise<DbNews> {
  // Enforce max featured limit
  if (payload.is_featured) {
    const featured = await dbGetNews(true);
    if (featured.length >= MAX_FEATURED_NEWS) {
      throw new Error(`Maximum of ${MAX_FEATURED_NEWS} featured news items allowed. Unfeature one first.`);
    }
  }
  const { data, error } = await supabase
    .from("news")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateNews(
  id: string,
  payload: Partial<Omit<DbNews, "id" | "created_at">>
): Promise<DbNews> {
  if (payload.is_featured) {
    const featured = await dbGetNews(true);
    const alreadyFeatured = featured.find((n) => n.id === id);
    if (!alreadyFeatured && featured.length >= MAX_FEATURED_NEWS) {
      throw new Error(`Maximum of ${MAX_FEATURED_NEWS} featured news items allowed. Unfeature one first.`);
    }
  }
  const { data, error } = await supabase
    .from("news")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteNews(id: string): Promise<void> {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}

// ─── AXIS Congress ────────────────────────────────────────────────────────

export async function dbGetAxisCongress(): Promise<DbAxisCongress | null> {
  const { data, error } = await supabase
    .from("axis_congress")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function dbUpsertAxisCongress(
  payload: Omit<DbAxisCongress, "updated_at">
): Promise<DbAxisCongress> {
  const toUpsert = { ...payload, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from("axis_congress")
    .upsert(toUpsert, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── AXIS Ignite ──────────────────────────────────────────────────────────

export async function dbGetAxisIgnite(congressId?: string): Promise<DbAxisIgnite[]> {
  let query = supabase.from("axis_ignite").select("*").order("week_number");
  if (congressId) query = query.eq("congress_id", congressId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function dbCreateAxisIgnite(
  payload: Omit<DbAxisIgnite, "id">
): Promise<DbAxisIgnite> {
  const { data, error } = await supabase
    .from("axis_ignite")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateAxisIgnite(
  id: string,
  payload: Partial<Omit<DbAxisIgnite, "id">>
): Promise<DbAxisIgnite> {
  const { data, error } = await supabase
    .from("axis_ignite")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteAxisIgnite(id: string): Promise<void> {
  const { error } = await supabase.from("axis_ignite").delete().eq("id", id);
  if (error) throw error;
}

// ─── Partners ─────────────────────────────────────────────────────────────

export async function dbGetPartners(): Promise<DbPartner[]> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function dbCreatePartner(
  payload: Omit<DbPartner, "id" | "created_at">
): Promise<DbPartner> {
  const { data, error } = await supabase
    .from("partners")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdatePartner(
  id: string,
  payload: Partial<Omit<DbPartner, "id" | "created_at">>
): Promise<DbPartner> {
  const { data, error } = await supabase
    .from("partners")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeletePartner(id: string): Promise<void> {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) throw error;
}

// ─── Opportunities ────────────────────────────────────────────────────────

export async function dbGetOpportunities(activeOnly?: boolean): Promise<DbOpportunity[]> {
  let query = supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  if (activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function dbCreateOpportunity(
  payload: Omit<DbOpportunity, "id" | "created_at">
): Promise<DbOpportunity> {
  const { data, error } = await supabase
    .from("opportunities")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbUpdateOpportunity(
  id: string,
  payload: Partial<Omit<DbOpportunity, "id" | "created_at">>
): Promise<DbOpportunity> {
  const { data, error } = await supabase
    .from("opportunities")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function dbDeleteOpportunity(id: string): Promise<void> {
  const { error } = await supabase.from("opportunities").delete().eq("id", id);
  if (error) throw error;
}
