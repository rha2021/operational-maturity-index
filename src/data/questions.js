export const SCORECARD_DIMENSIONS = [
  {
    key: 'workflow',
    label: 'Workflow',
    description:
      'Measures how consistently work moves through the organisation, including intake, handoffs, duplication risk, and visibility.',
  },
  {
    key: 'documentation',
    label: 'Documentation',
    description:
      'Measures whether processes are documented, maintained, and usable by others without relying on one person.',
  },
  {
    key: 'reporting',
    label: 'Reporting',
    description:
      'Measures how evidence, data, and outputs are captured, reviewed, and communicated.',
  },
  {
    key: 'roles',
    label: 'Roles & Responsibilities',
    description:
      'Measures clarity of ownership, decision authority, accountability, and escalation paths.',
  },
]

export const QUESTIONS = [
  {
    id: 'workflow-intake',
    dimension: 'workflow',
    prompt: 'How consistently is incoming work captured through a defined intake process?',
  },
  {
    id: 'workflow-steps',
    dimension: 'workflow',
    prompt: 'How clearly are the key stages of work defined from start to finish?',
  },
  {
    id: 'workflow-visibility',
    dimension: 'workflow',
    prompt: 'How visible is current work status across the organisation?',
  },
  {
    id: 'workflow-duplication',
    dimension: 'workflow',
    prompt: 'How effectively do your workflows reduce duplication, rework, or conflicting effort?',
  },
  {
    id: 'documentation-processes',
    dimension: 'documentation',
    prompt: 'How well are critical operating procedures documented in a central location?',
  },
  {
    id: 'documentation-maintenance',
    dimension: 'documentation',
    prompt: 'How consistently is documentation reviewed and kept up to date?',
  },
  {
    id: 'documentation-clarity',
    dimension: 'documentation',
    prompt: 'How usable is your documentation for someone who did not create the process?',
  },
  {
    id: 'documentation-onboarding',
    dimension: 'documentation',
    prompt: 'How much does onboarding rely on documented instructions rather than verbal handover?',
  },
  {
    id: 'reporting-evidence',
    dimension: 'reporting',
    prompt: 'How consistently do teams capture evidence and operational data as work happens?',
  },
  {
    id: 'reporting-accuracy',
    dimension: 'reporting',
    prompt: 'How reliable and decision-ready are the reports produced by the organisation?',
  },
  {
    id: 'reporting-rhythm',
    dimension: 'reporting',
    prompt: 'How regular is your reporting cadence for operational performance or delivery?',
  },
  {
    id: 'reporting-communication',
    dimension: 'reporting',
    prompt: 'How clearly are outputs and performance insights communicated to stakeholders?',
  },
  {
    id: 'roles-ownership',
    dimension: 'roles',
    prompt: 'How clearly is ownership assigned for core processes and recurring work?',
  },
  {
    id: 'roles-authority',
    dimension: 'roles',
    prompt: 'How clearly is decision authority defined across teams or functions?',
  },
  {
    id: 'roles-accountability',
    dimension: 'roles',
    prompt: 'How consistently are people held accountable for expected outcomes?',
  },
  {
    id: 'roles-escalation',
    dimension: 'roles',
    prompt: 'How clearly do people know where to escalate blockers or unresolved decisions?',
  },
]

export const RESPONSE_OPTIONS = [
  {
    score: 0,
    label: 'Not in place',
    meaning: 'No defined structure exists.',
  },
  {
    score: 1,
    label: 'Early',
    meaning: 'Practices are informal or inconsistent.',
  },
  {
    score: 2,
    label: 'Developing',
    meaning: 'Some structure exists but it is not yet consistent.',
  },
  {
    score: 3,
    label: 'Established',
    meaning: 'Processes are reliable and repeatable.',
  },
  {
    score: 4,
    label: 'Optimised',
    meaning: 'Practices are automated, monitored, and continuously improved.',
  },
]
