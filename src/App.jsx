import { useMemo, useState } from 'react'
import { QUESTIONS, RESPONSE_OPTIONS, SCORECARD_DIMENSIONS } from './data/questions'
import {
  buildLeadPayload,
  calculateResults,
  formatDimensionLabel,
  getRecommendationBlocks,
} from './lib/diagnostic'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

const STAGES = {
  intro: 'intro',
  howItWorks: 'howItWorks',
  questionnaire: 'questionnaire',
  results: 'results',
}

const INITIAL_LEAD_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  organisation: '',
}

const INITIAL_SUBMISSION_STATE = {
  status: 'idle',
  error: '',
  submittedAt: '',
}

const MATURITY_BADGE_STYLES = {
  Chaotic: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  Reactive: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  Structured: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
  Optimised: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
}

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Answer the questions',
    description:
      'Work through 20 short questions covering operations, documentation, roles, reporting, and controls.',
  },
  {
    title: 'Choose what matches today',
    description:
      'Pick the option that best reflects how things really work now, not how they are meant to work.',
  },
  {
    title: 'See where the pressure points are',
    description:
      'You will get an overall score, section results, and a clear view of the area most likely to cause friction.',
  },
]

const HERO_INSIGHTS = [
  'Work that depends too heavily on one person',
  'Tasks that are missed, duplicated, or delayed',
  'Outdated or missing process documentation',
  'Reporting that is rebuilt at the last minute',
  'Unclear ownership or decision-making',
]

function PrintableReport({ results, recommendations, leadForm }) {
  return (
    <div className="hidden print:block">
      <div className="report-page">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
          Operational Maturity Index
        </p>
        <h1 className="mt-6 text-4xl font-semibold text-stone-900">Diagnostic Summary</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
          Report prepared for {leadForm.firstName} {leadForm.lastName}
          {leadForm.organisation ? `, ${leadForm.organisation}` : ''}.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Score</p>
            <p className="mt-4 text-5xl font-semibold text-stone-900">
              {results.overallPercent}%
            </p>
          </div>
          <div className="rounded-3xl border border-stone-200 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Maturity</p>
            <p className="mt-4 text-3xl font-semibold text-stone-900">
              {results.maturityLevel}
            </p>
          </div>
          <div className="rounded-3xl border border-stone-200 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
              Weakest dimension
            </p>
            <p className="mt-4 text-3xl font-semibold text-stone-900">
              {formatDimensionLabel(results.weakestDimension)}
            </p>
          </div>
        </div>
      </div>

      <div className="report-page report-page-break">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Dimension Breakdown</p>
        <h2 className="mt-6 text-3xl font-semibold text-stone-900">
          Operational capability by dimension
        </h2>
        <div className="mt-10 space-y-5">
          {SCORECARD_DIMENSIONS.map((dimension) => {
            const dimensionData = results.dimensionScores[dimension.key]

            return (
              <div
                key={dimension.key}
                className="rounded-3xl border border-stone-200 px-6 py-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900">{dimension.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Average score {dimensionData.average.toFixed(1)} / 4.0
                    </p>
                  </div>
                  <p className="text-3xl font-semibold text-stone-900">
                    {dimensionData.percent}%
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="report-page report-page-break">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Recommendations</p>
        <h2 className="mt-6 text-3xl font-semibold text-stone-900">Priority actions</h2>
        <div className="mt-10 space-y-8">
          {recommendations.map((item) => (
            <section key={item.dimension} className="rounded-3xl border border-stone-200 p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold text-stone-900">
                  {formatDimensionLabel(item.dimension)}
                </h3>
                <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{item.band}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{item.summary}</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
                {item.actions.map((action) => (
                  <li key={action}>- {action}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [stage, setStage] = useState(STAGES.intro)
  const [answers, setAnswers] = useState({})
  const [questionIndex, setQuestionIndex] = useState(0)
  const [leadForm, setLeadForm] = useState(INITIAL_LEAD_FORM)
  const [submission, setSubmission] = useState(INITIAL_SUBMISSION_STATE)
  const [showLeadCapture, setShowLeadCapture] = useState(false)

  const currentQuestion = QUESTIONS[questionIndex]
  const answeredCount = Object.keys(answers).length
  const allQuestionsAnswered = answeredCount === QUESTIONS.length

  const results = useMemo(() => calculateResults(QUESTIONS, answers), [answers])
  const recommendations = useMemo(
    () => getRecommendationBlocks(results.dimensionScores),
    [results.dimensionScores],
  )

  function updateAnswer(question, score) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]: {
        questionId: question.id,
        dimension: question.dimension,
        score,
      },
    }))
  }

  function goToNextQuestion() {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((current) => current + 1)
      return
    }

    setStage(STAGES.results)
  }

  function handleLeadFieldChange(event) {
    const { name, value } = event.target
    setLeadForm((current) => ({ ...current, [name]: value }))
  }

  async function handleLeadSubmit(event) {
    event.preventDefault()

    if (!APPS_SCRIPT_URL) {
      setSubmission({
        status: 'error',
        error: 'Set VITE_APPS_SCRIPT_URL to enable report downloads and lead capture.',
        submittedAt: '',
      })
      return
    }

    setSubmission({
      status: 'submitting',
      error: '',
      submittedAt: '',
    })

    try {
      const payload = buildLeadPayload({
        leadForm,
        results,
        answers,
      })

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}.`)
      }

      setSubmission({
        status: 'submitted',
        error: '',
        submittedAt: new Date().toISOString(),
      })
      setShowLeadCapture(false)
      window.print()
    } catch (error) {
      setSubmission({
        status: 'error',
        error:
          error instanceof Error
            ? error.message
            : 'The report could not be submitted. Please try again.',
        submittedAt: '',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(234,179,8,0.22),_transparent_26%),linear-gradient(180deg,_#f7f2e8_0%,_#f3efe7_40%,_#f8f6f1_100%)] text-stone-900 print:bg-white">
      <PrintableReport
        results={results}
        recommendations={recommendations}
        leadForm={leadForm}
      />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-12 print:hidden">
        <header className="flex items-center justify-between border-b border-stone-300/60 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Operational Maturity Index
            </p>
            <h1 className="mt-2 text-lg font-semibold text-stone-900">
              Organisational Chaos Index
            </h1>
          </div>
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm text-stone-600 shadow-sm ring-1 ring-stone-200">
            {answeredCount} / {QUESTIONS.length} responses
          </div>
        </header>

        {stage === STAGES.intro && (
          <section className="grid flex-1 items-center gap-8 py-10 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                DIAGNOSTIC FOR OPERATIONAL MATURITY
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl leading-[1.08] tracking-tight text-stone-900 sm:text-5xl">
                Understand how your organisation actually operates.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
                This 5-minute diagnostic reveals workflow risks, unclear roles,
                documentation gaps, and reporting weaknesses.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-500">
                No preparation needed. Answer based on how things really work today.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStage(STAGES.howItWorks)}
                  className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => setStage(STAGES.results)}
                  disabled={!allQuestionsAnswered}
                  className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
                >
                  View latest results
                </button>
              </div>
            </div>

            <aside className="rounded-2xl border border-stone-200/90 bg-white/72 p-6 shadow-sm shadow-stone-200/30 sm:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                What this helps you spot
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-stone-600">
                A quick view of the operational weak points that often stay hidden until
                work slows down, people leave, or reporting is due.
              </p>
              <ul className="mt-5 space-y-3">
                {HERO_INSIGHTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-t border-stone-200/80 pt-3 first:border-t-0 first:pt-0"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span className="text-sm leading-6 text-stone-700">{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </section>
        )}

        {stage === STAGES.howItWorks && (
          <section className="flex flex-1 flex-col py-8 sm:py-10">
            <div className="mx-auto w-full max-w-5xl">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
                  Before you begin
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                  A practical check of how work really runs.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
                  This assessment helps organisations, teams, community groups, and
                  service providers spot where everyday work is clear and dependable, and
                  where it still relies on memory, workarounds, or last-minute effort.
                </p>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {HOW_IT_WORKS_STEPS.map((step, index) => (
                  <article
                    key={step.title}
                    className="flex h-full gap-4 rounded-xl border border-stone-200 bg-white/70 p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-stone-50 text-sm font-semibold text-stone-700">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                  What we look at
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  The questions are grouped into five sections. Each answer uses a simple
                  five-point scale, then the tool highlights your overall maturity, section
                  scores, and the area that most needs attention.
                </p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {SCORECARD_DIMENSIONS.map((dimension) => (
                  <article
                    key={dimension.key}
                    className="flex h-full flex-col rounded-xl border border-stone-200 bg-white/68 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      {dimension.label}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {dimension.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStage(STAGES.questionnaire)
                    setQuestionIndex(0)
                  }}
                  className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                >
                  Begin questions
                </button>
                <button
                  type="button"
                  onClick={() => setStage(STAGES.intro)}
                  className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                >
                  Back
                </button>
              </div>
            </div>
          </section>
        )}

        {stage === STAGES.questionnaire && currentQuestion && (
          <section className="flex flex-1 flex-col py-6 sm:py-8">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col rounded-2xl border border-stone-200 bg-white/88 p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                    {formatDimensionLabel(currentQuestion.dimension)}
                  </p>
                  <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                    {currentQuestion.prompt}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                    {currentQuestion.helper}
                  </p>
                </div>
                <p className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-700">
                  {questionIndex + 1} of {QUESTIONS.length}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                  <span>Progress</span>
                  <span>{Math.round(((questionIndex + 1) / QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-stone-100">
                  <div
                    className="h-1.5 rounded-full bg-amber-500 transition-all"
                    style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex-1 rounded-[1.5rem] border border-stone-200 bg-stone-50/75 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                  <span>Scale</span>
                  <span>{answers[currentQuestion.id]?.score ?? 'Select 0-4'}</span>
                </div>

                <div className="relative mt-5 px-2 sm:px-4">
                  <div className="absolute left-6 right-6 top-5 h-px bg-stone-300 sm:left-8 sm:right-8" />
                  <div className="relative grid grid-cols-5 gap-2 sm:gap-3">
                    {RESPONSE_OPTIONS.map((option) => {
                      const isSelected = answers[currentQuestion.id]?.score === option.score

                      return (
                        <button
                          key={option.score}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => updateAnswer(currentQuestion, option.score)}
                          className="group flex flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                        >
                          <span
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition sm:h-12 sm:w-12 ${
                              isSelected
                                ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                                : 'border-stone-300 bg-white text-stone-700 group-hover:border-stone-500'
                            }`}
                          >
                            {option.score}
                          </span>
                          <span
                            className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-xs ${
                              isSelected ? 'text-stone-900' : 'text-stone-500'
                            }`}
                          >
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 max-w-[9rem] text-xs leading-5 sm:text-sm ${
                              isSelected ? 'text-stone-700' : 'text-stone-500'
                            }`}
                          >
                            {option.meaning}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 mt-5 border-t border-stone-200 bg-white/95 pt-4 backdrop-blur-sm">
                <div className="flex flex-wrap justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (questionIndex === 0) {
                        setStage(STAGES.howItWorks)
                        return
                      }

                      setQuestionIndex((current) => current - 1)
                    }}
                    className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goToNextQuestion}
                    disabled={!answers[currentQuestion.id]}
                    className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-300"
                  >
                    {questionIndex === QUESTIONS.length - 1 ? 'See results' : 'Next question'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {stage === STAGES.results && (
          <section className="flex flex-1 flex-col py-14">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] bg-stone-900 p-8 text-stone-50 shadow-2xl shadow-stone-300/20">
                <p className="text-sm uppercase tracking-[0.35em] text-stone-300">Results</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-tight">
                  {results.overallPercent}% operational maturity
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-stone-200">
                  {results.maturityDescription}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      MATURITY_BADGE_STYLES[results.maturityLevel]
                    }`}
                  >
                    {results.maturityLevel}
                  </span>
                  <span className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-200">
                    Weakest dimension: {formatDimensionLabel(results.weakestDimension)}
                  </span>
                </div>
              </div>

              <div className="rounded-[2rem] border border-stone-200 bg-white/85 p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Dimensions</p>
                <div className="mt-6 space-y-5">
                  {SCORECARD_DIMENSIONS.map((dimension) => {
                    const dimensionData = results.dimensionScores[dimension.key]

                    return (
                      <div key={dimension.key}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-stone-900">{dimension.label}</h3>
                            <p className="mt-1 text-sm text-stone-500">
                              {dimensionData.average.toFixed(1)} / 4.0 average
                            </p>
                          </div>
                          <p className="text-2xl font-semibold text-stone-900">
                            {dimensionData.percent}%
                          </p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-stone-100">
                          <div
                            className="h-2 rounded-full bg-stone-900"
                            style={{ width: `${dimensionData.percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[2rem] border border-stone-200 bg-white/80 p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                  Recommendations
                </p>
                <div className="mt-6 space-y-6">
                  {recommendations.map((item) => (
                    <article key={item.dimension} className="rounded-[1.5rem] bg-stone-50 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold text-stone-900">
                          {formatDimensionLabel(item.dimension)}
                        </h3>
                        <span className="text-xs uppercase tracking-[0.25em] text-stone-500">
                          {item.band}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-stone-600">{item.summary}</p>
                      <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-700">
                        {item.actions.map((action) => (
                          <li key={action}>- {action}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-stone-200 bg-white/80 p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Download report</p>
                <h3 className="mt-4 text-2xl font-semibold text-stone-900">
                  Capture lead details before generating the PDF.
                </h3>
                <p className="mt-4 text-sm leading-6 text-stone-600">
                  The report is generated in the browser after the submission is logged to
                  your configured Google Sheet through Apps Script.
                </p>

                <div className="mt-8 space-y-4">
                  {!showLeadCapture && (
                    <button
                      type="button"
                      onClick={() => setShowLeadCapture(true)}
                      className="w-full rounded-full bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-700"
                    >
                      Download report
                    </button>
                  )}

                  {showLeadCapture && (
                    <form className="space-y-4" onSubmit={handleLeadSubmit}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-stone-700">
                          First name
                          <input
                            required
                            name="firstName"
                            value={leadForm.firstName}
                            onChange={handleLeadFieldChange}
                            className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                          />
                        </label>
                        <label className="text-sm font-medium text-stone-700">
                          Last name
                          <input
                            required
                            name="lastName"
                            value={leadForm.lastName}
                            onChange={handleLeadFieldChange}
                            className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                          />
                        </label>
                      </div>

                      <label className="block text-sm font-medium text-stone-700">
                        Email
                        <input
                          required
                          type="email"
                          name="email"
                          value={leadForm.email}
                          onChange={handleLeadFieldChange}
                          className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                        />
                      </label>

                      <label className="block text-sm font-medium text-stone-700">
                        Organisation
                        <input
                          name="organisation"
                          value={leadForm.organisation}
                          onChange={handleLeadFieldChange}
                          className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={submission.status === 'submitting'}
                        className="w-full rounded-full bg-amber-500 px-6 py-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:bg-amber-300"
                      >
                        {submission.status === 'submitting'
                          ? 'Submitting...'
                          : 'Submit and generate PDF'}
                      </button>
                    </form>
                  )}

                  {submission.status === 'error' && (
                    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {submission.error}
                    </p>
                  )}

                  {submission.status === 'submitted' && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Submission logged. If the print dialog did not open, use your browser&apos;s
                      print command to save this page as a PDF.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setStage(STAGES.questionnaire)}
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
              >
                Review answers
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnswers({})
                  setQuestionIndex(0)
                  setLeadForm(INITIAL_LEAD_FORM)
                  setSubmission(INITIAL_SUBMISSION_STATE)
                  setShowLeadCapture(false)
                  setStage(STAGES.intro)
                }}
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
              >
                Start over
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
