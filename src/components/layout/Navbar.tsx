"use client";

import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <GraduationCap size={22} />
          </div>

          <div>
            <div className="text-lg font-bold text-slate-900">
              AuraGlance
            </div>
            <div className="-mt-1 text-xs font-medium tracking-wider text-blue-600">
              EDUCATION
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#exams" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Exams
          </Link>

          <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Features
          </Link>

          <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Pricing
          </Link>

          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start Learning
          </Link>
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="#exams">Exams</Link>
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="/login">Login</Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white"
            >
              Start Learning
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}