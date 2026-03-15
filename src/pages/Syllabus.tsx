import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Atom, FlaskConical, Zap, Layers, ChevronRight, Grid, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import './Syllabus.css';

type ChapterId = 1 | 2 | 3 | 4;

const readingTimes: Record<ChapterId, string> = { 1: '~2 min', 2: '~3 min', 3: '~4 min', 4: '~3 min' };

type QuizQ = { q: string; opts: string[]; correct: number; explain: string };

const syllabusQuizzes: { afterChapter: number; title: string; questions: QuizQ[] }[] = [
  {
    afterChapter: 2,
    title: 'Mid-Chapter Check',
    questions: [
      { q: 'What are the three subatomic particles?', opts: ['Protons, Neutrons, Electrons', 'Atoms, Molecules, Ions', 'Solids, Liquids, Gases'], correct: 0, explain: 'Protons (+), Neutrons (neutral), and Electrons (−) are the three subatomic particles.' },
      { q: 'Which metal is liquid at room temperature?', opts: ['Gold', 'Mercury', 'Iron'], correct: 1, explain: 'Mercury (Hg) is the only metal that is liquid at room temperature.' },
    ],
  },
  {
    afterChapter: 4,
    title: 'Final Review',
    questions: [
      { q: 'Which group of metals is the MOST reactive?', opts: ['Transition Metals', 'Alkaline Earth Metals', 'Alkali Metals'], correct: 2, explain: 'Group 1 Alkali Metals (Li, Na, K) are the most reactive. They must be stored under oil!' },
      { q: 'What gas is released when a metal reacts with an acid?', opts: ['Oxygen', 'Carbon Dioxide', 'Hydrogen'], correct: 2, explain: 'Metal + Dilute Acid → Salt + Hydrogen Gas. Example: Zn + HCl → ZnCl₂ + H₂' },
      { q: 'Why are metals malleable?', opts: ['Layers of atoms can slide over each other', 'They absorb heat', 'They are very light'], correct: 0, explain: 'In metals, layers of atoms can slide over each other without breaking the metallic bond, allowing them to be hammered into thin sheets.' },
    ],
  },
];

const chapters: {
  id: ChapterId;
  title: string;
  subtitle: string;
  icon: typeof Atom;
  color: string;
  content: React.ReactNode;
}[] = [
  {
    id: 1,
    title: 'Chapter 1: The Basics of Matter',
    subtitle: 'Before understanding metals, you must understand what builds them.',
    icon: Atom,
    color: '#6366f1',
    content: (
      <div className="chapter-content">
        <section className="content-section">
          <h3>1. Matter and Atoms</h3>
          <div className="definition-card">
            <span className="def-label">Matter</span>
            <p>Anything that has mass and takes up space. Everything around you is matter.</p>
          </div>
          <div className="definition-card highlight">
            <span className="def-label">The Atom</span>
            <p>The smallest indivisible unit of matter. An atom consists of three subatomic particles:</p>
            <ul className="particle-list">
              <li>
                <span className="particle proton">Protons</span>
                Positively charged particles found in the center (the nucleus).
              </li>
              <li>
                <span className="particle neutron">Neutrons</span>
                Particles with no charge (neutral), also in the nucleus.
              </li>
              <li>
                <span className="particle electron">Electrons</span>
                Negatively charged particles that orbit the nucleus in shells.
              </li>
            </ul>
          </div>
        </section>
        <section className="content-section">
          <h3>2. Elements vs. Compounds</h3>
          <div className="comparison-grid">
            <div className="definition-card">
              <span className="def-label">Element</span>
              <p>A pure substance made of only one type of atom (e.g., pure Gold, pure Oxygen). You cannot break an element down into a simpler substance.</p>
            </div>
            <div className="definition-card">
              <span className="def-label">Compound</span>
              <p>A substance formed when two or more different elements chemically bond together (e.g., H₂O is a compound of Hydrogen and Oxygen).</p>
            </div>
          </div>
        </section>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Chapter 2: The Physical Properties of Metals',
    subtitle: 'Metals are elements that readily lose electrons to form positive ions (cations).',
    icon: Layers,
    color: '#f59e0b',
    content: (
      <div className="chapter-content">
        <p className="intro-text">
          Because of their unique structure — often described as a <strong>"sea of electrons"</strong> — metals share specific physical traits that frequently appear on exams.
        </p>
        <section className="content-section">
          <h3>Key Physical Properties</h3>
          <div className="property-grid">
            <div className="property-card">
              <h4>State at Room Temperature</h4>
              <p>Almost all metals are solid at room temperature.</p>
              <div className="exam-tip">Exam Exception: Mercury (Hg) is the only metal that is liquid at room temperature.</div>
            </div>
            <div className="property-card">
              <h4>Metallic Luster</h4>
              <p>Metals have a shiny surface when freshly polished or cut.</p>
            </div>
            <div className="property-card">
              <h4>Malleability</h4>
              <p>Metals can be beaten into very thin sheets without breaking.</p>
              <div className="exam-tip">Exam Fact: Gold and silver are the most malleable metals.</div>
            </div>
            <div className="property-card">
              <h4>Ductility</h4>
              <p>Metals can be drawn or stretched into thin wires.</p>
              <div className="exam-tip">Exam Fact: Platinum and gold are highly ductile.</div>
            </div>
            <div className="property-card">
              <h4>Electrical &amp; Thermal Conductivity</h4>
              <p>Metals are excellent conductors of heat and electricity because their outer electrons are free to move.</p>
              <div className="exam-tip">Exam Fact: Silver and copper are the best conductors; Lead and mercury are comparatively poor conductors.</div>
            </div>
            <div className="property-card">
              <h4>High Melting &amp; Boiling Points</h4>
              <p>The bonds holding metal atoms together are very strong, requiring a lot of energy (heat) to break.</p>
            </div>
          </div>
        </section>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Chapter 3: The Chemical Properties of Metals',
    subtitle: 'How a metal reacts with its environment is a major focus in chemistry exams.',
    icon: FlaskConical,
    color: '#10b981',
    content: (
      <div className="chapter-content">
        <section className="content-section">
          <h3>1. Reaction with Oxygen</h3>
          <p>When metals react with oxygen in the air, they form metal oxides.</p>
          <div className="equation-card">
            <span className="eq-label">Word Equation</span>
            <p className="equation">Metal + Oxygen → Metal Oxide</p>
          </div>
          <div className="example-card">
            <strong>Example:</strong> Magnesium burns in air with a dazzling white flame to form Magnesium Oxide.
          </div>
        </section>
        <section className="content-section">
          <h3>2. Reaction with Water</h3>
          <p>Different metals react differently with water depending on their reactivity.</p>
          <div className="reactivity-grid">
            <div className="reactivity-card high">
              <h4>Highly Reactive</h4>
              <p className="metal-examples">Sodium, Potassium</p>
              <p>React <strong>violently</strong> with cold water to form a metal hydroxide and hydrogen gas.</p>
            </div>
            <div className="reactivity-card medium">
              <h4>Moderately Reactive</h4>
              <p className="metal-examples">Magnesium</p>
              <p>React very slowly with cold water but quickly with hot water or steam.</p>
            </div>
            <div className="reactivity-card low">
              <h4>Low Reactivity</h4>
              <p className="metal-examples">Gold, Silver</p>
              <p>Do <strong>not</strong> react with water at all.</p>
            </div>
          </div>
        </section>
        <section className="content-section">
          <h3>3. Reaction with Acids</h3>
          <p>Most metals react with dilute acids to form a salt and release hydrogen gas.</p>
          <div className="equation-card">
            <span className="eq-label">Word Equation</span>
            <p className="equation">Metal + Dilute Acid → Salt + Hydrogen Gas</p>
          </div>
          <div className="example-card">
            <strong>Example:</strong> Zinc + Hydrochloric Acid → Zinc Chloride + Hydrogen Gas
          </div>
        </section>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Chapter 4: Classification of Metals',
    subtitle: 'The Reactivity Series — metals ranked from most reactive to least reactive.',
    icon: Zap,
    color: '#a855f7',
    content: (
      <div className="chapter-content">
        <p className="intro-text">
          To predict how a metal will behave, scientists use the <strong>Reactivity Series</strong> — a list of metals ranked from most reactive to least reactive.
        </p>
        <section className="content-section">
          <div className="classification-grid">
            <div className="classification-card alkali">
              <div className="class-header">
                <h4>1. Alkali Metals</h4>
                <span className="group-badge">Group 1</span>
              </div>
              <p className="metal-examples">Lithium (Li), Sodium (Na), Potassium (K)</p>
              <p>These are the <strong>most reactive</strong> metals. They are so soft they can be cut with a knife. They must be stored under oil because they will violently react with the moisture in the air.</p>
            </div>
            <div className="classification-card alkaline">
              <div className="class-header">
                <h4>2. Alkaline Earth Metals</h4>
                <span className="group-badge">Group 2</span>
              </div>
              <p className="metal-examples">Magnesium (Mg), Calcium (Ca)</p>
              <p>Very reactive, but slightly less reactive and harder than Alkali metals.</p>
            </div>
            <div className="classification-card transition">
              <div className="class-header">
                <h4>3. Transition Metals</h4>
                <span className="group-badge">Center Block</span>
              </div>
              <p className="metal-examples">Iron (Fe), Copper (Cu), Gold (Au), Titanium (Ti)</p>
              <p>These are the "typical" metals you interact with daily. They are hard, dense, have high melting points, and are generally much less reactive. They often form beautifully colored compounds.</p>
            </div>
          </div>
        </section>
      </div>
    ),
  },
];

export const Syllabus = () => {
  const navigate = useNavigate();
  const [openChapters, setOpenChapters] = useState<Set<ChapterId>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizResults, setQuizResults] = useState<Record<string, 'correct' | 'wrong' | null>>({});

  const markStepVisited = useGameStore((s: any) => s.markStepVisited);
  const addPoints = useGameStore((s: any) => s.addPoints);

  useEffect(() => {
    markStepVisited(2);
  }, [markStepVisited]);

  const toggleChapter = (id: ChapterId) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleQuizAnswer = (quizKey: string, questionIdx: number, optionIdx: number, correctIdx: number) => {
    const key = `${quizKey}-${questionIdx}`;
    if (quizAnswers[key] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [key]: optionIdx }));
    if (optionIdx === correctIdx) {
      setQuizResults(prev => ({ ...prev, [key]: 'correct' }));
      addPoints(5);
    } else {
      setQuizResults(prev => ({ ...prev, [key]: 'wrong' }));
    }
  };

  return (
    <div className="syllabus-page">
      <div className="syllabus-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <button onClick={() => navigate('/lab')} className="back-btn">
            <ArrowLeft size={18} />
            <span>Back to Animations</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '32px', height: '4px', borderRadius: '2px', background: '#6366f1' }} />
              <div style={{ width: '32px', height: '4px', borderRadius: '2px', background: '#6366f1' }} />
              <div style={{ width: '32px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step 2 of 3</span>
          </div>
        </div>
        <div className="header-text">
          <h1>The Foundation of Matter</h1>
          <p>Your complete study guide — click any chapter to expand its content.</p>
        </div>
      </div>

      <div className="accordion-container">
        {chapters.map((chapter) => {
          const isOpen = openChapters.has(chapter.id);
          const Icon = chapter.icon;
          return (
            <div
              key={chapter.id}
              className={`accordion-item ${isOpen ? 'open' : ''}`}
              style={{ '--accent': chapter.color } as React.CSSProperties}
            >
              <button
                className="accordion-trigger"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="trigger-left">
                  <div className="chapter-icon">
                    <Icon size={24} />
                  </div>
                <div className="trigger-text">
                    <h2>{chapter.title}</h2>
                    <p>{chapter.subtitle}</p>
                  </div>
                  <div className="reading-time"><Clock size={12} />{readingTimes[chapter.id]}</div>
                </div>
                <div className={`chevron-wrap ${isOpen ? 'rotated' : ''}`}>
                  <ChevronDown size={22} />
                </div>
              </button>

              <div className="accordion-panel">
                <div className="panel-inner">
                  {chapter.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render quiz breaks after appropriate chapters */}
      {syllabusQuizzes.map((quiz) => (
        <div key={quiz.afterChapter} className="accordion-container" style={{ marginTop: '1rem' }}>
          <div className="quiz-break-card">
            <div className="quiz-break-header">
              <Zap size={16} className="text-amber-400" />
              <span>{quiz.title}</span>
              <span className="quiz-xp-badge">+5 XP each</span>
            </div>
            <div className="quiz-questions">
              {quiz.questions.map((q, qi) => {
                const key = `quiz-${quiz.afterChapter}-${qi}`;
                const selected = quizAnswers[key];
                const result = quizResults[key];
                return (
                  <div key={qi} className="quiz-question-block">
                    <p className="quiz-q">{qi + 1}. {q.q}</p>
                    <div className="quiz-options">
                      {q.opts.map((opt, oi) => {
                        let cls = 'quiz-opt ';
                        if (selected === undefined) {
                          cls += 'quiz-opt-default';
                        } else if (oi === q.correct) {
                          cls += 'quiz-opt-correct';
                        } else if (oi === selected && selected !== q.correct) {
                          cls += 'quiz-opt-wrong';
                        } else {
                          cls += 'quiz-opt-disabled';
                        }
                        return (
                          <button
                            key={oi}
                            className={cls}
                            onClick={() => handleQuizAnswer(`quiz-${quiz.afterChapter}`, qi, oi, q.correct)}
                          >
                            {opt}
                            {selected !== undefined && oi === q.correct && <CheckCircle2 size={14} />}
                            {selected !== undefined && oi === selected && selected !== q.correct && <XCircle size={14} />}
                          </button>
                        );
                      })}
                    </div>
                    {result && (
                      <div className={`quiz-explain ${result}`}>
                        {result === 'correct' ? '✨ Correct! — ' : 'Not quite — '}
                        {q.explain}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Continue CTA */}
      <div className="continue-section">
        <div className="continue-card">
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Ready for the next step?</h3>
            <p style={{ color: '#71717a', fontSize: '0.9rem' }}>Now that you understand the theory, explore every element in the Periodic Table.</p>
          </div>
          <button onClick={() => navigate('/periodic-table')} className="continue-btn">
            <Grid size={20} />
            Continue to Periodic Table
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
