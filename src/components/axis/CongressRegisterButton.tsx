"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { CongressRegistrationModal } from "@/components/axis/CongressRegistrationModal";

export function CongressRegisterButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        id="congress-register-btn"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-ieee-blue px-8 py-4 text-base font-semibold text-white shadow-lg shadow-ieee-blue/30 hover:bg-ieee-blue-light transition-colors active:scale-95"
      >
        Register Now <ExternalLink size={18} />
      </button>

      <CongressRegistrationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
