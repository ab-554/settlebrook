'use client'
import { useForm, ValidationError } from '@formspree/react'
export default function ContactForm() {

const [state, handleSubmit] = useForm('xykoldyq')
if (state.succeeded) {
return (
 <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
   <p style={{ color: '#34D399', fontSize: '20px', fontWeight: 600 }}>Message sent successfully!</p>
   <p style={{ color: '#94A3B8', marginTop: '8px' }}>We&apos;ll respond within 48 hours.</p>
 </div>
)
}
return (
<form onSubmit={handleSubmit} className="flex flex-col gap-5">
 <div>
   <label htmlFor="name" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
     Your Name <span style={{ color: '#F87171' }}>*</span>
   </label>
   <input
     id="name"
     type="text"
     name="name"
     required
     placeholder="John Smith"
     className="w-full px-4 py-3 rounded-xl"
     style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }}
   />
 </div>
 <div>
   <label htmlFor="email" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
     Email Address <span style={{ color: '#F87171' }}>*</span>
   </label>
   <input
     id="email"
     type="email"
     name="email"
     required
     placeholder="you@example.com"
     className="w-full px-4 py-3 rounded-xl"
     style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }}
   />
   <ValidationError field="email" prefix="Email" errors={state.errors} style={{ color: '#F87171', fontSize: '12px', marginTop: '4px' }} />
 </div>
 <div>
   <label htmlFor="subject" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
     Subject
   </label>
   <select
     id="subject"
     name="subject"
     className="w-full px-4 py-3 rounded-xl"
     style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }}
   >
     <option value="General Question">General Question</option>
     <option value="Calculator Feedback">Calculator Feedback</option>
     <option value="Content Feedback">Content Feedback</option>
     <option value="Calculator Error">Calculator Error</option>
     <option value="Other">Other</option>
   </select>
 </div>
 <div>
   <label htmlFor="message" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
     Message <span style={{ color: '#F87171' }}>*</span>
   </label>
   <textarea
     id="message"
     name="message"
     required
     rows={6}
     placeholder="How can we help you?"
     className="w-full px-4 py-3 rounded-xl resize-y"
     style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }}
   />
   <ValidationError field="message" prefix="Message" errors={state.errors} style={{ color: '#F87171', fontSize: '12px', marginTop: '4px' }} />
 </div>
 <p style={{ color: '#64748B', fontSize: '13px' }}>
   We cannot provide legal advice or comment on specific cases. For legal guidance, please consult a licensed personal injury attorney.
 </p>
 <button
   type="submit"
   disabled={state.submitting}
   className="w-full py-4 rounded-2xl font-bold text-white"
   style={{ background: state.submitting ? '#334155' : 'linear-gradient(135deg, #3B82F6, #06B6D4)', cursor: state.submitting ? 'not-allowed' : 'pointer', fontSize: '16px' }}
 >
   {state.submitting ? 'Sending...' : 'Send Message'}
 </button>
</form>
)
}