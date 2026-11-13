import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Experience from './Experience';
import Education from './Education';
import Interests from './Interests';
import { work, illustrations } from './work';
import './styles.css';

const labels = ['Web delivery', 'AI workflows', 'Team leadership'];
const email = 'shahwaizjalali123@gmail.com';

function Hero() {
  function moveLight(event) {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--light-x', ((event.clientX - bounds.left) / bounds.width * 100) + '%');
    event.currentTarget.style.setProperty('--light-y', ((event.clientY - bounds.top) / bounds.height * 100) + '%');
  }

  return (
    <section className="hero react-hero" onPointerMove={moveLight} aria-labelledby="name">
      <div className="wrap hero-grid">
        <div className="hero-glass">
          <p className="eyebrow">Software engineering · Pakistan</p>
          <h1 id="name">Shahwaiz<br/><span>Arif.</span></h1>
          <p className="intro">Software engineering undergraduate at COMSATS University with experience leading web development and using AI to streamline digital workflows.</p>
          <div className="actions">
            <a className="btn primary" href="#showcase">Explore the work ↓</a>
            <a className="btn" href="#contact">Get in touch ↗</a>
          </div>
        </div>
        <div className="metal-mark" aria-hidden="true"><span>SA</span></div>
      </div>
    </section>
  );
}

function Showcase() {
  const [chapter, setChapter] = useState(0);
  const [step, setStep] = useState(0);
  const touch = useRef(null);
  const [context, title, description] = work[chapter];
  const steps = illustrations[chapter];

  function select(index) {
    setChapter((index + work.length) % work.length);
    setStep(0);
  }

  function endSwipe(event) {
    const start = touch.current;
    touch.current = null;
    if (!start || event.touches.length) return;
    const end = event.changedTouches[0];
    const x = end.clientX - start.clientX;
    const y = end.clientY - start.clientY;
    if (Math.abs(x) > 48 && Math.abs(x) > Math.abs(y) * 1.4) select(chapter + (x < 0 ? 1 : -1));
  }

  return (
    <section className="content feature" id="showcase">
      <div className="wrap">
        <p className="eyebrow">Work showcase</p>
        <h2>Inside the work.</h2>
        <div className="feature-grid">
          <div className="selectors" aria-label="Choose a work chapter">
            {labels.map((label, index) => (
              <button key={label} aria-pressed={index === chapter} onClick={() => select(index)}>{label}</button>
            ))}
          </div>
          <article className="feature-panel"
            onTouchStart={event => { touch.current = event.touches.length === 1 ? event.touches[0] : null; }}
            onTouchCancel={() => { touch.current = null; }}
            onTouchEnd={endSwipe}>
            <div key={chapter} className="panel-enter">
              <div aria-live="polite">
                <p className="eyebrow">{context}</p>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <div className="work-visual">
                <p className="eyebrow">Illustrative workflow</p>
                <div className="visual-steps" data-layout={['board', 'flow', 'timeline'][chapter]}>
                  {steps.map(([label], index) => (
                    <button key={label} onClick={() => setStep(index)} aria-pressed={step === index}>{label}</button>
                  ))}
                </div>
                <p id="visual-detail" role="status">{steps[step][1]}</p>
              </div>
            </div>
            <div className="chapter-controls">
              <button onClick={() => select(chapter - 1)} aria-label="Previous chapter">←</button>
              <span id="chapter-count">{chapter + 1} / {work.length}</span>
              <button onClick={() => select(chapter + 1)} aria-label="Next chapter">→</button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const skills = [
  ['Development', 'Web development', 'HTML, CSS, JavaScript, React and MERN fundamentals, Git and GitHub.'],
  ['Development', 'Mobile & programming', 'Flutter fundamentals, Firebase, Java, and intermediate Python.'],
  ['Automation', 'AI & automation', 'Workflow automation, AI-assisted productivity, content and video creation.'],
  ['Product & teams', 'Design & quality', 'UI/UX, graphic design, usability, functional testing, and debugging.'],
  ['Product & teams', 'Team operations', 'Planning, delegation, progress tracking, event management, and SDLC fundamentals.'],
];

function Skills() {
  const [filter, setFilter] = useState('All');
  return (
    <section className="content" id="skills">
      <div className="wrap">
        <h2>Skills &amp; tools</h2>
        <div className="filters">
          {['All', ...new Set(skills.map(([group]) => group))].map(group => (
            <button key={group} aria-pressed={group === filter} onClick={() => setFilter(group)}>{group}</button>
          ))}
        </div>
        <div className="cards">
          {skills.filter(([group]) => filter === 'All' || filter === group).map(([, title, text]) => (
            <article className="card panel-enter" key={title}><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState('');
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('Email copied.');
    } catch {
      setStatus('Select the address above to copy it.');
    }
  }

  return (
    <section className="content contact" id="contact">
      <div className="wrap split">
        <h2>Let’s connect.</h2>
        <div>
          <p className="intro">Open to paid technology research interviews, product feedback sessions, and usability studies.</p>
          <div className="actions">
            <a className="btn primary" href={'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email)} target="_blank" rel="noopener">Compose in Gmail ↗</a>
            <a className="btn" href={'mailto:' + email}>Open mail app</a>
            <button onClick={copyEmail}>Copy email</button>
          </div>
          <p className="email-address">{email}</p>
          <p id="copyStatus" role="status">{status}</p>
        </div>
      </div>
    </section>
  );
}

function App() {
  useEffect(() => {
    function updateProgress() {
      const range = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', (range > 0 ? scrollY / range * 100 : 0) + '%');
    }
    addEventListener('scroll', updateProgress, { passive: true });
    addEventListener('resize', updateProgress);
    updateProgress();
    return () => {
      removeEventListener('scroll', updateProgress);
      removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <>
      <header id="top"><nav className="wrap" aria-label="Main navigation">
        <a className="logo" href="#">SA<b>.</b></a>
        <div><a href="#showcase">Work</a><a href="#experience">Experience</a><a href="#contact">Contact ↗</a></div>
      </nav></header>
      <main><Hero/><Showcase/><Experience/><Skills/><Education/><Interests/><Contact/></main>
      <footer className="wrap"><a href="#">Shahwaiz Arif · Back to top ↑</a></footer>
    </>
  );
}

createRoot(document.querySelector('#root')).render(<App/>);
