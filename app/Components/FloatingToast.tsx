"use client";

import type { SubmissionState } from "./ContactFormSubmit";

type FloatingToastProps = {
  submissionState: SubmissionState;
  visible: boolean;
};

export default function FloatingToast({
  submissionState,
  visible,
}: FloatingToastProps) {
  if (submissionState.type === "idle") {
    return null;
  }

  const toastClassName =
    submissionState.type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm transform transition-all duration-500 sm:right-6 sm:top-6 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <div
        className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-sm ${toastClassName}`}
      >
        <p className="text-sm font-semibold">
          {submissionState.type === "success"
            ? "Message sent"
            : "Message not sent"}
        </p>
        <p className="mt-1 text-sm">{submissionState.message}</p>
      </div>
    </div>
  );
}
