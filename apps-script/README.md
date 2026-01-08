# Apps Script setup

1. Open the Google Sheet.
2. Extensions -> Apps Script.
3. Replace the default file contents with `Code.gs` from this folder.
4. Update `SHEET_NAME` if your tab name differs.
5. Deploy -> New deployment -> Web app.
   - Execute as: Me
   - Who has access: Anyone
6. Copy the Web app URL and pass it into the component as `apiUrl`.

## Expected columns

The script reads columns A through R in `SHEET_NAME` using this layout:

A: first name  
B: last name  
C: area  
D: role  
E: status  
F: email  
G: phone number  
H: address  
I: birthday  
J: notes  
K: cc  
L: nametag  
M: emergency contact  
N: volunteer anniversary  
O: constant contact (A)  
P: constant contact (B)  
Q: picture url  
R: background notes
