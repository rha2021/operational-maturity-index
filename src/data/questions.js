export const SCORECARD_DIMENSIONS = [
  {
    key: 'operations',
    label: 'Operations',
    description:
      'Measures whether recurring work arrives clearly, follows repeatable steps, and is tracked through to completion.',
  },
  {
    key: 'documentation',
    label: 'Documentation',
    description:
      'Measures whether core processes are written down, kept current, and usable by others with minimal support.',
  },
  {
    key: 'roles',
    label: 'Roles and Decisions',
    description:
      'Measures clarity of responsibility, contribution, decision authority, and escalation for recurring work.',
  },
  {
    key: 'reporting',
    label: 'Evidence and Reporting',
    description:
      'Measures how evidence is captured, reports are standardised, and reporting responsibilities are managed.',
  },
  {
    key: 'control',
    label: 'Control, Access and Change Management',
    description:
      'Measures training coverage, system access controls, and how operational changes are recorded and communicated.',
  },
]

export const QUESTIONS = [
  {
    id: 'operations-repeatability',
    dimension: 'operations',
    prompt: 'Do your most common tasks, projects, or events follow similar steps each time?',
    helper:
      'For example: organising an event, onboarding someone new, or responding to enquiries usually happens in a similar way each time.',
  },
  {
    id: 'operations-intake',
    dimension: 'operations',
    prompt: 'Does new work usually arrive through clear and consistent channels?',
    helper:
      'For example: a shared email, phone number, online form, message system, or a person responsible for receiving requests.',
  },
  {
    id: 'operations-triggers',
    dimension: 'operations',
    prompt: 'People know when work needs to start and what triggers it.',
    helper:
      'For example: a schedule, deadline, new request, roster, approval, or regular routine tells people when to begin.',
  },
  {
    id: 'operations-tracking',
    dimension: 'operations',
    prompt: 'Regular activities are tracked so they happen on time.',
    helper:
      'For example: meetings, renewals, reporting dates, programme sessions, follow-ups, or compliance tasks are scheduled and monitored.',
  },
  {
    id: 'operations-definition-of-done',
    dimension: 'operations',
    prompt:
      'For core work, people agree what "done" looks like and check it before it is considered complete.',
    helper:
      'For example: there is a shared understanding of what needs to be delivered, and someone confirms it meets the required standard before closing the task.',
  },
  {
    id: 'documentation-core-processes',
    dimension: 'documentation',
    prompt: 'Core processes are written down somewhere the team can easily access.',
    helper:
      'This could be a shared folder, handbook, online system, intranet, or a simple document everyone knows where to find.',
  },
  {
    id: 'documentation-updates',
    dimension: 'documentation',
    prompt: 'Process instructions are kept up to date when things change.',
    helper:
      'For example: when a process, rule, tool, or contact changes, the written steps are updated so people are not following outdated information.',
  },
  {
    id: 'documentation-usability',
    dimension: 'documentation',
    prompt: 'A new person could follow the written steps for core tasks with minimal help.',
    helper:
      'For example: someone new joining the team could use the instructions to complete the task without needing constant guidance.',
  },
  {
    id: 'documentation-policies',
    dimension: 'documentation',
    prompt:
      'There are clear documented policies or procedures for routine tasks, projects, and reporting.',
    helper:
      'For example: the organisation has written guidance for how work should be done, managed, recorded, and reported.',
  },
  {
    id: 'documentation-alignment',
    dimension: 'documentation',
    prompt: 'The way work is actually done usually matches the documented process.',
    helper:
      'For example: staff and volunteers generally follow the written process rather than relying on memory, shortcuts, or informal workarounds.',
  },
  {
    id: 'documentation-unofficial-work',
    dimension: 'documentation',
    prompt: 'Unrecorded or unofficial ways of doing work are limited and visible.',
    helper:
      "For example: the organisation is aware of any workarounds, verbal-only instructions, or 'how we really do it' practices, rather than discovering them when someone leaves.",
  },
  {
    id: 'roles-responsibility',
    dimension: 'roles',
    prompt: 'For recurring work, it is clear who is responsible and who contributes.',
    helper:
      'For example: people know who leads the task, who supports it, and who needs to be informed.',
  },
  {
    id: 'roles-decision-rights',
    dimension: 'roles',
    prompt:
      'People know what decisions they can make themselves and when they need approval or escalation.',
    helper:
      'For example: staff or volunteers understand when they can proceed independently and when they need to involve a manager, board member, or another team.',
  },
  {
    id: 'roles-duplication-risk',
    dimension: 'roles',
    prompt:
      "Work is unlikely to be duplicated, missed, or assumed to be someone else's job.",
    helper:
      'For example: tasks are clearly assigned, tracked, or handed over so they do not get lost or done twice.',
  },
  {
    id: 'reporting-evidence-capture',
    dimension: 'reporting',
    prompt:
      'Evidence of work and outcomes is recorded as activities happen, not rebuilt later.',
    helper:
      'For example: attendance, case notes, actions completed, outputs, or results are captured during the work rather than reconstructed at reporting time.',
  },
  {
    id: 'reporting-format',
    dimension: 'reporting',
    prompt:
      'Reports usually follow a consistent format and include the same key information each time.',
    helper:
      'For example: reports use templates, standard headings, agreed data fields, or defined measures so leaders, funders, or partners receive consistent information.',
  },
  {
    id: 'reporting-ownership',
    dimension: 'reporting',
    prompt:
      'It is clear who prepares reports, what information is needed, and when reporting is due.',
    helper:
      'For example: reporting responsibilities, deadlines, and source information are known and usually met without last-minute chasing.',
  },
  {
    id: 'control-training',
    dimension: 'control',
    prompt: 'Staff receive training or induction on the processes they are expected to follow.',
    helper:
      'For example: people are shown how to complete key tasks, use templates, follow procedures, and understand any compliance or quality requirements.',
  },
  {
    id: 'control-access',
    dimension: 'control',
    prompt: 'Access to systems, files, and tools is controlled, recorded, and reviewed.',
    helper:
      'For example: the organisation knows who has access to shared drives, software, reporting tools, finance systems, or client records, and access is removed or updated when roles change.',
  },
  {
    id: 'control-change-management',
    dimension: 'control',
    prompt: 'Changes to processes, documents, or systems are logged and communicated.',
    helper:
      'For example: when a process, template, policy, or system changes, there is a record of what changed, when it changed, and who needs to know.',
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
