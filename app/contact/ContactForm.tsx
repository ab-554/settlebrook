// app/contact/ContactForm.tsx
// Isolated "use client" component so the parent page stays a Server Component.
"use client";

import { useForm, ValidationError } from '@formspree/react';

const SUBJECTS = [
    "General Question",
    "Calculator Error",
    "Content Feedback",
    "Partnership / Advertising",
    "Press Inquiry",
    "Other",
];

export default function ContactForm() {
    const [state, handleSubmit] = useForm('xykoldyq');

    if (state.succeeded) {
        return (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#34D399' }}>
                <p style={{ fontSize: '18px', fontWeight: 600 }}>Message sent successfully!</p>
                <p style={{ color: '#94A3B8', marginTop: '8px' }}>We'll respond within 48 hours.</p>
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
                    placeholder="jane@example.com"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-colors text-sm"
                />
                <ValidationError field='email' prefix='Email' errors={state.errors} style={{color: '#F87171', fontSize: '12px'}} />
            </div>

            {/* Subject */}
            <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Subject
                </label>
                <select
                    id="contact-subject"
                    name="subject"
                    defaultValue={SUBJECTS[0]}
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
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent transition-colors text-sm resize-y"
                />
                <ValidationError field='message' prefix='Message' errors={state.errors} style={{color: '#F87171', fontSize: '12px'}} />
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 leading-relaxed">
                We cannot provide legal advice or comment on specific cases. For legal
                guidance, please consult a licensed personal injury attorney.
            </p>

            {/* Submit */}
            <button
                type="submit"
                disabled={state.submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                {state.submitting ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}