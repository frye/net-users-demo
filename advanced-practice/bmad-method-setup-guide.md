# BMAD Method Setup Guide

## Lab Overview

**Duration:** 45-60 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** 
- Existing Git repository
- Node.js and npm installed
- GitHub Copilot or similar AI coding assistant
- Basic understanding of software development lifecycle

## What is the BMAD Method?

The **BMAD Method** (Breakthrough Method for Agile AI-Driven Development) is a systematic approach to integrating AI into your software development workflow. It provides a structured process that takes you from initial concept through planning, architecture, development, and quality assurance using specialized AI agents.

### Key Benefits
- **Structured Planning**: Ensures thorough planning before coding begins
- **Market Validation**: Built-in research and validation phases
- **AI-Augmented Workflow**: Leverages specialized AI agents for different roles (PM, Architect, Developer, QA)
- **Context Engineering**: Maintains clear documentation and context throughout the project lifecycle
- **Change Recovery**: Features to help projects stay on track when requirements change

## Lab Objectives

By the end of this lab, you will:
1. ✅ Install and configure BMAD Method in your repository
2. ✅ Understand the folder structure and documentation approach
3. ✅ Learn how to use different AI agent personas
4. ✅ Complete a sample workflow from concept to PRD
5. ✅ Integrate BMAD with your existing development tools

---

## Part 1: Installation and Setup (10 minutes)

### Step 1.1: Install BMAD Method

Open your terminal in your repository root and run:

```bash
npx bmad-method install
```

This command creates the following structure:

```
your-repository/
├── .bmad-core/              # Core agents and utilities for IDE usage
│   ├── agents/
│   └── utilities/
├── bmad/
│   └── web-bundles/         # Self-contained agents for web chat platforms
│       ├── analyst-agent.md
│       ├── pm-agent.md
│       ├── sm-agent.md
│       ├── dev-agent.md
│       └── qa-agent.md
└── docs/                     # Project documentation
    ├── prd.md               # Product Requirements Document
    ├── architecture.md      # Technical architecture
    └── stories/             # User stories directory
```

### Step 1.2: Verify Installation

Check that the folders were created:

```bash
ls -la .bmad-core/
ls -la bmad/web-bundles/
ls -la docs/
```

**Expected Output:** You should see the directories listed above with their respective files.

### Step 1.3: Add to .gitignore (Optional)

If you want to keep BMAD files local, add to `.gitignore`:

```gitignore
# BMAD Method - Optional: Remove if you want to commit these
.bmad-core/
bmad/web-bundles/
```

**💡 Recommendation:** Commit the `docs/` folder as it contains important project documentation, but consider whether the `.bmad-core/` and `bmad/web-bundles/` should be committed based on your team's needs.

---

## Part 2: Understanding BMAD Agents (10 minutes)

BMAD Method uses specialized AI agent personas for different phases:

### 🔍 Business Analyst (analyst)
- **Purpose:** Brainstorming, market research, concept validation
- **When to Use:** Early ideation phase, validating new features
- **Output:** Concept briefs, competitive analysis, market insights

### 📋 Product Manager (pm)
- **Purpose:** Requirements gathering, PRD creation, stakeholder management
- **When to Use:** Defining features, creating specifications
- **Output:** Product Requirements Documents (PRDs), feature specifications

### 🏗️ Solution Manager/Architect (sm)
- **Purpose:** Technical architecture, system design, technology selection
- **When to Use:** Designing system architecture, planning technical approach
- **Output:** Architecture documents, technical specifications, design diagrams

### 💻 Developer (dev)
- **Purpose:** Implementation, coding, technical problem-solving
- **When to Use:** Active development, code reviews, refactoring
- **Output:** Code implementations, technical documentation

### ✅ QA Engineer (qa)
- **Purpose:** Testing strategy, quality assurance, bug identification
- **When to Use:** Test planning, creating test cases, quality reviews
- **Output:** Test plans, test cases, quality reports

### Step 2.1: Review Agent Files

Open and review the agent files to understand their capabilities:

```bash
cat bmad/web-bundles/pm-agent.md
```

**Task:** Read through 2-3 agent files to understand their personas and capabilities.

---

## Part 3: BMAD Workflow Phases (15 minutes)

### Phase 1: Brainstorming 🔍

**Goal:** Develop and validate your concept

1. **Start with the Business Analyst agent**
   - Use prompts like: "I want to build a feature that..."
   - Ask for competitive analysis
   - Request market validation

2. **Example Prompt:**
   ```
   Acting as the BMAD Business Analyst, help me brainstorm a new 
   feature for user profile management. Research similar features 
   in competitor applications and identify unique selling points.
   ```

3. **Expected Output:** 
   - Market research summary
   - Competitive analysis
   - Unique value propositions
   - Initial concept brief

### Phase 2: PRD Creation 📋

**Goal:** Create comprehensive Product Requirements Document

1. **Switch to Product Manager agent**
   - Reference your concept from Phase 1
   - Define user stories and requirements
   - Create PRD in `docs/prd.md`

2. **Example Prompt:**
   ```
   Acting as the BMAD Product Manager, create a PRD for [feature name].
   Include user stories, acceptance criteria, technical requirements,
   and success metrics. Save this to docs/prd.md
   ```

3. **PRD Template Structure:**
   ```markdown
   # Product Requirements Document: [Feature Name]
   
   ## Overview
   - Problem Statement
   - Solution Overview
   - Success Metrics
   
   ## User Stories
   - As a [role], I want [feature] so that [benefit]
   
   ## Functional Requirements
   - Requirement 1
   - Requirement 2
   
   ## Technical Requirements
   - Technology stack
   - Dependencies
   - Constraints
   
   ## Acceptance Criteria
   - Criteria 1
   - Criteria 2
   ```

### Phase 3: Architecture Design 🏗️

**Goal:** Define technical architecture and approach

1. **Engage the Solution Manager/Architect agent**
   - Reference your PRD
   - Design system architecture
   - Document in `docs/architecture.md`

2. **Example Prompt:**
   ```
   Acting as the BMAD Solution Manager, design the technical 
   architecture for the requirements in docs/prd.md. Consider
   our existing .NET 9 stack and create an architecture document.
   ```

3. **Architecture Document Structure:**
   ```markdown
   # Architecture: [Feature Name]
   
   ## System Overview
   - High-level architecture
   - Component diagram
   
   ## Technology Stack
   - Framework decisions
   - Libraries and dependencies
   
   ## Data Models
   - Entity definitions
   - Relationships
   
   ## API Design
   - Endpoints
   - Request/Response formats
   
   ## Security Considerations
   - Authentication
   - Authorization
   - Data protection
   ```

### Phase 4: Development 💻

**Goal:** Implement the feature following architecture

1. **Work with Developer agent**
   - Reference PRD and architecture docs
   - Implement features incrementally
   - Follow TDD practices

2. **Example Prompt:**
   ```
   Acting as the BMAD Developer, implement the first user story 
   from docs/prd.md following the architecture in 
   docs/architecture.md. Use TDD approach.
   ```

### Phase 5: Quality Assurance ✅

**Goal:** Ensure quality and test coverage

1. **Collaborate with QA agent**
   - Create test plans
   - Write test cases
   - Review quality standards

2. **Example Prompt:**
   ```
   Acting as the BMAD QA Engineer, create a comprehensive test 
   plan for the feature defined in docs/prd.md. Include unit 
   tests, integration tests, and acceptance test scenarios.
   ```

---

## Part 4: Practical Exercise (15 minutes)

Let's apply BMAD Method to add a new feature to the net-users-demo project.

### Exercise: Add User Avatar Management

**Scenario:** We want to expand beyond emoji representation to allow users to upload and manage avatar images.

#### Step 4.1: Brainstorming (5 minutes)

Use the Business Analyst persona:

```
Acting as the BMAD Business Analyst, help me brainstorm adding 
avatar image support to our user profile system. Currently we 
only use emojis. Research best practices for avatar management 
in web applications and identify key features we should include.
```

**Deliverable:** Create `docs/avatar-feature-concept.md` with findings.

#### Step 4.2: Create PRD (5 minutes)

Switch to Product Manager persona:

```
Acting as the BMAD Product Manager, create a PRD for the avatar 
management feature. Include user stories for:
- Uploading avatar images
- Displaying avatars
- Managing avatar settings
- Falling back to emoji if no avatar is set

Save to docs/prd-avatar-management.md
```

**Deliverable:** Complete PRD document.

#### Step 4.3: Architecture Planning (5 minutes)

Engage the Solution Manager:

```
Acting as the BMAD Solution Manager, design the architecture 
for avatar management considering:
- File upload handling
- Image storage strategy
- API endpoint design
- Model changes needed
- Security considerations

Save to docs/architecture-avatar-management.md
```

**Deliverable:** Architecture document with technical decisions.

---

## Part 5: Integration with Existing Tools (10 minutes)

### Using BMAD with GitHub Copilot

BMAD Method works alongside GitHub Copilot and other AI tools:

1. **Use BMAD agents for planning and specification**
   - Keep documentation in `docs/` folder
   - Reference docs in your prompts

2. **Use Copilot for implementation**
   - Open your PRD and architecture docs
   - Reference them with `#file:docs/prd.md` in Copilot Chat
   - Copilot will use this context for better code generation

3. **Example Workflow:**
   ```
   # In Copilot Chat
   @workspace Using the requirements in #file:docs/prd.md and 
   architecture in #file:docs/architecture.md, implement the 
   first user story for avatar management.
   ```

### Using BMAD with IDE Slash Commands

If you're using Claude Code or similar IDE plugins:

- `/pm` - Activate Product Manager agent
- `/sm` - Activate Solution Manager agent
- `/dev` - Activate Developer agent
- `/qa` - Activate QA agent

### Web Chat Integration

For web-based AI chats (ChatGPT, Claude, etc.):

1. Copy the content from `bmad/web-bundles/[agent-name].md`
2. Paste into your chat session
3. This loads the agent persona into the chat context

---

## Part 6: Best Practices (5 minutes)

### ✅ DO:
- **Start with planning** - Use analyst and PM agents before coding
- **Document decisions** - Keep PRDs and architecture docs updated
- **Reference context** - Point agents to existing docs for continuity
- **Iterate incrementally** - Work through phases systematically
- **Version control docs** - Commit docs/ folder to track evolution

### ❌ DON'T:
- Skip brainstorming phase - leads to unclear requirements
- Jump straight to coding - results in architectural debt
- Ignore agent recommendations - they're based on best practices
- Mix agent personas - use the right agent for each phase
- Forget to update docs - stale documentation defeats the purpose

### 💡 Tips for Success:

1. **Be Specific in Prompts**
   - Include context about your project
   - Reference existing documentation
   - Specify desired output format

2. **Use Iterative Refinement**
   - First pass: Get the outline
   - Second pass: Fill in details
   - Third pass: Refine and validate

3. **Maintain Context Chain**
   - Reference previous phase outputs
   - Link related documents
   - Keep conversation history relevant

4. **Adapt to Your Workflow**
   - Not every project needs all phases
   - Scale BMAD usage to project complexity
   - Combine with existing methodologies

---

## Part 7: Verification and Next Steps

### Verify Your Setup

Run this checklist:

- [ ] `.bmad-core/` folder exists with agent files
- [ ] `bmad/web-bundles/` contains agent markdown files
- [ ] `docs/` folder is created and structured
- [ ] You understand the five agent personas
- [ ] You've completed the practical exercise
- [ ] PRD and architecture docs are created

### Next Steps

1. **Practice with Real Features**
   - Apply BMAD to your next feature development
   - Start with smaller features to build familiarity

2. **Customize Agent Personas**
   - Modify agent files to match your team's needs
   - Add company-specific context and guidelines

3. **Integrate with CI/CD**
   - Use docs/ folder in code reviews
   - Reference PRDs in pull requests
   - Link architecture docs in technical discussions

4. **Explore Advanced Features**
   - Change recovery strategies
   - Reflective elicitation techniques
   - Multi-agent collaboration patterns

---

## Troubleshooting

### Installation Issues

**Problem:** `npx bmad-method install` command not found  
**Solution:** Ensure Node.js and npm are installed. Check with `node --version` and `npm --version`

**Problem:** Permission errors during installation  
**Solution:** Run with appropriate permissions or use `sudo` (on macOS/Linux)

### Agent Usage Issues

**Problem:** AI doesn't follow agent persona  
**Solution:** Include explicit instructions like "Acting as the BMAD [Agent Name]..." in your prompts

**Problem:** Responses lack context from previous phases  
**Solution:** Explicitly reference previous documents (e.g., "Based on the PRD in docs/prd.md...")

---

## Additional Resources

### Official Resources
- [BMAD-METHOD GitHub Repository](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD Method Tutorial Video](https://www.youtube.com/watch?v=LorEJPrALcg)
- [Setup Guide for Claude Code](https://zichen.dev/bmad-claude-code-setup-guide-ide-web-chat/)

### Community & Learning
- [Context Engineering Article](https://python.plainenglish.io/from-specifications-to-context-engineering-exploring-the-bmad-method-for-systematic-ai-development-4346d4da2b18)
- [BMAD Method Forum Discussion](https://forum.cursor.com/t/bmad-method-v2-in-an-evolution-imo-the-power-of-custom-agents-smaller-docs-and-checklists/87218)

### Supported Platforms
- **Gemini Gems** - Long context windows ideal for BMAD
- **ChatGPT** - Web chat integration with agent bundles
- **Claude Code** - IDE integration with slash commands
- **GitHub Copilot** - Context-aware code generation

---

## Summary

The BMAD Method provides a structured approach to AI-augmented development that emphasizes:
- 📋 **Planning before coding** - Reduces rework and technical debt
- 🤖 **Specialized AI agents** - Right expertise at each phase
- 📚 **Documentation-first** - Maintains context throughout project
- 🔄 **Iterative refinement** - Continuous improvement of requirements and design

By integrating BMAD Method into your workflow, you create a systematic approach to AI-assisted development that results in better planning, clearer requirements, and more maintainable code.

---

**Lab Complete!** 🎉

You now have BMAD Method set up and understand how to use it for structured AI-assisted development. Try applying it to your next feature or project!
