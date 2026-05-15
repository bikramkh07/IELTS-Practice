export default function HowItWorks() {
  return (
    <section className="content-section how-section" id="how">
      <div className="section-label">How It Works</div>
      <h2 className="section-h2">From Sign Up to Band 7+ in 3 Steps</h2>
      <p className="section-sub">A simple, structured path designed specifically for South Asian IELTS candidates.</p>
      <div className="steps-grid">
        <div className="step-card">
          <div className="step-num">01</div>
          <h3>Diagnostic Test</h3>
          <p>Take a 30-minute AI diagnostic across all four skills. Get your baseline band score and a personalised study roadmap immediately.</p>
        </div>
        <div className="step-arrow"><i className="ti ti-arrow-right" /></div>
        <div className="step-card">
          <div className="step-num">02</div>
          <h3>Daily AI Practice</h3>
          <p>Follow your AI-curated daily plan. Practice each skill with targeted exercises, instant feedback, and adaptive difficulty.</p>
        </div>
        <div className="step-arrow"><i className="ti ti-arrow-right" /></div>
        <div className="step-card">
          <div className="step-num">03</div>
          <h3>Mock &amp; Improve</h3>
          <p>Take full mock Exams under real conditions. Review detailed AI feedback and track your progression to Band 7+.</p>
        </div>
      </div>
    </section>
  );
}
