export default function ContactForm() {

return (
<form
 action="https://formspree.io/f/xykoldyq"
 method="POST"
 className="flex flex-col gap-5"
>
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
 </div>
 <div>
   <label htmlFor="subject" style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
     Subject
   </label>
   <select
     id="subject"
     name="subject"
     className="w-full px-4 py-3 rounded-xl"
     style={{ background: 'rgba(30,42,64,1)', border: '1px solid rgba(99,179,237,0.20)', color: '#F1F5F9', outline: 'none' }}
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
 </div>
 <input type="hidden" name="_subject" value="New Settlebrook Contact Form Submission" />
 <input type="hidden" name="_next" value="https://settlebrook.com/contact/?success=true" />
 <p style={{ color: '#64748B', fontSize: '13px' }}>
   We cannot provide legal advice or comment on specific cases.
 </p>
 <button
   type="submit"
   className="w-full py-4 rounded-2xl font-bold text-white"
   style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', cursor: 'pointer', fontSize: '16px' }}
 >
   Send Message
 </button>
</form>
)
}