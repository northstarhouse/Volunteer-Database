# Volunteer-Database

Volunteer portal component for managing a small volunteer database. Includes search, profile details, and inline editing. Supports Apps Script-backed Google Sheets sync.

## Notes

- Built with React and lucide-react icons.
- Tailwind utility classes are used for styling.
- Sample data is embedded for demo purposes.
- To enable Google Sheets sync, deploy the Apps Script in `apps-script/` and pass the Web app URL as the `apiUrl` prop.

## Files

- `src/VolunteerPortal.jsx`
- `apps-script/Code.gs`
