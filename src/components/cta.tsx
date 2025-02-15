import React from "react";
import { Button } from "./button";

export default function CTA({ config }: { config?: any }) {
  return (
    <section className="bg-base-100 relative">
      <div className="relative mx-auto max-w-7xl px-8 py-24 text-center text-slate-800 md:py-48">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight md:mb-12 md:text-5xl">
          Revolutionize Your Project Management with AI
          </h2>
          <p className="mb-12 max-w-md text-lg text-slate-500">
          Automate workflows, enhance collaboration, and track project progress in real-time. Focus on what truly matters – innovation and efficiency.
          </p>
          <Button className="h-12 w-48 text-lg" color="blue" href="/role-selection">
          Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
