'use client'
import { useState } from 'react'
export default function ContactForm() {

const [submitted, setSubmitted] = useState(false)
if (submitted) {
return (
 <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
   <p style={{ color: '#34D399', fontSize: '20px', fontWeight: 600 }}>Message sent!</p>
   <p style={{ color: '#94A3B8', marginTop: '8px' }}>We&apos;ll respond within 48 hours.</p>
 </div>
)
}
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault()
const form = e.currentTarget
const name = (form.elements.namedItem('name') as HTMLInputElement).value
const email = (form.elements.namedItem('email') as HTMLInputElement).value
const subject = (form.elements.namedItem('subject') as HTMLSelectElement).value
const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value
const mailto = `mailto:contact.ab554@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`
window.location.href = mailto
setSubmitted(true)
}
return (
<form onSubmit={handleSubmit} className="flex flex-col gap-5">
 <div>
   <label htmlFor="name" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Your Name <span style={{ color: '#F87171' }}>*</span></label>
   <input id="name" name="name" type="text" required placeholder="John Smith" className="w-full px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }} />
 </div>
 <div>
   <label htmlFor="email" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address <span style={{ color: '#F87171' }}>*</span></label>
   <input id="email" name="email" type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }} />
 </div>
 <div>
   <label htmlFor="subject" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Subject</label>
   <select id="subject" name="subject" className="w-full px-4 py-3 rounded-xl" style={{ background: 'rgba(30,42,64,1)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }}>
     <option value="General Question">General Question</option>
     <option value="Calculator Feedback">Calculator Feedback</option>
     <option value="Content Feedback">Content Feedback</option>
     <option value="Calculator Error">Calculator Error</option>
     <option value="Other">Other</option>
   </select>
 </div>
 <div>
   <label htmlFor="message" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Message <span style={{ color: '#F87171' }}>*</span></label>
   <textarea id="message" name="message" required rows={6} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl resize-y" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }} />
 </div>
 <p style={{ color: '#64748B', fontSize: '13px' }}>We cannot provide legal advice or comment on specific cases. For legal guidance, please consult a licensed personal injury attorney.</p>
 <button type="submit" className="w-full py-4 rounded-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', cursor: 'pointer', fontSize: '16px' }}>Send Message</button>
</form>
)
}