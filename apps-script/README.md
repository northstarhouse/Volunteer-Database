# Apps Script setup

1. Open the Google Sheet.
2. Extensions -> Apps Script.
3. Replace the default file contents with `Code.gs` from this folder.
4. Update `SHEET_NAME` if your tab name differs.
5. Deploy -> New deployment -> Web app.
   - Execute as: Me
   - Who has access: Anyone
6. Copy the Web app URL and pass it into the component as `apiUrl`.

## Expected headers

Row 1 should contain the following headers:

id, name, area, photo, email, phone, address, birthday, background, hours, emergencyContact, notes
