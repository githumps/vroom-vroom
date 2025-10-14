# VROOM VROOM Documentation

**Welcome to the VROOM VROOM documentation!**

This directory contains organized technical documentation, system references, and integration guides for the VROOM VROOM game.

---

## 📖 Documentation Structure

### Start Here
**New to the project?** Read these in order:
1. `../README.md` - Project overview and quickstart
2. `../SYSTEMS.md` - **MASTER REFERENCE** - Complete overview of all game systems
3. `../CHANGELOG.md` - Version history and what's been added
4. `../claude.md` - Technical reference for Claude development

### System References (`systems/`)
**Detailed technical documentation for each game system.**

When you need to understand HOW a system works internally, look here.

| File | System | Purpose |
|------|--------|---------|
| `SAVE_CODE_SYSTEM.md` | Save Codes | Base64 encoding, export/import mechanics |
| `TATTOO_PLACEMENT.md` | Tattoo Placement | 9 body locations, workflow, data structure |
| `CAR_MODELS_REFERENCE.md` | Car Selection | 4 car models, 10 colors, geometry specs |
| `TIME_SYSTEM_README.md` | Prison Clock | Real-time progression, 1 year = 7 days |
| `API_VERIFICATION_REPORT.md` | Gemini API | API usage audit, security assessment |
| `DEBUG_REFERENCE.md` | Dev Mode | Log levels, overlay controls, debugging |
| `LOGGING_EXAMPLES.md` | Logging | Code examples for all systems |
| `DEV_MODE_SUMMARY.md` | Dev Mode | Overview of debugging tools |
| `DEV_MODE_QUICK_REFERENCE.md` | Dev Mode | One-page command reference |
| `PRISON_SYSTEM.md` | Prison | Comprehensive prison system review |
| `PRISON_REVIEW_EXECUTIVE_SUMMARY.md` | Prison | Executive summary of review |
| `CAR_SELECTION_SUMMARY.md` | Car Selection | Executive summary |
| `GUARD_MANICURE_SYSTEM_SUMMARY.md` | Guard Manicures | System overview |

### Integration Guides (`integration/`)
**Step-by-step instructions for adding or modifying systems.**

When you need to IMPLEMENT a feature, look here.

| File | System | Purpose |
|------|--------|---------|
| `TATTOO_SYSTEM_INTEGRATION.md` | Tattoo System | How to integrate tattoo drawing |
| `GANG_SYSTEM_INTEGRATION_GUIDE.md` | Gang System | How to integrate gangs |
| `ESCAPE_SYSTEM_INTEGRATION.md` | Escape Planning | How to integrate escapes |
| `CAR_SELECTION_INTEGRATION.md` | Car Selection | How to integrate car preview |
| `DEV_MODE_INTEGRATION.md` | Dev Mode | How to integrate debugging tools |
| `GUARD_MANICURE_IMPLEMENTATION.md` | Guard Manicures | How to integrate manicure system |
| `PRISON_ENHANCEMENTS_IMPLEMENTATION.md` | Prison Events | How to add random events |
| `CAR_SELECTION_CODE_SNIPPETS.md` | Car Selection | Quick code references |
| `INTEGRATION_STEPS.md` | General | General integration workflow |

---

## 🎯 How to Use This Documentation

### Scenario 1: Understanding a System
**"How does the save code system work?"**
1. Read `systems/SAVE_CODE_SYSTEM.md` for complete technical details
2. Check `../SYSTEMS.md` for a high-level overview
3. Look at code in `../game/game.js` for implementation

### Scenario 2: Adding a New Feature
**"I want to integrate the clinic system"**
1. Check if agent deliverables exist (see `../claude.md`)
2. Read relevant integration guide (e.g., agent report)
3. Follow step-by-step instructions
4. Test using dev mode (type DEBUG on menu)
5. Update `../SYSTEMS.md` and `../CHANGELOG.md`

### Scenario 3: Debugging an Issue
**"The API isn't working"**
1. Read `systems/API_VERIFICATION_REPORT.md` for API details
2. Read `systems/DEBUG_REFERENCE.md` for debugging tools
3. Enable dev mode (type DEBUG on menu)
4. Check API monitor for call statistics
5. Review logs in dev overlay

### Scenario 4: Starting Development
**"I'm new and want to contribute"**
1. Read `../README.md` for project overview
2. Read `../SYSTEMS.md` for complete system map
3. Read `../claude.md` for development workflow
4. Follow mandatory 6-step workflow for all changes
5. Test using testing menu (type TEST on menu)

---

## 📂 File Organization Rules

### When Adding New Documentation

**System Reference Docs (`systems/`)**
- Create when: Building a new game system
- Naming: `SYSTEM_NAME.md` or `SYSTEM_NAME_REFERENCE.md`
- Content: Technical specs, data structures, algorithms
- Audience: Developers who need to understand internals

**Integration Guides (`integration/`)**
- Create when: System needs step-by-step integration
- Naming: `SYSTEM_NAME_INTEGRATION.md`
- Content: Copy-paste code, line numbers, testing steps
- Audience: Developers implementing the system

**Always Update:**
1. `../SYSTEMS.md` - Add system overview with links
2. `../CHANGELOG.md` - Add user-facing changes
3. `../claude.md` - Add technical details

---

## 🔄 Development Workflow

**From `../claude.md` - MANDATORY for all changes:**

### Step 1: Pre-Task Check ✅
- Check TODO list for current tasks
- Review `../SYSTEMS.md` for system overview
- Check relevant docs in `systems/` and `integration/`
- Verify no conflicting changes in git status
- Read relevant code sections before modifying

### Step 2: Execute Task 🔨
- Implement changes with comprehensive logging
- Add error handling for all user-facing features
- Test manually during development
- Use dev mode for real-time debugging
- Follow existing code patterns

### Step 3: Update Documentation 📝
- Update `../SYSTEMS.md` if new system or major changes
- Update/create docs in `systems/` for reference
- Update/create docs in `integration/` for guides
- Update `../CHANGELOG.md` with user-facing changes
- Update `../claude.md` with technical details

### Step 4: Testing 🧪
- Test in browser (desktop)
- Test in browser (mobile if applicable)
- Use testing menu (type TEST)
- Test save/load compatibility
- Verify no console errors

### Step 5: Code Quality 🎯
- Run syntax check: `node -c game.js`
- Review for console.log()
- Check error handling
- Verify function purposes
- Remove TODOs

### Step 6: Git Commit 📦
- Stage files: `git add .`
- Write semantic commit message
- Include detailed description
- Reference issue numbers

---

## 📊 Documentation Stats

### Current State (v1.3.0)
- **Master References:** 4 files (SYSTEMS.md, CHANGELOG.md, claude.md, README.md)
- **System References:** 13 files in `systems/`
- **Integration Guides:** 9 files in `integration/`
- **Total Documentation:** ~15,000 lines
- **Organization Status:** ✅ COMPLETE

### Coverage
- ✅ All core systems documented
- ✅ All implemented features have references
- ✅ All integration paths have guides
- ✅ Dev workflow documented
- ✅ API usage documented
- ✅ Testing procedures documented

---

## 🎮 Quick Reference

### Game Systems (v1.3.0)
**Implemented:**
- Character Creation (car selection, voice preview)
- Driving & World (desktop + mobile)
- Police & Arrest
- Court System (Judge Hardcastle, AI charges)
- Prison System (12+ activities)
- Tattoo System (drawing, placement, infection)
- Gang System (3 gangs, reputation)
- Escape Planning (4 routes)
- Save System (localStorage + save codes)
- Sound System (Web Audio API)
- Testing Menu (TEST cheat code)

**Designed (Pending Integration):**
- Hospital/Clinic System
- Conjugal Visit System
- Guard Manicure System
- Dev Mode & Debugging
- 20 Random Prison Events
- Reputation System

### Documentation Priorities
1. **High Priority:** Dev mode integration guide (enables better debugging)
2. **Medium Priority:** Clinic/conjugal/manicure integration
3. **Low Priority:** Enhance existing system docs

---

## 🤝 Contributing to Documentation

### When to Update Docs
- ✅ After implementing any new system
- ✅ After modifying existing system significantly
- ✅ When fixing bugs that affect user experience
- ✅ When adding new development tools
- ✅ When reorganizing code structure

### How to Write Good Docs
1. **Be concise** - No unnecessary words
2. **Be specific** - Include line numbers, exact code
3. **Be helpful** - Think about what reader needs
4. **Be organized** - Use clear sections and headers
5. **Be current** - Update when code changes

### Documentation Style
- **Code blocks:** Use ```javascript or ```bash
- **Commands:** Use `inline code`
- **File paths:** Use `path/to/file.md`
- **Sections:** Use ## for major, ### for minor
- **Lists:** Use - for bullets, 1. for numbered
- **Emphasis:** Use **bold** for important, *italic* for notes

---

## 📞 Contact & Support

**Need help with documentation?**
- Check `../SYSTEMS.md` first
- Look in relevant `systems/` or `integration/` file
- Review `../claude.md` for technical details
- Check `../CHANGELOG.md` for version history

**Found an error in docs?**
- Create issue on GitHub
- Tag with "documentation" label
- Include file name and line number
- Suggest correction if possible

---

## 📝 Change Log (Documentation)

### v1.3.0 (2025-10-14)
- ✅ Created organized documentation structure
- ✅ Created `SYSTEMS.md` master reference
- ✅ Created `systems/` directory (13 files)
- ✅ Created `integration/` directory (9 files)
- ✅ Updated `claude.md` with mandatory workflow
- ✅ Cleaned up 15+ obsolete .md files
- ✅ Created this README.md

### v1.2.0 (2025-10-13)
- ✅ Added car selection documentation
- ✅ Added voice preview documentation
- ✅ Updated CHANGELOG with new features

### v1.0.0 (2025-10-13)
- ✅ Created comprehensive CHANGELOG
- ✅ Documented tattoo/gang/escape systems

---

**Last Updated:** 2025-10-14
**Documentation Version:** 1.3.0
**Status:** ✅ ORGANIZED AND CURRENT
