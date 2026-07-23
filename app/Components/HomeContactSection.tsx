"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import ContactFormSubmit, { type SubmissionState } from "./ContactFormSubmit";
import FloatingToast from "./FloatingToast";

export default function HomeContactSection() {
  const [toastState, setToastState] = useState<SubmissionState>({
    type: "idle",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<number | null>(null);

  function handleSubmission(state: SubmissionState) {
    setToastState(state);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (state.type === "idle") {
      setShowToast(false);
      return;
    }
    setShowToast(true);
    timerRef.current = window.setTimeout(() => setShowToast(false), 1500);
  }

  return (
    <>
      <FloatingToast submissionState={toastState} visible={showToast} />
      <section className="container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 rounded-3xl shadow-xl overflow-hidden">
          <div className="relative text-white flex flex-col justify-center gap-6 p-8 sm:p-10 z-0 bg-linear-to-br from-primary-dark via-primary-dark to-primary-dark">
            {/* full-strength photo, darkened by the overlay below rather than faded via opacity */}
            <Image
              src="/images/home/contact-section-background.webp"
              alt=""
              fill
              className="object-cover -z-10 blur-sm"
            />
            <div className="absolute inset-0 -z-10"></div>

              <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-white/10 px-3 py-1 rounded-full mb-6">
                  Get In Touch
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-2xl bg-white/20 border border-white/10 p-4 transition-colors hover:bg-white/30">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-black mb-0.5">
                      Location
                    </p>
                    <p className="text-base font-semibold">Illinois, USA</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/20 border border-white/10 p-4 transition-colors hover:bg-white/10">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <FaPhoneAlt className="text-white text-base" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-black mb-0.5">
                      Phone
                    </p>
                    <a
                      href="tel:+18552221133"
                      className="text-base font-semibold hover:text-primary transition-colors"
                    >
                      +1-855-222-1133
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/20 border border-white/10 p-4 transition-colors hover:bg-white/10">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-white text-base" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-black mb-0.5">
                      Email
                    </p>
                    <a
                      href="mailto:info@fbsprints.com"
                      className="text-base font-semibold hover:text-primary transition-colors break-all"
                    >
                      info@fbsprints.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

          <div className="lg:col-span-2 bg-white p-5">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary">
                Contact Us If You Need A Custom
                <span className="block text-primary">
                  Design{" "}
                  <span className="bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    Without
                  </span>{" "}
                  Delay!
                </span>
              </h2>
              <p className="mt-4 text-primary-dark/70">
                To make an appointment, please call us. We&apos;d love to pamper
                you!
              </p>
            </div>
            <ContactFormSubmit
              variant="home"
              onSubmissionStateChange={handleSubmission}
            />
          </div>
        </div>
      </section>
    </>
  );
}