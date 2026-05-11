// app/contact/ContactForm.tsx
// Isolated "use client" component so the parent page stays a Server Component.
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
    const [formData, setFormData] = useState<FormState>({
        name: "",
        email: "",
        subject: SUBJECTS[0],
        message: "",
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('https://formspree.io/f/xykoldyq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', subject: SUBJECTS[0], message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center space-y-3">
                <svg className="w-10 h-10 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-white">Message sent successfully. We&apos;ll respond within 48 hours.</h3>
                <button
                    onClick={() => { setSubmitStatus('idle'); }}
                    className="mt-4 text-sm text-gray-400 hover:text-white underline"
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
            action="https://formspree.io/f/xykoldyq"
            method="POST"
        >
            {/* Error banner */}
            {submitStatus === 'error' && (
                <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3">
                    Something went wrong. Please email us directly at contact.ab554@gmail.com
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
                    value={formData.name}
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
                    value={formData.email}
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
                    value={formData.subject}
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
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-colors text-sm resize-y"
                />
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 leading-relaxed">
                We cannot provide legal advice or comment on specific cases. For legal
                guidance, please consult a licensed personal injury attorney.
            </p>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                {isSubmitting ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}