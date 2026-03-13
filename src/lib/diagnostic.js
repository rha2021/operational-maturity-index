import { SCORECARD_DIMENSIONS } from '../data/questions'

const MATURITY_LEVELS = [
  {
    min: 0,
    max: 25,
    label: 'Chaotic',
    description: 'Work depends on individuals more than systems, creating fragility and inconsistency.',
  },
  {
    min: 26,
    max: 50,
    label: 'Reactive',
    description: 'Some structure exists, but inconsistency still creates delivery risk and avoidable waste.',
  },
  {
    min: 51,
    max: 75,
    label: 'Structured',
    description: 'Core operating systems exist and generally work, with clear room to strengthen resilience.',
  },
  {
    min: 76,
    max: 100,
    label: 'Optimised',
    description: 'Operations are scalable, measurable, and built for sustained improvement.',
  },
]

const RECOMMENDATION_RULES = {
  workflow: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Work is moving through informal pathways, which makes delivery fragile and hard to forecast.',
      actions: [
        'Create a single intake path for new work and change requests.',
        'Define the minimum workflow stages every initiative must move through.',
        'Introduce one shared view of in-flight work so bottlenecks are visible.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Workflow foundations exist, but consistency and visibility still depend on team habits.',
      actions: [
        'Reduce local process variation between teams doing similar work.',
        'Set clear rules for handoffs, approvals, and status updates.',
        'Track rework and duplicate effort to identify the biggest workflow leaks.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Workflow discipline is strong enough to support refinement, automation, and proactive management.',
      actions: [
        'Automate repetitive workflow updates and reminders.',
        'Add service-level targets or throughput metrics for critical work types.',
        'Review workflow data monthly to remove friction before it compounds.',
      ],
    },
  ],
  documentation: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Critical know-how is weakly documented, creating key-person risk and slower execution.',
      actions: [
        'Create a central process library for the highest-risk activities first.',
        'Assign an owner for maintaining each critical document or SOP.',
        'Standardise onboarding instructions so new staff can follow the work independently.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Documentation exists but is uneven, which limits trust and reuse across the organisation.',
      actions: [
        'Introduce a review cycle for high-use documents and archive outdated versions.',
        'Apply a common template so procedures are easier to scan and compare.',
        'Test documents with a new user to find missing context or decision steps.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Documentation is supporting execution well and can now be used as a leverage point for scale.',
      actions: [
        'Link process documentation directly to workflow tools and onboarding journeys.',
        'Measure document usage to identify gaps in findability or relevance.',
        'Add versioning and change summaries for critical operating documents.',
      ],
    },
  ],
  reporting: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Reporting is too weak to reliably support decisions, accountability, or evidence-based improvement.',
      actions: [
        'Define the few operational metrics that matter most and collect them consistently.',
        'Set a regular reporting rhythm with named owners and audiences.',
        'Standardise what evidence must be captured as work is completed.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Reporting is present but uneven, reducing trust in the numbers and slowing decisions.',
      actions: [
        'Tighten data definitions so teams report against the same criteria.',
        'Separate executive summary reporting from detailed operational reporting.',
        'Review missing or late reports to identify recurring process failure points.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Reporting is reliable enough to shift from retrospective updates to proactive operational insight.',
      actions: [
        'Automate recurring reports where source data quality is stable.',
        'Use trends and exceptions, not just snapshots, in leadership reviews.',
        'Feed reporting insights back into workflow and resourcing decisions each cycle.',
      ],
    },
  ],
  roles: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Ownership and decision rights are unclear, which increases delay, duplication, and conflict.',
      actions: [
        'Map ownership for core processes and recurring decisions.',
        'Define who decides, who contributes, and who is informed for critical work.',
        'Document escalation paths for stalled work or conflicting priorities.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Role clarity exists in parts of the organisation but is not yet consistent enough to remove friction.',
      actions: [
        'Review cross-functional touchpoints where work commonly stalls or loops.',
        'Clarify accountability for outcomes, not just task completion.',
        'Embed role and authority expectations into onboarding and team rituals.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Role clarity is strong and can now support delegation, autonomy, and better operational tempo.',
      actions: [
        'Refresh decision-rights maps as teams and responsibilities evolve.',
        'Use role clarity to shorten approval chains and reduce unnecessary escalation.',
        'Audit accountability gaps quarterly for major operating processes.',
      ],
    },
  ],
}

export function formatDimensionLabel(dimension) {
  return SCORECARD_DIMENSIONS.find((item) => item.key === dimension)?.label ?? dimension
}

export function calculateResults(questions, answersById) {
  const normalizedAnswers = questions
    .map((question) => answersById[question.id])
    .filter(Boolean)

  const totalScore = normalizedAnswers.reduce((sum, answer) => sum + answer.score, 0)
  const maxScore = questions.length * 4
  const overallPercent = maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100)

  const dimensionScores = SCORECARD_DIMENSIONS.reduce((accumulator, dimension) => {
    const dimensionQuestions = questions.filter((question) => question.dimension === dimension.key)
    const dimensionAnswers = dimensionQuestions
      .map((question) => answersById[question.id])
      .filter(Boolean)
    const answeredScore = dimensionAnswers.reduce((sum, answer) => sum + answer.score, 0)
    const average =
      dimensionQuestions.length === 0 ? 0 : answeredScore / dimensionQuestions.length

    accumulator[dimension.key] = {
      average,
      percent: Math.round((average / 4) * 100),
      answered: dimensionAnswers.length,
      total: dimensionQuestions.length,
    }

    return accumulator
  }, {})

  const weakestDimension = SCORECARD_DIMENSIONS.reduce((lowest, dimension) => {
    if (!lowest) {
      return dimension.key
    }

    return dimensionScores[dimension.key].average < dimensionScores[lowest].average
      ? dimension.key
      : lowest
  }, '')

  const maturityLevel =
    MATURITY_LEVELS.find((item) => overallPercent >= item.min && overallPercent <= item.max) ??
    MATURITY_LEVELS[0]

  return {
    totalScore,
    maxScore,
    overallPercent,
    maturityLevel: maturityLevel.label,
    maturityDescription: maturityLevel.description,
    weakestDimension,
    dimensionScores,
  }
}

export function getRecommendationBlocks(dimensionScores) {
  return SCORECARD_DIMENSIONS.map((dimension) => {
    const average = dimensionScores[dimension.key]?.average ?? 0
    const rule = RECOMMENDATION_RULES[dimension.key].find((item) => average <= item.maxAverage)

    return {
      dimension: dimension.key,
      ...rule,
    }
  })
}

export function buildLeadPayload({ leadForm, results, answers }) {
  return {
    timestamp: new Date().toISOString(),
    first_name: leadForm.firstName.trim(),
    last_name: leadForm.lastName.trim(),
    email: leadForm.email.trim(),
    organisation: leadForm.organisation.trim(),
    overall_score: results.overallPercent,
    maturity_level: results.maturityLevel,
    weakest_dimension: results.weakestDimension,
    workflow_score: results.dimensionScores.workflow.average,
    documentation_score: results.dimensionScores.documentation.average,
    reporting_score: results.dimensionScores.reporting.average,
    roles_score: results.dimensionScores.roles.average,
    dimension_scores: results.dimensionScores,
    answers: Object.values(answers),
    all_answers_JSON: JSON.stringify(Object.values(answers)),
  }
}
