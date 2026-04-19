# penny-reading
A set of reading tools to help K-3 students learn to read

## Technical Operations

### Development Server
To start the local development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Database Management
The application uses SQLite with Drizzle ORM.

**Resetting the Database**  
This command will delete the existing `sqlite.db` file, recreate the schema, and seed the database with initial curriculum data.  
**Warning:** This will erase all user progress and session history.
```bash
npm run db:reset
```

**Seeding content**  
To manually trigger the content seeding script (useful if you've added new patterns or words to `src/db/seed.ts`):
```bash
npm run db:seed
```

### Production Build
To create an optimized production build:
```bash
npm run build
```

To run the production build locally:
```bash
npm run start
```

### Linting
To run the linter:
```bash
npm run lint
```
