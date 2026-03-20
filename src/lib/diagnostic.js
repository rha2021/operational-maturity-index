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
  operations: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Core work is not yet moving through consistent channels, triggers, and completion checks.',
      actions: [
        'Define the common steps for your highest-volume tasks, projects, or events.',
        'Set clear intake channels and triggers so new work starts in a predictable way.',
        'Track recurring activities and define what "done" means for core work.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Operational structure exists, but consistency still depends too heavily on local habits and memory.',
      actions: [
        'Reduce variation in how similar work is started, tracked, and closed.',
        'Make deadlines, schedules, and task triggers more visible across the team.',
        'Add checks to reduce missed work, late work, and inconsistent completion.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Operational routines are strong enough to support refinement, automation, and tighter performance management.',
      actions: [
        'Automate reminders, schedules, or handoffs for repeatable operational work.',
        'Use completion, timeliness, and rework data to improve delivery discipline.',
        'Review operational bottlenecks regularly before they become systemic issues.',
      ],
    },
  ],
  documentation: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Critical know-how is weakly documented, outdated, or disconnected from actual practice.',
      actions: [
        'Write down the core processes people rely on most often in one accessible location.',
        'Assign owners to keep key instructions, procedures, and policies current.',
        'Test whether a new person can follow the documentation with minimal support.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Documentation exists but is uneven, so people still rely on memory and informal workarounds.',
      actions: [
        'Review high-use documents when tools, rules, contacts, or steps change.',
        'Align documented procedures with how work is actually being carried out.',
        'Make unofficial workarounds visible and either formalise or remove them.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Documentation is supporting delivery well and can be used more deliberately for quality and resilience.',
      actions: [
        'Link process documents directly into onboarding, templates, and operating tools.',
        'Use consistent document structure and version control across critical processes.',
        'Monitor which instructions are used most and refresh them proactively.',
      ],
    },
  ],
  roles: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Responsibility and decision rights are unclear, increasing duplication, delay, and missed work.',
      actions: [
        'Map who leads, supports, and needs to be informed for recurring work.',
        'Define which decisions can be made independently and which need escalation.',
        'Add clearer handoff or assignment rules to prevent tasks being missed or duplicated.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Some role clarity exists, but recurring work still depends on local interpretation.',
      actions: [
        'Clarify decision thresholds for approvals, escalation, and independent action.',
        'Tighten ownership for tasks that commonly stall, bounce, or get done twice.',
        'Embed role and decision expectations into induction and team routines.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Roles and decisions are clear enough to support stronger delegation and smoother execution.',
      actions: [
        'Review decision rights as responsibilities evolve across teams.',
        'Use role clarity to shorten approval chains and reduce unnecessary escalation.',
        'Audit recurring work regularly for hidden duplication or accountability gaps.',
      ],
    },
  ],
  reporting: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Evidence capture and reporting are too inconsistent to support reliable oversight or decision-making.',
      actions: [
        'Define what evidence should be recorded during delivery, not reconstructed later.',
        'Create simple reporting templates with consistent fields and headings.',
        'Assign clear reporting owners, inputs, and due dates.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Reporting exists, but inconsistent inputs and ownership reduce reliability and timeliness.',
      actions: [
        'Standardise key data fields and definitions across recurring reports.',
        'Reduce last-minute chasing by confirming report responsibilities and source data earlier.',
        'Review where evidence is being captured late or inconsistently and fix the process upstream.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Evidence capture and reporting are reliable enough to support stronger oversight and proactive improvement.',
      actions: [
        'Automate recurring reports where source information is stable and trusted.',
        'Use trend analysis and exceptions, not just summary updates, in reviews.',
        'Feed reporting insights back into planning, delivery, and resourcing decisions.',
      ],
    },
  ],
  control: [
    {
      maxAverage: 1.99,
      band: 'Priority rebuild',
      summary: 'Training, access control, and change communication are too weak to reliably protect operating quality.',
      actions: [
        'Introduce basic induction or training for key processes and compliance requirements.',
        'Record who has access to important systems, files, and tools.',
        'Log and communicate changes to processes, documents, and systems in one place.',
      ],
    },
    {
      maxAverage: 2.99,
      band: 'Stabilise',
      summary: 'Basic controls exist, but they are not yet consistent enough to reduce operational risk.',
      actions: [
        'Review whether training is reaching everyone expected to follow key processes.',
        'Tighten access reviews when staff, volunteer, or contractor roles change.',
        'Make operational changes more visible so outdated templates or instructions are not reused.',
      ],
    },
    {
      maxAverage: 4,
      band: 'Scale',
      summary: 'Controls are strong enough to support safer scaling, faster onboarding, and cleaner operational change.',
      actions: [
        'Schedule regular access reviews for critical systems and sensitive information.',
        'Track training completion and refreshers for high-risk or high-volume processes.',
        'Use change logs to support version control, communication, and audit readiness.',
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
    operations_score: results.dimensionScores.operations.average,
    workflow_score: results.dimensionScores.operations.average,
    documentation_score: results.dimensionScores.documentation.average,
    reporting_score: results.dimensionScores.reporting.average,
    roles_score: results.dimensionScores.roles.average,
    control_score: results.dimensionScores.control.average,
    dimension_scores: results.dimensionScores,
    answers: Object.values(answers),
    all_answers_JSON: JSON.stringify(Object.values(answers)),
  }
}
