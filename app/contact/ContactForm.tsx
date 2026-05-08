// app/contact/ContactForm.tsx
// Isolated "use client" component so the parent page stays a Server Component.
// Uses mailto: — zero backend, zero cost, Vercel-compatible.
"use client";

import { useState } from "react";

type FormState = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

const SUBJECTS = [
    "General Question",
    "Calculator Error",
    "Content Feedback",
    "Partnership / Advertising",
    "Press Inquiry",
    "Other",
];

export default function ContactForm() {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        subject: SUBJECTS[0],
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function validate(): boolean {
        if (!form.name.trim()) { setError("Please enter your name."); return false; }
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        if (!form.message.trim() || form.message.trim().length < 20) {
            setError("Please enter a message of at least 20 characters.");
            return false;
        }
        return true;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (!validate()) return;

        // Build mailto: URL — opens user's default mail client
        // No server required; satisfies the no-backend constraint
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
        );
        const subject = encodeURIComponent(`[SettleBrook] ${form.subject}`);
        window.location.href = `mailto:hello@settlebrook.com?subject=${subject}&body=${body}`;
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center space-y-3">
                <svg className="w-10 h-10 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-white">Your email client should have opened</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                    If it didn't open automatically, please email us directly at{" "}
                    <a href="mailto:hello@settlebrook.com" className="text-blue-400 hover:underline">
                        hello@settlebrook.com
                    </a>
                    . We respond within 2 business days.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" }); }}
                    className="mt-2 text-sm text-gray-400 hover:text-white underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
            aria-label="Contact form"
        >
            {/* Error banner */}
            {error && (
                <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* Name */}
            <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Your Name <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-colors text-sm"
                />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email Address <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-colors text-sm"
                />
            </div>

            {/* Subject */}
            <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Subject
                </label>
                <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-colors text-sm appearance-none cursor-pointer"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
                >
                    {SUBJECTS.map((s) => (
                        <option key={s} value={s} className="bg-gray-900">
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Message */}
            <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Message <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-colors text-sm resize-y"
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 20 characters</p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 leading-relaxed">
                We cannot provide legal advice or comment on specific cases. For legal
                guidance, please consult a licensed personal injury attorney.
            </p>

            {/* Submit */}
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                Send Message
            </button>
        </form>
    );
}