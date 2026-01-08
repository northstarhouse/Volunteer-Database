const SHEET_ID = '1R-rBXFEnqcWXJCAbvpJwXooe-G231tanGYN4GDBv9ZA';
const SHEET_NAME = 'Volunteers';

const HEADERS = [
  'id',
  'name',
  'area',
  'photo',
  'email',
  'phone',
  'address',
  'birthday',
  'background',
  'hours',
  'emergencyContact',
  'notes'
];

function doGet() {
  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);
  const volunteers = rows.map(rowToVolunteer_).filter(Boolean);

  return buildResponse_({ volunteers: volunteers });
}

function doPost(e) {
  const payload = parsePayload_(e);
  if (!payload || !payload.volunteer) {
    return buildResponse_({ error: 'Missing volunteer payload.' }, 400);
  }

  const sheet = getSheet_();
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);
  const volunteers = rows.map(rowToVolunteer_).filter(Boolean);

  const updated = upsertVolunteer_(sheet, volunteers, payload.volunteer);
  const refreshed = sheet.getDataRange().getValues().slice(1).map(rowToVolunteer_).filter(Boolean);

  return buildResponse_({ volunteers: refreshed, updated: updated });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet not found: ' + SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function rowToVolunteer_(row) {
  if (!row || row.length === 0) {
    return null;
  }

  const volunteer = {};
  HEADERS.forEach((header, index) => {
    volunteer[header] = row[index] !== undefined ? row[index] : '';
  });

  return volunteer;
}

function upsertVolunteer_(sheet, volunteers, volunteer) {
  const normalized = Object.assign({}, volunteer);
  if (!normalized.id) {
    normalized.id = nextId_(volunteers);
  }

  const rowIndex = volunteers.findIndex((item) => String(item.id) === String(normalized.id));
  const rowValues = HEADERS.map((header) => normalized[header] || '');

  if (rowIndex >= 0) {
    sheet.getRange(rowIndex + 2, 1, 1, HEADERS.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return normalized;
}

function nextId_(volunteers) {
  if (!volunteers.length) {
    return 1;
  }

  const ids = volunteers
    .map((item) => parseInt(item.id, 10))
    .filter((value) => !isNaN(value));

  return Math.max.apply(null, ids.concat([0])) + 1;
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return null;
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return null;
  }
}

function buildResponse_(payload, statusCode) {
  const output = ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);

  return output.setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Status', statusCode || 200);
}

function doOptions() {
  return buildResponse_({ ok: true });
}
