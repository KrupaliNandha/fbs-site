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
          <div className="relative text-white flex flex-col justify-center gap-14 p-10">
            <Image
              src="/images/home/contact-section-background.webp"
              alt=""
              fill
              className="object-cover -z-10 opocity-50 blur-sm"
            />
            <div className="absolute inset-0 bg-black/5"></div>

            <div className="flex flex-col items-center text-center gap-3">
              <FaMapMarkerAlt className="text-pink-600 text-3xl" />
              <p className="text-xl font-medium">Illinois, USA</p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <FaPhoneAlt className="text-pink-600 text-3xl" />
              <p className="text-lg font-medium">+1-855-222-1133</p>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <FaEnvelope className="text-pink-600 text-3xl" />
              <p className="text-lg font-medium">info@fbsprints.com</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-5">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-pink-700">
                Contact Us If You Need A Custom
                <span className="block text-pink-600">
                  Design{" "}
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Without
                  </span>{" "}
                  Delay!
                </span>
              </h2>
              <p className="mt-4 text-gray-600">
                To make an appointment, please call us. We&apos;d love to pamper you!
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
