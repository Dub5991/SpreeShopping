# Meeting Notes Skill

## Description
Captures, organizes, and manages meeting notes including agendas, discussions, decisions, and action items. Helps ensure accountability and follow-through.

## Capabilities
- Create meeting agendas
- Take structured meeting notes
- Document decisions and outcomes
- Track action items with owners and deadlines
- Generate meeting summaries
- Send meeting recaps
- Search historical meetings
- Link meetings to projects and clients

## Example Usage

### Create Meeting Agenda
```
Create an agenda for tomorrow's project kickoff meeting with TechCorp at 2 PM. Include introductions, project overview, timeline review, roles and responsibilities, and next steps.
```

### Take Meeting Notes
```
Record notes from today's client meeting:
- Discussed homepage design revisions
- Client approved the new color scheme
- Need to add testimonials section
- Deadline moved to March 15
- Next meeting scheduled for Feb 20
```

### Extract Action Items
```
Extract all action items from the January 15 client meeting and assign them to team members with due dates.
```

### Send Meeting Summary
```
Generate a meeting summary email for today's status update meeting. Include key discussions, decisions made, and action items.
```

## Meeting Note Template

```
MEETING NOTES

Date: [Date]
Time: [Start] - [End]
Type: [Client Meeting / Status Update / Planning / Review]
Project: [Project Name]
Client: [Client Name]

ATTENDEES
- [Name] - [Role]
- [Name] - [Role]

AGENDA
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]

DISCUSSION
[Topic 1]
- Key points discussed
- Questions raised
- Concerns mentioned

[Topic 2]
- Details and context
- Options considered
- Recommendations made

DECISIONS
✓ [Decision 1] - Reason and context
✓ [Decision 2] - Who made it and why
✓ [Decision 3] - Impact and next steps

ACTION ITEMS
□ [Task] - Owner: [Name] - Due: [Date]
□ [Task] - Owner: [Name] - Due: [Date]
□ [Task] - Owner: [Name] - Due: [Date]

NEXT STEPS
- [Next step 1]
- [Next step 2]

NEXT MEETING
Date: [Date]
Time: [Time]
Agenda: [Topics]

NOTES & FOLLOW-UP
- [Additional notes]
- [Things to remember]
```

## Meeting Types

### Client Kickoff Meeting
**Purpose**: Start new project relationship
**Agenda**:
- Introductions and roles
- Project overview and goals
- Timeline and milestones
- Communication plan
- Questions and concerns

### Status Update Meeting
**Purpose**: Regular project progress review
**Agenda**:
- Review completed work
- Current status
- Upcoming tasks
- Blockers and risks
- Questions

### Planning Meeting
**Purpose**: Plan upcoming work
**Agenda**:
- Review goals
- Break down tasks
- Estimate effort
- Assign responsibilities
- Set deadlines

### Retrospective Meeting
**Purpose**: Review and improve
**Agenda**:
- What went well
- What could improve
- Action items for improvement
- Celebrate wins

### Discovery/Requirements Meeting
**Purpose**: Understand client needs
**Agenda**:
- Client goals and objectives
- Current situation and pain points
- Requirements and specifications
- Constraints and considerations
- Success criteria

## Action Item Tracking

### Action Item Format
```
□ [TASK DESCRIPTION]
  Owner: [Name]
  Due: [Date]
  Priority: [High/Medium/Low]
  Status: [Not Started/In Progress/Completed/Blocked]
  Notes: [Additional context]
```

### Action Item Types
- **Decision**: Needs approval or choice
- **Task**: Specific work to complete
- **Follow-up**: Need more information
- **Documentation**: Create or update docs
- **Communication**: Send email or message

### Status Updates
- ⏳ **Not Started**: Acknowledged but not begun
- 🔄 **In Progress**: Currently working on it
- ✅ **Completed**: Finished and verified
- 🚫 **Blocked**: Waiting on dependency
- 📅 **Deferred**: Postponed to later date

## Meeting Summary Email Template

```
Subject: Meeting Summary - [Meeting Topic] - [Date]

Hi [Attendees],

Thank you for joining today's [meeting type] for [project name].

KEY DECISIONS:
• [Decision 1]
• [Decision 2]

ACTION ITEMS:
• [Task 1] - [Owner] - [Due Date]
• [Task 2] - [Owner] - [Due Date]
• [Task 3] - [Owner] - [Due Date]

NEXT STEPS:
[Summary of what happens next]

NEXT MEETING:
[Date and time of next meeting]

Please let me know if you have any questions or if I missed anything.

[Your name]
```

## Best Practices

### Before the Meeting
- Create and share agenda 24 hours in advance
- Include meeting purpose and objectives
- List required attendees
- Estimate time for each topic
- Share relevant documents

### During the Meeting
- Start on time
- Follow the agenda
- Take notes in real-time
- Document decisions clearly
- Capture action items with owners
- Note any parking lot items
- Summarize key points

### After the Meeting
- Share notes within 24 hours
- Send meeting summary to all attendees
- Add action items to project tracker
- Schedule follow-up meetings
- File notes in project folder

## Meeting Note Organization

### File Structure
```
/Meetings
  /2024
    /Client_Name
      /Project_Name
        2024-01-15_kickoff.md
        2024-01-22_status_update.md
        2024-02-05_design_review.md
    /Internal
      2024-01-10_planning.md
      2024-01-31_retrospective.md
```

### Metadata Tags
- #client-meeting
- #status-update
- #planning
- #design-review
- #retrospective
- #discovery

## Meeting Metrics

### Track These
- Meeting frequency per client
- Average meeting duration
- Action item completion rate
- Time from meeting to summary sent
- Attendance rate

### Optimize For
- Fewer, more focused meetings
- Clear outcomes and decisions
- High action item completion
- Quick follow-up
- Engaged participants

## Common Meeting Challenges

### Problem: Meetings run over time
**Solution**: Set strict time limits, use a timer, defer non-urgent topics

### Problem: No clear decisions
**Solution**: Explicitly call out decisions, get confirmation, document immediately

### Problem: Action items not completed
**Solution**: Assign clear owners, set specific deadlines, follow up proactively

### Problem: Poor attendance
**Solution**: Send reminders, respect people's time, make meetings valuable

### Problem: No follow-through
**Solution**: Send summaries promptly, track action items, hold people accountable

## Integration
Integrates with Client MCP Server to link meetings to clients, Work MCP Server to connect with projects, and Onboarding Server for kickoff meetings.

## Quick Meeting Templates

### 15-Minute Check-in
- Quick status update
- Any blockers?
- Next steps

### 30-Minute Status Update
- What's completed
- What's in progress
- What's next
- Questions/concerns

### 60-Minute Planning Session
- Goals review
- Task breakdown
- Estimation
- Assignment
- Timeline creation

### 90-Minute Workshop
- Introduction (10 min)
- Main activity (60 min)
- Discussion (15 min)
- Action items (5 min)
