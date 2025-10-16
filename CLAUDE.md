# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ATRACT Tracker is a React-based medical device testing campaign management system. It tracks the distribution and testing of ATRACT traction devices (ATRACT-C and ATRACT-S) across testing campaigns, manages assignments to testers ("chefs"), and provides analytics for supervisors ("HIC"/observers).

**Stack**: React 19.2, Supabase (PostgreSQL), TailwindCSS 3.4

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm start

# Run tests (Jest + React Testing Library)
npm test

# Build production bundle
npm run build
```

## Environment Setup

Required environment variables in `.env`:
- `REACT_APP_SUPABASE_URL` - Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase anonymous key

## Architecture Overview

### Monolithic Structure
The entire application is a **single 2429-line component** in `src/App.js`. All UI components, business logic, and state management are contained in this file. This is the primary file you'll work with for features, bug fixes, and modifications.

### Database Schema (Supabase)

Five main tables with the following relationships:

```
campaigns (testing campaigns)
  ├── id, name, start_date, status, inventory (JSON)
  └── → assignments (device distribution)
        ├── campaign_id, chef_id, generation_id, qty_assigned
        ├── received_confirmed_at (receipt confirmation timestamp)
        └── → tests (test results)
              ├── assignment_id, test_date, context, clip
              ├── ease_score (1-5), efficacy_score (1-5)
              ├── problem (boolean), problem_desc
              └── comments

chefs (testers/users)
  ├── id, name, last_name, email
  └── Password: {last_name}ATRACT (e.g., "DUPONATRACT")

generations (product variants)
  ├── id=1: ATRACT-C
  └── id=2: ATRACT-S
```

**Key Relationships**:
- Campaign inventory is JSON: `{ "1": count_C, "2": count_S }`
- Assignments track qty_assigned vs actual test count for progress
- Tests link to assignments (not directly to campaigns)

### User Roles & Authentication

Three distinct roles with different capabilities:

1. **Admin** (password: `Latractiondufuturen2026@`)
   - Create/delete campaigns with initial inventory
   - Manage chefs (add/delete testers)
   - Create device assignments to chefs
   - View all data and access all interfaces

2. **Chef** (password: `{LAST_NAME}ATRACT`)
   - Select from assigned campaigns only
   - Confirm receipt of devices
   - Log test results with scores and problem reporting
   - View personal statistics

3. **Observer/HIC** (password: `HicATRACT2026`)
   - Read-only access to all campaigns
   - Filter and view all test results
   - Export data to CSV
   - Track issues and completion metrics

### State Management Pattern

All state is managed in the root `AtractApp` component:

```javascript
const [data, setData] = useState({
  generations: [],
  chefs: [],
  campaigns: [],
  assignments: [],
  tests: []
});

const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userRole, setUserRole] = useState(null); // 'admin', 'chef', 'observer'
const [currentChef, setCurrentChef] = useState(null);
```

**Data Loading**: The `loadData()` function fetches all 5 tables in parallel via Supabase and is called:
- On initial mount
- After any data modification (create/update/delete)

**No state management library** is used (no Redux, Zustand, etc.). All state is local to the main component.

### Key Components Within App.js

- `RedAlert` - High-visibility warning for device defects (includes return shipping address)
- `NewCampaignModal` - Campaign creation with inventory management
- `ChefStats` - Statistical dashboard for chef performance
- `NewAssignmentModal` - Device assignment creation
- `AddChefModal` - Chef registration
- `LoginScreen` - Role-based authentication

### Main User Workflows

**Campaign Setup (Admin)**:
1. Create campaign → set inventory per generation
2. Create assignments → select chef, generation, quantity
3. System validates stock availability

**Testing Process (Chef)**:
1. Login → select campaign → confirm receipt
2. Start new test → fill form (date, context, clip, scores)
3. If problem encountered → mandatory description required
4. View personal stats and test history

**Monitoring (Observer)**:
1. View all campaigns or filter specific ones
2. Filter by chef, generation, or problems only
3. Expandable rows show full test details
4. Export to CSV for analysis

**Problem Escalation**:
- Chef marks test with problem → mandatory description
- Red alert displayed with cleaning instructions and return address
- Visible in observer dashboard and CSV export

## Important Business Logic

### Test Scoring System
- **Ease Score (1-5)**: Device setup difficulty (1=very difficult, 5=very easy)
- **Efficacy Score (1-5)**: Traction effectiveness (1=very poor, 5=excellent)
- **Problem Flag**: Boolean indicating device defect
- **Problem Description**: Mandatory if problem=true

### Inventory & Progress Tracking
- Campaign inventory decremented when assignments created
- Assignment progress: `tests.length / qty_assigned`
- Receipt confirmation: one-time `received_confirmed_at` timestamp
- Completion metrics: `(totalTested / totalAssigned) * 100`

### Statistics Calculations (ChefStats)
For each chef's assigned tests:
- Total test count
- Average ease/efficacy scores
- Problem rate percentage
- Distribution by context, clip type, generation
- Recent test evolution (last 5 tests)

## Code Patterns & Conventions

### Supabase Operations
```javascript
// Insert pattern
const { error } = await supabase.from('table_name').insert(data);
if (error) {
  window.alert('Error message');
  return;
}
await loadData(); // Always reload after modification

// Delete pattern
await supabase.from('table_name').delete().eq('id', id);
await loadData();
```

### Form Handling
Forms use controlled components with local state objects (e.g., `testForm`, `formData`). Validation happens in submit handlers with `window.alert()` for errors.

### Styling
- TailwindCSS utility classes throughout
- Responsive design with mobile-first approach
- Color coding: blue (admin), green (chef), purple (observer/HIC)
- Problem indicators use red with `animate-pulse`

## Known Technical Debt

1. **Monolithic structure**: All code in single 2429-line file
   - Consider: Component extraction, feature-based folders

2. **No real-time updates**: Manual data refresh after operations
   - Consider: Supabase realtime subscriptions

3. **Minimal test coverage**: Only placeholder test exists
   - Add: Component tests, integration tests

4. **Hard-coded authentication**: Passwords in code
   - Consider: Supabase Auth with proper user management

5. **No state management library**: All state in root component
   - Consider: Context API for cross-cutting concerns

6. **Debug logs in production**: Console logs throughout (lines 974-1084)
   - Remove or gate behind environment variable

## Testing Notes

Current test setup uses Jest via create-react-app with React Testing Library. Only a placeholder test exists in `App.test.js`.

To run tests in watch mode:
```bash
npm test
```

For single test run:
```bash
npm test -- --watchAll=false
```

## Common Modifications

### Adding a new test field
1. Update `testForm` initial state in ChefDashboard
2. Add form input in test form view
3. Include field in Supabase insert operation
4. Update observer dashboard test display
5. Add to CSV export columns

### Adding a new user role
1. Add role to LoginScreen authentication logic
2. Create role-specific dashboard component
3. Update routing in AtractApp based on userRole
4. Configure Supabase RLS policies if needed

### Modifying statistics
Update `ChefStats` component calculations (search for "ChefStats" in App.js around line 800-1000)

## Supabase Configuration

The application uses a single Supabase client configured in `src/supabaseClient.js`. Row Level Security (RLS) should be configured in Supabase dashboard to enforce access controls at the database level (currently enforced only at UI level).

## Deployment Notes

Standard Create React App build process:
1. Set environment variables in hosting platform
2. Run `npm run build`
3. Deploy `build/` folder to static hosting

The app is a pure client-side SPA with no server-side rendering.
