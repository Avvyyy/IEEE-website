"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Zap, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { IgniteRegistrationModal } from "@/components/axis/IgniteRegistrationModal";
import type { AxisIgniteWebinar } from "@/lib/types";

interface Props {
  webinars: AxisIgniteWebinar[];
}

const PILLAR_LABELS: Record<number, string> = {
  1: "Advance",
  2: "Advance",
  3: "Explore",
  4: "Explore",
  5: "Innovate",
  6: "Innovate",
  7: "Skill Up",
  8: "Skill Up",
};

const PILLAR_COLORS: Record<number, string> = {
  1: "bg-blue-500/15 text-blue-400",
  2: "bg-blue-500/15 text-blue-400",
  3: "bg-emerald-500/15 text-emerald-400",
  4: "bg-emerald-500/15 text-emerald-400",
  5: "bg-amber-500/15 text-amber-400",
  6: "bg-amber-500/15 text-amber-400",
  7: "bg-purple-500/15 text-purple-400",
  8: "bg-purple-500/15 text-purple-400",
};

export function IgniteWebinarGrid({ webinars }: Props) {
  const [selected, setSelected] = useState<AxisIgniteWebinar | null>(null);
  const [expandedBio, setExpandedBio] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars.map((webinar, i) => {
          const pillar = PILLAR_LABELS[webinar.week] ?? "";
          const pillarColor = PILLAR_COLORS[webinar.week] ?? "bg-white/10 text-white/60";
          const isExpanded = expandedBio === webinar.id;

          return (
            <motion.article
              key={webinar.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-surface hover:border-ieee-blue/40 hover:shadow-lg hover:shadow-ieee-blue/10 transition-all duration-300 overflow-hidden"
            >
              {/* Week stripe */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-surface-alt">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-widest text-accent-gold uppercase">
                    Week {webinar.week}
                  </span>
                  {pillar && (
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${pillarColor}`}>
                      {pillar}
                    </span>
                  )}
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ieee-blue/20 text-ieee-blue-light">
                  <Zap size={12} />
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-white font-bold text-base mb-2 leading-snug group-hover:text-ieee-blue-light transition-colors">
                  {webinar.title}
                </h3>
                <p className="text-sm text-body leading-relaxed mb-4 flex-1">
                  {webinar.description}
                </p>

                {/* Meta */}
                <div className="space-y-1.5 mb-4">
                  <p className="flex items-center gap-2 text-xs text-body/70">
                    <Calendar size={12} className="shrink-0" />
                    {webinar.date !== "TBC" ? webinar.date : "Date to be announced"}
                    {webinar.time !== "TBC" && ` · ${webinar.time}`}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-body/70">
                    <User size={12} className="shrink-0" />
                    {webinar.speaker !== "Speaker TBC" ? webinar.speaker : "Speaker to be announced"}
                  </p>
                </div>

                {/* Speaker bio (expandable) */}
                {webinar.speakerBio && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setExpandedBio(isExpanded ? null : webinar.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-ieee-blue-light hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {isExpanded ? "Hide bio" : "About the speaker"}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start gap-3 mt-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            {webinar.speakerImage && (
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10">
                                <Image
                                  src={webinar.speakerImage}
                                  alt={webinar.speaker}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white">{webinar.speaker}</p>
                              {webinar.speakerTitle && (
                                <p className="text-[11px] text-body/60 mt-0.5">{webinar.speakerTitle}</p>
                              )}
                              <p className="text-xs text-body/70 mt-2 leading-relaxed line-clamp-4">
                                {webinar.speakerBio}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <button
                  type="button"
                  id={`register-${webinar.id}`}
                  onClick={() => setSelected(webinar)}
                  className="w-full rounded-full border border-ieee-blue/50 py-2.5 text-sm font-semibold text-ieee-blue-light hover:bg-ieee-blue hover:text-white hover:border-ieee-blue transition-all duration-200 active:scale-95"
                >
                  Register
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Modal — rendered once, updated per selected webinar */}
      {selected && (
        <IgniteRegistrationModal
          webinar={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
