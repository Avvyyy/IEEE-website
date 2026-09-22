"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function PaymentStatusBanner() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  const isVisible = useMemo(() => {
    return payment === "success" || payment === "failed" || payment === "error";
  }, [payment]);

  const isSuccess = payment === "success";
  const message = useMemo(() => {
    if (isSuccess) {
      return {
        title: "Payment confirmed!",
        body: "Your Day 3 Field Trip payment has been received. See you on November 12!",
      };
    }
    if (payment === "failed") {
      return {
        title: "Payment not completed",
        body: "Something went wrong with your payment. Please try again or contact us.",
      };
    }
    return {
      title: "Payment verification failed",
      body: "Something went wrong. Please try again or contact us.",
    };
  }, [payment, isSuccess]);

  // Clean the URL param
  useEffect(() => {
    if (isVisible) {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl ${
              isSuccess
                ? "border-green-400/30 bg-green-400/10"
                : "border-ieee-red/30 bg-ieee-red/10"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 size={20} className="text-green-400 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-ieee-red mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${isSuccess ? "text-green-300" : "text-red-300"}`}>
                {message.title}
              </p>
              <p className="text-xs text-body/70 mt-1">{message.body}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
