# Product Requirements Document (PRD)
## Lancelot Development Manager (LDM) - VS Code Extension

**Document Version:** 1.0  
**Date:** January 23, 2026  
**Product Version:** 0.6.10 (Beta)  
**Project Repository:** andreas-prouza/ldm-extension  
**Status:** Beta Release - Production Release Planned

---

## Executive Summary

The Lancelot Development Manager (LDM) is a comprehensive VS Code extension that automates the build process for IBM i applications. The extension provides a modern, local-first development experience for IBM i developers, allowing them to work with source code locally while maintaining integration with IBM i systems through automated build processes. Currently in Beta (v0.6.10), the product is approaching production readiness with significant functionality already implemented.

### Business Value Proposition

- **Modernized Development Workflow**: Enables developers to use modern development tools (VS Code, Git) for IBM i development
- **Increased Developer Productivity**: Automated dependency management and intelligent build ordering reduce manual compilation effort
- **Team Collaboration**: Git-based workflow supports distributed teams and modern DevOps practices
- **Quality Assurance**: Change detection and dependency tracking ensure complete and accurate builds
- **Reduced Learning Curve**: Familiar VS Code interface for IBM i development

---

## Product Vision & Goals

### Vision Statement
To provide the most intuitive and efficient build automation tool for IBM i developers, bridging traditional IBM i development with modern DevOps practices.

### Strategic Goals
1. **Complete Beta Phase**: Finalize all core features and achieve production stability (Q1 2026)
2. **Market Adoption**: Achieve 1,000+ active installations within 6 months of GA release
3. **Ecosystem Integration**: Seamless integration with popular IBM i development tools
4. **Community Growth**: Establish active user community and contribution base

---

## Current State Analysis

### What's Implemented (v0.6.10)

#### Core Build System ✅
- Automated build list generation
- Dependency tracking and resolution
- Build order optimization based on object types
- Change detection using hash-based comparison
- Individual source configuration support
- Build history tracking

#### User Interface ✅
- Activity bar integration with custom ldm view
- Controller panel for build operations
- Source filter management (tree view)
- Build history viewer
- Configuration editor with validation
- Welcome screen for project initialization
- Multi-language support (English, German)

#### Source Management ✅
- Source filter creation and management
- Individual source configuration
- Source description maintenance
- Source dependency management
- Source creation (new files/members)
- Source renaming and deletion

#### IBM i Integration ✅
- SSH-based remote execution
- Concurrent SSH operations
- File synchronization (local ↔ IFS)
- Remote compiled object list management
- Build log retrieval (joblog, spool files)

#### Configuration System ✅
- Profile-based configuration management
- Project vs. user configuration separation
- Configuration validation
- Auto-reload on configuration changes
- Support for environment variables

### Known Limitations & Technical Debt

1. **File HASH Update**: Client-side hash needs to be synchronized back to server (noted in ToDo.md)
2. **Performance**: Large projects may experience slower source list refreshes
3. **Error Handling**: Some error scenarios lack user-friendly messages
4. **Testing Coverage**: Limited automated test coverage (2 test files currently)
5. **Documentation**: Some advanced features lack comprehensive documentation

---

## Feature Specifications

### 1. Build Automation Engine

**Priority:** P0 (Critical)  
**Status:** Implemented  
**Timeline:** Complete

#### Description
The core build engine that determines what needs to be compiled and in what order.

#### Features
- Hash-based change detection
- Dependency graph resolution
- Build order optimization
- Support for 15+ IBM i object types
- Parallel build support (when dependencies allow)
- Build retry mechanism

#### Technical Implementation
- Location: `src/ldm/compile_list/`
- Key modules: `createBuildList.ts`, dependency modules
- Dependencies: SSH2, node-ssh, hasha

---

### 2. Configuration Management System

**Priority:** P0 (Critical)  
**Status:** Implemented  
**Timeline:** Complete

#### Description
Comprehensive configuration system supporting multiple profiles and user/project separation.

#### Features
- Multi-profile support
- Project vs. user configuration hierarchy
- Configuration validation
- Visual configuration editor
- Import/export capabilities
- Profile copying

#### Configuration Categories
- General settings (paths, directories)
- Compile settings (LIBL, target libraries, commands)
- System settings (SSH, remote host)
- Constants and environment variables

---

### 3. Source Filter Management

**Priority:** P0 (Critical)  
**Status:** Implemented  
**Timeline:** Complete

#### Description
Flexible source organization and filtering system.

#### Features
- Regex-based pattern matching
- Multiple filter configurations
- Tree view display
- Quick access to sources
- Integration with file explorer context menu

---

### 4. Build History Tracking

**Priority:** P1 (High)  
**Status:** Implemented (v0.6.10)  
**Timeline:** Complete

#### Description
Comprehensive tracking of build operations with detailed history.

#### Features
- Chronological build history
- Build result details
- Command execution logs
- Timestamp tracking
- History cleanup options

---

### 5. Dependency Management

**Priority:** P0 (Critical)  
**Status:** Implemented  
**Timeline:** Complete

#### Description
Visual dependency management with automatic build ordering.

#### Features
- Visual dependency editor
- Automatic dependency detection (future enhancement)
- Dependency validation
- JSON-based storage
- Source-level dependency tracking

---

### 6. Individual Source Configuration

**Priority:** P1 (High)  
**Status:** Implemented (v0.4.1+)  
**Timeline:** Complete

#### Description
Override global build settings on a per-source basis.

#### Features
- Source-specific compile commands
- Custom LIBL per source
- Source type configuration
- Command ignore list

---

### 7. Internationalization (i18n)

**Priority:** P2 (Medium)  
**Status:** Implemented  
**Timeline:** Complete

#### Supported Languages
- English (en)
- German (de)

#### Scope
- All UI elements
- Command labels
- Configuration descriptions
- Error messages

---

## Planned Features & Enhancements

### Phase 1: Production Release (Q1 2026)

#### 1.1 Enhanced Error Handling
**Priority:** P0  
**Estimated Effort:** 2 weeks  
**Description:** Improve error messages and user feedback throughout the extension.

**Deliverables:**
- User-friendly error messages
- Error recovery suggestions
- Detailed error logging
- Error notification system

#### 1.2 Testing & Quality Assurance
**Priority:** P0  
**Estimated Effort:** 3 weeks  
**Description:** Comprehensive testing coverage and quality improvements.

**Deliverables:**
- Unit test coverage >70%
- Integration test suite
- End-to-end testing framework
- Automated CI/CD pipeline

#### 1.3 Documentation Completion
**Priority:** P0  
**Estimated Effort:** 2 weeks  
**Description:** Complete all user and developer documentation.

**Deliverables:**
- User guide
- Administrator guide
- API documentation
- Tutorial videos
- Migration guide

#### 1.4 Performance Optimization
**Priority:** P1  
**Estimated Effort:** 2 weeks  
**Description:** Optimize performance for large projects.

**Deliverables:**
- Source list caching
- Lazy loading for large directories
- Optimized SSH connection pooling
- Background refresh optimization

### Phase 2: Advanced Features (Q2 2026)

#### 2.1 Deployment Module
**Priority:** P1  
**Estimated Effort:** 4 weeks  
**Status:** Partially implemented (UI disabled)  
**Description:** Complete the deployment functionality for production releases.

**Deliverables:**
- Release management interface
- Multi-environment support
- Deployment history
- Rollback capability

#### 2.2 Quick Settings Panel
**Priority:** P2  
**Estimated Effort:** 2 weeks  
**Status:** Partially implemented (UI disabled)  
**Description:** Quick access panel for common settings.

**Deliverables:**
- Frequently used settings shortcuts
- Profile quick-switch
- Recent build configurations

#### 2.3 Automatic Dependency Detection
**Priority:** P1  
**Estimated Effort:** 4 weeks  
**Description:** Automatically detect dependencies by parsing source code.

**Deliverables:**
- RPGLE/SQLRPGLE parser
- CL program analyzer
- Display file dependency detection
- Automatic dependency graph generation

#### 2.4 Build Analytics
**Priority:** P2  
**Estimated Effort:** 3 weeks  
**Description:** Analytics and reporting on build performance.

**Deliverables:**
- Build time metrics
- Failure rate tracking
- Dependency complexity metrics
- Performance dashboards

### Phase 3: Ecosystem Integration (Q3 2026)

#### 3.1 IBM i Debug Integration
**Priority:** P1  
**Estimated Effort:** 3 weeks  
**Description:** Integration with VS Code debugging capabilities.

**Deliverables:**
- Debug configuration templates
- Breakpoint synchronization
- Variable inspection
- Call stack navigation

#### 3.2 Source Control Integration
**Priority:** P2  
**Estimated Effort:** 2 weeks  
**Description:** Enhanced Git integration features.

**Deliverables:**
- Pre-commit build validation
- Git hooks for ldm
- Merge conflict resolution helpers

#### 3.3 Team Collaboration Features
**Priority:** P2  
**Estimated Effort:** 3 weeks  
**Description:** Features to support team collaboration.

**Deliverables:**
- Shared build configurations
- Team build history
- Build notifications
- Code review integration

---

## Technical Architecture

### Component Overview

```
ldm-extension/
├── Extension Core (extension.ts)
│   ├── Activation & lifecycle management
│   ├── Command registration
│   └── Context management
│
├── ldm Commands Layer (src/ldm/)
│   ├── ldmCommands.ts - Command execution
│   ├── ldmStatus.ts - Status tracking
│   ├── Source.ts - Source model
│   └── compile_list/ - Build list generation
│
├── Webview Layer (src/webview/)
│   ├── controller/ - Main controller & config
│   ├── source_list/ - Source management
│   ├── show_changes/ - Build summary
│   ├── build_history/ - History tracking
│   ├── deployment/ - Deployment (future)
│   └── quick_settings/ - Quick access (future)
│
├── Utilities Layer (src/utilities/)
│   ├── SSH_Tasks.ts - SSH communication
│   ├── ldmTools.ts - Core utilities
│   ├── GitTool.ts - Git integration
│   ├── LocalSourceList.ts - Source caching
│   └── Logger.ts - Logging framework
│
└── Assets (asserts/)
    ├── templates/ - HTML templates (Nunjucks)
    ├── css/ - Stylesheets
    ├── js/ - Client-side JavaScript
    └── bootstrap/ - UI framework
```

### Technology Stack

**Backend (Extension)**
- TypeScript
- Node.js
- VS Code Extension API
- node-ssh (SSH communication)
- Nunjucks (templating)
- smol-toml (configuration parsing)
- Winston (logging)
- hasha (file hashing)

**Frontend (Webviews)**
- @vscode/webview-ui-toolkit
- Bootstrap 5
- Bootstrap Icons
- Bootstrap Table
- Choices.js / Tom Select (dropdowns)
- jQuery (legacy, should be phased out)

**Build Tools**
- esbuild (bundling)
- TypeScript compiler
- ESLint

### Key Design Patterns

1. **Command Pattern**: All ldm operations exposed as VS Code commands
2. **Observer Pattern**: Event-driven updates for UI refresh
3. **Factory Pattern**: Webview creation and management
4. **Singleton Pattern**: Configuration and logger instances
5. **Repository Pattern**: Local source list caching

### Data Flow

```
User Action (UI)
    ↓
VS Code Command
    ↓
ldmCommands (Business Logic)
    ↓
SSH_Tasks (Communication Layer)
    ↓
IBM i System (Remote Execution)
    ↓
Result Processing
    ↓
UI Update (Webview)
```

---

## User Personas

### Persona 1: Traditional IBM i Developer (Primary)
**Name:** John  
**Experience:** 15 years IBM i, minimal modern tooling  
**Goals:** Maintain existing applications, adopt modern practices gradually  
**Pain Points:** Uncomfortable with command-line, needs GUI  
**Requirements:** 
- Clear visual interface
- Step-by-step guidance
- Comprehensive error messages

### Persona 2: Modern DevOps Engineer (Secondary)
**Name:** Sarah  
**Experience:** 5 years software development, new to IBM i  
**Goals:** Apply modern DevOps to IBM i  
**Pain Points:** IBM i tooling feels outdated  
**Requirements:**
- Git integration
- CI/CD capabilities
- Automation features

### Persona 3: Team Lead (Secondary)
**Name:** Michael  
**Experience:** 20 years IBM i, managing team of 5-10  
**Goals:** Standardize development practices  
**Pain Points:** Inconsistent build processes across team  
**Requirements:**
- Centralized configuration
- Team collaboration features
- Build analytics

---

## Success Metrics

### Phase 1 (Production Release) - Q1 2026

| Metric | Target | Measurement |
|--------|--------|-------------|
| Installation Count | 500+ | VS Code Marketplace |
| User Rating | >4.0/5.0 | Marketplace reviews |
| Critical Bugs | <5 open | GitHub Issues |
| Test Coverage | >70% | Code coverage tools |
| Documentation Completeness | 100% | Internal audit |

### Phase 2 (Advanced Features) - Q2 2026

| Metric | Target | Measurement |
|--------|--------|-------------|
| Active Users (DAU) | 300+ | Telemetry (opt-in) |
| Feature Adoption | >60% for P0/P1 features | Usage analytics |
| Build Success Rate | >95% | Build history analysis |
| Average Build Time | <5 min for typical project | Performance monitoring |

### Phase 3 (Ecosystem Integration) - Q3 2026

| Metric | Target | Measurement |
|--------|--------|-------------|
| Installation Count | 1,500+ | VS Code Marketplace |
| Community Contributions | 10+ | GitHub PRs |
| Integration Usage | >40% | Feature analytics |
| Customer Satisfaction | >85% | User surveys |

---

## Timeline & Resource Planning

### Q1 2026: Production Release (12 weeks)

**Weeks 1-4: Quality & Stability**
- Complete comprehensive testing suite (2 developers, 2 weeks)
- Fix critical and high-priority bugs (2 developers, 2 weeks)
- Performance optimization (1 developer, 2 weeks)
- **Milestone:** Beta 2 Release

**Weeks 5-8: Documentation & User Experience**
- Complete user documentation (1 technical writer, 3 weeks)
- Create video tutorials (1 developer + 1 writer, 2 weeks)
- UI/UX improvements based on beta feedback (1 developer, 2 weeks)
- **Milestone:** Release Candidate 1

**Weeks 9-12: Final Validation & Launch**
- External beta testing (community, 2 weeks)
- Final bug fixes (2 developers, 2 weeks)
- Marketing materials preparation (1 week)
- Launch preparation (1 week)
- **Milestone:** GA Release 1.0

### Q2 2026: Advanced Features (12 weeks)

**Weeks 13-18: Deployment Module**
- Deployment UI implementation (1 developer, 3 weeks)
- Backend deployment logic (2 developers, 3 weeks)
- Testing and validation (1 developer, 2 weeks)
- **Milestone:** Feature Release 1.1

**Weeks 19-24: Automation & Intelligence**
- Automatic dependency detection (2 developers, 4 weeks)
- Build analytics framework (1 developer, 2 weeks)
- **Milestone:** Feature Release 1.2

### Q3 2026: Ecosystem Integration (12 weeks)

**Weeks 25-30: Integration Development**
- Debug integration (1 developer, 3 weeks)
- Git enhancement (1 developer, 2 weeks)
- Team collaboration features (2 developers, 3 weeks)
- **Milestone:** Feature Release 1.3

**Weeks 31-36: Polish & Scale**
- Performance tuning for enterprise (2 developers, 3 weeks)
- Enterprise feature set (1 developer, 2 weeks)
- Long-term support planning (1 week)
- **Milestone:** Enterprise Release 1.4

---

## Resource Requirements

### Development Team

**Immediate (Q1 2026)**
- 2 Full-time TypeScript/VS Code Extension Developers
- 1 Part-time Technical Writer
- 1 Part-time QA Engineer
- 1 IBM i System Administrator (for testing infrastructure)

**Growth (Q2-Q3 2026)**
- 3 Full-time Developers (add +1)
- 1 Full-time Technical Writer
- 1 Full-time QA Engineer
- 1 DevOps Engineer (part-time)
- 1 Product Manager (part-time)

### Infrastructure Requirements

**Development Environment**
- GitHub repository (current)
- VS Code development environments
- IBM i test system (LPAR or cloud instance)
- CI/CD pipeline (GitHub Actions)

**Testing Infrastructure**
- IBM i test environment with various OS versions
- Automated test runners
- Performance testing tools

**Production/Distribution**
- VS Code Marketplace account (existing)
- Documentation hosting (GitHub Pages or ReadTheDocs)
- Support ticketing system (GitHub Issues)
- Community forum/Discord server

### Budget Estimates (Annual)

| Category | Q1 2026 | Q2-Q4 2026 | Total |
|----------|---------|------------|-------|
| Development Personnel | $75,000 | $225,000 | $300,000 |
| QA/Documentation | $25,000 | $75,000 | $100,000 |
| Infrastructure (IBM i hosting) | $5,000 | $15,000 | $20,000 |
| Tools & Services | $2,000 | $6,000 | $8,000 |
| Marketing/Community | $3,000 | $9,000 | $12,000 |
| **Total** | **$110,000** | **$330,000** | **$440,000** |

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| SSH connectivity issues with various IBM i configurations | Medium | High | Extensive testing with different IBM i versions; fallback communication methods |
| Performance degradation with large codebases (>10,000 files) | High | Medium | Implement caching, lazy loading, and background processing |
| VS Code API breaking changes | Low | Medium | Pin API versions, monitor VS Code release notes |
| Dependency vulnerabilities | Medium | High | Regular npm audits, automated security scanning |

### Business Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Low adoption rate | Medium | High | Active marketing, community building, competitive pricing |
| Competition from established vendors | High | Medium | Focus on superior UX, open-source advantage, community-driven development |
| IBM i market decline | Low | High | Expand to other midrange systems, focus on modernization narrative |
| Key developer departure | Medium | High | Knowledge documentation, code reviews, pair programming |

### Compliance & Security Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Security vulnerabilities in SSH implementation | Medium | High | Security audits, use well-tested libraries, regular updates |
| Credential storage concerns | High | Medium | Use VS Code secure storage, document best practices |
| Data loss during sync operations | Low | High | Transaction logging, rollback mechanisms, backup recommendations |

---

## Dependencies & Integration Points

### External Dependencies

**VS Code Extension APIs**
- Webview API (UI)
- TreeView API (source lists)
- Command API (operations)
- Configuration API (settings)
- File System API (local files)

**IBM i Requirements**
- SSH server enabled
- Bash shell available
- IFS access permissions
- ldm backend installed (separate repo: andreas-prouza/ldm)

**Third-Party Libraries**
- node-ssh: SSH communication
- hasha: File hashing
- nunjucks: Template rendering
- winston: Logging
- bootstrap: UI framework

### Integration Points

**VS Code Ecosystem**
- Git extension (source control)
- IBM i development extensions (Code for IBM i)
- Remote development extensions
- Debug adapters (future)

**IBM i Backend**
- ldm Python/Shell scripts (andreas-prouza/ldm repo)
- IBM i build commands (CRTBNDRPG, CRTSQLRPGI, etc.)
- IFS file system
- Job logs and spool files

---

## Competitive Analysis

### Direct Competitors

**1. IBM Rational Developer for i (RDi)**
- **Strengths:** Official IBM product, comprehensive, enterprise support
- **Weaknesses:** Expensive ($2,000+/seat), Eclipse-based (older UX), heavyweight
- **ldm Advantage:** Free, modern VS Code interface, Git-native

**2. Code for IBM i (VS Code Extension)**
- **Strengths:** Popular, free, modern interface
- **Weaknesses:** Individual file compilation, no automated dependency management
- **ldm Advantage:** Full build automation, dependency tracking, project-based workflow

**3. Traditional PDM/SEU**
- **Strengths:** Familiar to existing developers, no setup required
- **Weaknesses:** Green screen, no modern features, no Git integration
- **ldm Advantage:** All modern development practices, GUI, local development

### Market Positioning

**ldm's Unique Value Proposition:**
1. **Only solution** providing full build automation with dependency management in VS Code
2. **Git-native workflow** enabling modern DevOps practices
3. **Free and open-source** with enterprise-ready features
4. **Local-first development** with familiar tools

**Target Market Segments:**
- **Primary:** Small to medium IBM i shops (1-20 developers) modernizing workflows
- **Secondary:** IBM i consultants and freelancers needing flexible tools
- **Tertiary:** Large enterprises piloting modern development practices

---

## Support & Maintenance Strategy

### Support Channels

**Community Support (Free)**
- GitHub Issues (bug reports, feature requests)
- GitHub Discussions (Q&A, general help)
- Stack Overflow (tagged questions)
- Documentation/Wiki

**Professional Support (Future, Paid)**
- Email support with SLA
- Dedicated Slack/Discord channel
- Priority bug fixes
- Custom feature development

### Maintenance Plan

**Regular Updates**
- Bug fix releases: As needed (target: <1 week for critical)
- Feature releases: Quarterly
- Security patches: Immediate

**Long-Term Support**
- Maintain compatibility with VS Code stable releases
- Support IBM i 7.3+ (currently supported by IBM)
- Deprecation policy: 6-month notice for breaking changes

**Version Support Matrix**

| ldm Version | VS Code Version | IBM i Version | Support Status |
|-------------|-----------------|---------------|----------------|
| 1.0.x | 1.66+ | 7.3+ | Planned GA (Q1 2026) |
| 0.6.x | 1.66+ | 7.3+ | Current Beta |
| 0.5.x | 1.66+ | 7.3+ | Bug fixes only |
| <0.5 | 1.66+ | 7.3+ | Unsupported |

---

## Compliance & Licensing

### Open Source License
- **License:** MIT License
- **Implications:** Free for commercial use, modification, distribution
- **Third-party Licenses:** All dependencies reviewed for compatibility

### Privacy & Data Protection
- **Data Collection:** Optional telemetry (opt-in only)
- **Data Stored Locally:** Configuration, build history, cached source lists
- **Remote Data:** Only compilation logs and source code (user-controlled)
- **Compliance:** GDPR-ready (no automatic data transmission)

### Security Considerations
- Password storage: VS Code SecretStorage API
- SSH keys: User-managed, not stored by extension
- Code review: All contributions reviewed before merge
- Vulnerability reporting: security@prouza.at (to be established)

---

## Future Vision (2027+)

### Potential Enhancements

**AI-Powered Features**
- Intelligent dependency detection using ML
- Build failure prediction and prevention
- Automated code optimization suggestions
- Natural language build configuration

**Cloud Integration**
- Cloud-hosted build services
- Remote IBM i provisioning
- Build result sharing and collaboration
- CI/CD pipeline templates

**Enterprise Features**
- Role-based access control
- Audit logging and compliance reporting
- Enterprise license management
- Multi-tenancy support

**Ecosystem Expansion**
- Support for other midrange systems
- Integration with enterprise DevOps platforms
- Marketplace for extensions/plugins
- Third-party integration SDK

---

## Appendices

### Appendix A: Glossary

- **IFS:** Integrated File System (IBM i file system)
- **LIBL:** Library List (IBM i compilation search path)
- **ldm:** Lancelot Developemnt Manager
- **PDM:** Programming Development Manager (legacy IBM i tool)
- **RPGLE:** RPG IV (programming language for IBM i)
- **SEU:** Source Entry Utility (legacy IBM i editor)
- **Source Filter:** ldm's mechanism for organizing and selecting sources
- **Source Member:** Individual source file in IBM i terminology

### Appendix B: Configuration File Structure

```
project/
├── .ldm/
│   ├── config/
│   │   ├── app-config.toml (project config)
│   │   └── user-config.toml (user overrides)
│   ├── source-config/
│   │   └── config.json (per-source settings)
│   ├── source-list/
│   │   └── *.json (source filters)
│   ├── etc/
│   │   └── dependency.json (dependency map)
│   ├── compiled-objects.json (build state)
│   └── build-output/ (build logs)
├── src/ (source code)
└── .git/ (version control)
```

### Appendix C: Supported Object Types

| Type | Extension | Description | Build Order Priority |
|------|-----------|-------------|----------------------|
| PF | .pf.file | Physical File | 1 |
| LF | .lf.file | Logical File | 2 |
| DSPF | .dspf.file | Display File | 3 |
| PRTF | .prtf.file | Printer File | 4 |
| CMD | .cmd.cmd | Command | 5 |
| SQLRPGLE | .sqlrpgle.pgm | SQL RPG Program | 6 |
| RPGLE | .rpgle.pgm | RPG Program | 7 |
| SRVPGM | .rpgle.srvpgm | Service Program | 8 |
| MODULE | .rpgle.module | Module | 9 |
| CLLE | .clle.pgm | CL Program | 10 |
| PNLGRP | .pnlgrp.pnlgrp | Panel Group | 11 |

(And more - full list in configuration)

### Appendix D: Release History Summary

**v0.6.x** (Current Beta)
- Build history tracking
- Profile configuration
- Performance improvements

**v0.5.x**
- Individual source configuration
- Build summary enhancements
- Command ignore list

**v0.4.x**
- Dependency maintenance UI
- Source member management
- Improved Windows support

**v0.3.x**
- Source description maintenance
- Configuration panel improvements
- Multi-language support

**v0.2.x**
- Source filters
- Build execution
- Change detection

**v0.1.x**
- Initial release
- Basic build functionality

### Appendix E: Key Stakeholders

**Internal Team**
- Andreas Prouza - Lead Developer & Product Owner
- Development Team - (to be expanded)
- QA Team - (to be established)

**External Stakeholders**
- Beta Users - Current testers providing feedback
- IBM i Community - Target user base
- VS Code Team - Platform provider
- IBM - Platform vendor

### Appendix F: References & Links

- **Extension Repository:** https://github.com/andreas-prouza/ldm-extension
- **Backend Repository:** https://github.com/andreas-prouza/ldm
- **Documentation:** https://github.com/andreas-prouza/ibm-i-build-ldm
- **VS Code Marketplace:** (to be published at GA)
- **Support Site:** https://www.prouza.at

---

## Document Approval

This PRD requires approval from:

- [ ] Product Owner: Andreas Prouza
- [ ] Development Lead: _________________
- [ ] Project Manager: _________________
- [ ] Executive Sponsor: _________________

**Approval Date:** _________________

**Next Review Date:** April 23, 2026 (Quarterly Review)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 23, 2026 | GitHub Copilot | Initial PRD creation based on codebase analysis |

---

**Document End**
