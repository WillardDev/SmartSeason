# SmartSeason

A comprehensive agricultural field monitoring and management platform for tracking crop growth, staging, and health across multiple fields. SmartSeason enables administrators to manage fields and field agents, while field agents can provide real-time updates on crop progress.

## Project Overview

SmartSeason is a full-stack application consisting of:

- **Backend API**: Laravel 13 REST API with role-based access control
- **Frontend**: React 19 single-page application with Vite

The system manages field data including crop types, planting dates, growth stages, and automatic status computation based on temporal data.

## Tech Stack

### Backend (smartseason-api)
- **Framework**: Laravel 13.0
- **PHP**: 8.3+
- **Authentication**: Laravel Sanctum (token-based API auth)
- **ORM**: Eloquent
- **Authorization**: Spatie Laravel Permission
- **Database**: Postgresql `.env`
- **Testing**: PHPUnit

### Frontend (smartseason-web)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: TanStack React Query v5
- **Visualization**: Recharts
- **Linting**: ESLint

## Directory Structure

```
smartseason/
├── smartseason-api/          # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # API endpoints
│   │   │   ├── Middleware/   # Auth & role middleware
│   │   │   ├── Requests/     # Form validation
│   │   │   └── Resources/    # API response formatting
│   │   └── Models/           # Eloquent models
│   ├── database/
│   │   ├── migrations/       # Schema definitions
│   │   ├── seeders/          # Demo data
│   │   └── factories/        # Model factories
│   ├── routes/api.php        # API route definitions
│   └── config/               # Application configuration
├── smartseason-web/          # React frontend
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── components/       # React components
│   │   ├── context/          # React context
│   │   ├── pages/            # Page components
│   │   └── routes/           # Route definitions
│   └── vite.config.js        # Vite configuration
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites
- PHP 8.3+
- Node.js 18+
- npm or yarn
- SQLite3 (or MySQL/PostgreSQL)
- Git

### Backend Setup

1. **Navigate to the API directory**
   ```bash
   cd smartseason-api
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Create environment configuration**
   ```bash
   cp .env.example .env
   ```

4. **Generate application key**
   ```bash
   php artisan key:generate
   ```

5. **Run database migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed demo data**
   ```bash
   php artisan db:seed
   ```

7. **Start the development server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to the web directory**
   ```bash
   cd smartseason-web
   ```

2. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

3. **Create environment configuration** (if needed)
   Create a `.env.local` file with:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Quick Setup (from root directory)

For a complete setup of both frontend and backend in one command:

```bash
cd smartseason-api && composer run setup && cd ../smartseason-web && npm install
```

Then run the dev server for both:

```bash
cd smartseason-api && composer run dev
```

This uses concurrently to run:
- Laravel server on port 8000
- Vite dev server on port 5173
- Laravel queue listener
- Application logs

## Demo Credentials

Use these credentials to test the application. All test accounts are created by the `UserSeeder`.

### Admin Account
- **Email**: `admin@smartseason.test`
- **Password**: `smarts3@son`
- **Role**: Admin (can manage fields and all users)

### Field Agent Account
- **Email**: `agent@smartseason.test`
- **Password**: `smarts3@son`
- **Role**: Agent (can update assigned fields)

### Additional Agent Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Jane Mwangi | jane@smartseason.test | password | Agent |
| Brian Otieno | brian@smartseason.test | password | Agent |
| Amina Wanjiru | amina@smartseason.test | password | Agent |

## API Endpoints

### Authentication
- `POST /api/login` - Authenticate user and receive API token
- `POST /api/logout` - Invalidate API token
- `GET /api/me` - Get current authenticated user

### Dashboard
- `GET /api/dashboard` - Get dashboard overview data

### Fields (Read)
- `GET /api/fields` - List all fields
- `GET /api/fields/{id}` - Get field details

### Fields (Admin-only Write)
- `POST /api/fields` - Create a new field
- `PUT /api/fields/{id}` - Update a field
- `DELETE /api/fields/{id}` - Delete a field

### Field Updates
- `POST /api/fields/{id}/updates` - Create a field status update (agents)
- `GET /api/fields/{id}/updates` - Get all updates for a field

### Users (Admin-only)
- `GET /api/users` - List all users

## Design Decisions

### 1. **Role-Based Access Control (RBAC)**
   - **Decision**: Implemented using Spatie Laravel Permission package
   - **Rationale**: Provides flexible role management with middleware guards. Allows admins to manage fields while agents can only update fields assigned to them
   - **Implementation**: Middleware `role.admin` protects admin-only endpoints

### 2. **Computed Status Field**
   - **Decision**: Status is calculated on-the-fly in the Field model rather than stored in the database
   - **Rationale**: 
     - Status is derived from immutable data (planting_date) and stage
     - Eliminates need for background jobs to update status
     - Always reflects current business logic
   - **Logic**:
     - **"Completed"**: Stage is "Harvested"
     - **"At Risk"**: Days since planting > 90 AND stage is not "Ready" or "Harvested"
     - **"Active"**: All other stages

### 3. **Token-Based Authentication (Sanctum)**
   - **Decision**: Used Laravel Sanctum instead of traditional session cookies
   - **Rationale**:
     - Stateless authentication suitable for API-first architecture
     - Seamless integration with modern SPAs
     - Built-in Laravel support with minimal configuration
     - Secure token management with automatic expiration

### 4. **Field Updates as Separate Records**
   - **Decision**: Field stage updates create new `FieldUpdate` records rather than updating the Field record directly
   - **Rationale**:
     - Maintains audit trail of all stage changes
     - Tracks which agent made each update and when
     - Enables historical analysis of field progression
     - Supports workflow validation (can't skip stages)

### 5. **Nullable Agent Assignment**
   - **Decision**: `assigned_agent_id` is nullable on Field model
   - **Rationale**:
     - Allows fields to exist before assignment
     - Supports reassignment to different agents
     - Gracefully handles agent deletion

### 6. **React Query for State Management**
   - **Decision**: Used TanStack React Query instead of Redux or Zustand
   - **Rationale**:
     - Excellent server state synchronization
     - Built-in caching, retry logic, and background refetching
     - Reduces boilerplate code for API data management
     - Automatic stale-while-revalidate patterns

### 7. **Vite as Build Tool**
   - **Decision**: Chose Vite over traditional Create React App or Webpack
   - **Rationale**:
     - Significantly faster HMR (hot module replacement)
     - Minimal configuration required
     - Native ES module support
     - Better production build performance

## Assumptions

1. **Single Timezone**: The application assumes all timestamps operate in the server's configured timezone. Planting dates and status calculations use this assumption.

2. **Field Agent Assignment**: A field can only be assigned to one agent at a time. Multi-agent assignments would require schema changes.

3. **Crop Stages are Sequential**: The application enforces that crop stages follow the sequence: `Planted` → `Growing` → `Ready` → `Harvested`. Backward transitions are not supported.

4. **Agent Availability**: When a field is assigned to an agent, it assumes that agent will be actively monitoring it. No scheduling or workload balancing is implemented.

5. **Real-Time Status**: The computed "At Risk" status is calculated when data is fetched. The frontend will see updated status on refresh but won't receive real-time push notifications.

6. **User Email Uniqueness**: The system assumes emails are unique per user. The database enforces this through a unique constraint.

7. **SQLite for Development**: The default `.env.example` uses SQLite. Production deployments should use PostgreSQL or MySQL.

8. **CORS Configuration**: The API assumes the frontend will be served from a known origin. CORS should be configured in production.

9. **No Soft Deletes**: Fields and field updates are permanently deleted. Consider implementing soft deletes if audit compliance is needed.

10. **Testing Data Isolation**: Seeders create test data assuming a fresh database. Running seeders multiple times will duplicate data.

## Running Tests

### Backend Tests
```bash
cd smartseason-api
php artisan test
```

### Frontend Tests
```bash
cd smartseason-web
npm run test
```

## Building for Production

### Backend
```bash
cd smartseason-api
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
```

### Frontend
```bash
cd smartseason-web
npm run build
```
The production build will be output to `dist/`

## Project Statistics

- **Models**: User, Field, FieldUpdate
- **API Routes**: 12+ endpoints
- **Database Tables**: 8 (users, fields, field_updates, personal_access_tokens, roles, permissions, role_has_permissions, model_has_roles)
- **Seeders**: 3 (DatabaseSeeder, UserSeeder, FieldSeeder)
- **React Components**: Multiple pages and reusable components
- **Middleware**: Role-based access control

## Future Enhancements

- Real-time WebSocket updates for field status changes
- Mobile application for field agents
- Weather integration for crop health predictions
- Automated alerts for fields entering "At Risk" status
- Field performance analytics and reporting
- Photo uploads and image analysis
- Crop recommendation engine based on region and history

## License

This project is open-source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the project repository.
