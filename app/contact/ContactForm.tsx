// app/contact/ContactForm.tsx
// Plain HTML form posting to Formspree (no client JS). Design-refresh: uses
// the shared field styles from globals.css; action, field names, and hidden
// inputs are unchanged.

export default function ContactForm() {
  return (
    <form
      action="https://formspree.io/f/xykoldyq"
      method="POST"
      className="flex flex-col gap-1"
    >
      <div className="mb-4">
        <label htmlFor="name" className="field-label">
          Your name <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="John Smith"
          className="field-input"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="field-label">
          Email address <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="field-input"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subject" className="field-label">Subject</label>
        <div className="field-select-wrap">
          <select id="subject" name="subject" className="field-select">
            <option value="General Question">General Question</option>
            <option value="Calculator Feedback">Calculator Feedback</option>
            <option value="Content Feedback">Content Feedback</option>
            <option value="Calculator Error">Calculator Error</option>
            <option value="Other">Other</option>
          </select>
          <span className="field-select-chevron" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="field-label">
          Message <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="How can we help you?"
          className="field-input resize-y"
          style={{ fontWeight: 400, minHeight: 160 }}
        />
      </div>
      <input type="hidden" name="_subject" value="New Settlebrook Contact Form Submission" />
      <input type="hidden" name="_next" value="https://www.settlebrook.com/contact/?success=true" />
      <p className="text-sm mb-4" style={{ color: 'var(--ink-3)' }}>
        We cannot provide legal advice or comment on specific cases.
      </p>
      <button type="submit" className="btn-primary btn-lg w-full">
        Send message
      </button>
    </form>
  )
}
