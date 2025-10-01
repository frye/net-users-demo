# Tips, Resources, and Reference

[⬅️ Back to Index](README.md) | [← Previous: Capstone Projects](capstone-projects.md)

---

## Tips for Success

### Using GitHub Copilot Effectively

1. **Be Specific**: Provide detailed context in your prompts
2. **Iterate**: Start with basic implementation, then enhance
3. **Review**: Always review generated code for quality and security
4. **Test**: Use Copilot to generate tests alongside implementation
5. **Learn**: Understand the code generated, don't just copy-paste

### Working Through Exercises

1. **Plan First**: Understand requirements before coding
2. **Test-Driven**: Write tests before or alongside implementation
3. **Small Steps**: Break large exercises into smaller tasks
4. **Commit Often**: Make small, focused commits
5. **Document**: Add comments and documentation as you go

### Getting Unstuck

1. **Ask Copilot for Help**: "Explain how to...", "What's wrong with..."
2. **Review Examples**: Look at existing code in the project
3. **Check Documentation**: Refer to .NET and library docs
4. **Simplify**: Break the problem into smaller pieces
5. **Experiment**: Try different approaches

### Best Practices

- ✅ Follow the project's coding conventions
- ✅ Write tests for all new functionality
- ✅ Add XML documentation comments
- ✅ Use proper error handling
- ✅ Log important operations
- ✅ Update README with new features
- ✅ Create ADRs for architectural decisions

---

## Additional Resources

### .NET Documentation
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [xUnit Testing](https://xunit.net/)

### GitHub Copilot Resources
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Copilot Chat Guide](https://docs.github.com/en/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide)

### GitHub Spec-Kit Resources
- [GitHub Spec-Kit Repository](https://github.com/github/spec-kit)
- [Spec-Driven Development Guide](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [Quick Start Guide](https://github.com/github/spec-kit/blob/main/docs/quickstart.md)
- [Video Overview](https://www.youtube.com/watch?v=a9eR1xsfvHg)
- [Spec-Kit Issues & Support](https://github.com/github/spec-kit/issues)

### BMAD Method Resources
- **[BMAD Method Setup Guide](bmad-method-setup-guide.md)** - Lab-style guide to setting up and using BMAD Method
- [BMAD-METHOD GitHub Repository](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD Method Tutorial Video](https://www.youtube.com/watch?v=LorEJPrALcg)
- [Context Engineering Article](https://python.plainenglish.io/from-specifications-to-context-engineering-exploring-the-bmad-method-for-systematic-ai-development-4346d4da2b18)
- [BMAD Method Forum Discussion](https://forum.cursor.com/t/bmad-method-v2-in-an-evolution-imo-the-power-of-custom-agents-smaller-docs-and-checklists/87218)

### Architecture & Patterns
- [Microsoft Architecture Guides](https://learn.microsoft.com/en-us/azure/architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)

---

## Quick Reference: Spec-Kit Commands

Once Spec-Kit is initialized in your repository, you have access to these powerful slash commands:

| Command | Purpose | Example |
|---------|---------|---------|
| `/constitution` | Create project principles and development guidelines | `/constitution Create principles for API design and testing` |
| `/specify` | Define WHAT to build (feature specification) | `/specify Add user authentication with JWT tokens` |
| `/plan` | Define HOW to build (tech stack & architecture) | `/plan Use ASP.NET Identity with EF Core and PostgreSQL` |
| `/tasks` | Generate actionable, ordered task list | `/tasks` |
| `/implement` | Execute the task plan systematically | `/implement` |

**Typical Workflow**:
1. Start with `/constitution` (once per project)
2. For each feature: `/specify` → `/plan` → `/tasks` → `/implement`
3. Iterate on specs/plans as needed before implementation

**Installation Reminder**:
```bash
# In your project root
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai copilot --force
```

---

## Appendix: Spec-Kit Without uvx

If you cannot install uvx or prefer not to use it, here are alternative methods to use Spec-Kit:

### Option 1: Install uv Tool Globally

Install Spec-Kit as a persistent global tool using uv:

```bash
# Install the specify CLI tool globally
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Now you can use it directly (no uvx needed)
specify init --here --ai copilot --force

# Later, to update
uv tool upgrade specify-cli

# To uninstall
uv tool uninstall specify-cli
```

### Option 2: Clone and Run Locally

Clone the Spec-Kit repository and run it directly with Python:

```bash
# Clone the repository
git clone https://github.com/github/spec-kit.git
cd spec-kit

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .

# Navigate to your project
cd /path/to/net-users-demo

# Run from the cloned repo
python /path/to/spec-kit/src/specify_cli/__init__.py init --here --ai copilot --force
```

### Option 3: Manual Template Setup

Download and set up templates manually without any tool:

```bash
# In your project root
cd /path/to/net-users-demo

# Download the latest release
curl -L https://github.com/github/spec-kit/archive/refs/heads/main.zip -o spec-kit.zip

# Extract templates (adjust paths as needed)
unzip spec-kit.zip
cp -r spec-kit-main/templates .specify/
cp -r spec-kit-main/scripts .specify/scripts/

# Make scripts executable (Unix-like systems)
chmod +x .specify/scripts/bash/*.sh

# Clean up
rm -rf spec-kit-main spec-kit.zip
```

Then manually configure your AI agent's custom commands by copying the command templates from `.specify/templates/commands/` to your agent's configuration directory (e.g., `.github/copilot/` for GitHub Copilot).

### Option 4: Use Docker (Advanced)

If you have Docker installed:

```bash
# Create a Dockerfile in your project
cat > Dockerfile.specify <<EOF
FROM python:3.11-slim
RUN pip install uv
RUN uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
WORKDIR /workspace
ENTRYPOINT ["specify"]
EOF

# Build the image
docker build -f Dockerfile.specify -t spec-kit .

# Run Spec-Kit commands
docker run --rm -v $(pwd):/workspace spec-kit init --here --ai copilot --force
```

### Troubleshooting

**Issue**: Python not found
- **Solution**: Install Python 3.11+ from [python.org](https://www.python.org/downloads/)

**Issue**: Git not found
- **Solution**: Install Git from [git-scm.com](https://git-scm.com/downloads)

**Issue**: Permission denied on scripts
- **Solution** (Unix-like): Run `chmod +x .specify/scripts/bash/*.sh`
- **Solution** (Windows): Use PowerShell scripts (`.ps1`) or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

**Issue**: SSL certificate errors on corporate networks
- **Solution**: Try adding `--skip-tls` flag (not recommended for production)

For more help, see the [Spec-Kit Installation Guide](https://github.com/github/spec-kit/blob/main/docs/installation.md) or [open an issue](https://github.com/github/spec-kit/issues/new).

---

## Feedback and Contributions

Found an issue or have suggestions for additional exercises? Please open an issue or submit a pull request!

Happy coding with GitHub Copilot! 🚀

---

[⬅️ Back to Index](README.md) | [🏠 Start from Module 1](module-01-crud-enhancements.md)
