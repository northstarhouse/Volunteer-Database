# Volunteer-Database

Volunteer portal component for managing a small volunteer database. Includes search, profile details, and inline editing. Supports Apps Script-backed Google Sheets sync.

## Notes

- Built with React and lucide-react icons.
- Tailwind utility classes are used for styling.
- Sample data is embedded for demo purposes.
- To enable Google Sheets sync, deploy the Apps Script in `apps-script/` and pass the Web app URL as the `apiUrl` prop.
- GitHub Pages deploy is handled by `.github/workflows/deploy.yml`. Set `VITE_SHEETS_API_URL` as a repo secret to bake the Apps Script URL into the build.

## Files

- `src/VolunteerPortal.jsx`
- `apps-script/Code.gs`
- `src/App.jsx`
