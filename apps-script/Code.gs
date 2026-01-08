const SHEET_ID = '1R-rBXFEnqcWXJCAbvpJwXooe-G231tanGYN4GDBv9ZA';
const SHEET_NAME = '2026 Volunteers';

const COLUMN_KEYS = [
  'firstName',
  'lastName',
  'area',
  'role',
  'status',
  'email',
  'phoneNumber',
  'address',
  'birthday',
  'notes',
  'cc',
  'nametag',
  'emergencyContact',
  'volunteerAnniversary',
  'constantContactA',
  'constantContactB',
  'photo',
  'background',
  'whatTheyWant'
];

const PHOTO_COLUMN_INDEX = COLUMN_KEYS.indexOf('photo');

function doGet() {
  const sheet = getSheet_();
  const range = sheet.getDataRange();
  const data = range.getValues();
  const richData = range.getRichTextValues();
  const rows = data.slice(1);
  const richRows = richData.slice(1);
  const volunteers = rows
    .map((row, index) => rowToVolunteer_(row, index + 2, richRows[index]))
    .filter(Boolean);

  return buildResponse_({ volunteers: volunteers });
}

function doPost(e) {
  const payload = parsePayload_(e);
  if (!payload || !payload.volunteer) {
    return buildResponse_({ error: 'Missing volunteer payload.' }, 400);
  }

  const sheet = getSheet_();
  const range = sheet.getDataRange();
  const data = range.getValues();
  const richData = range.getRichTextValues();
  const rows = data.slice(1);
  const richRows = richData.slice(1);
  const volunteers = rows
    .map((row, index) => rowToVolunteer_(row, index + 2, richRows[index]))
    .filter(Boolean);

  const updated = upsertVolunteer_(sheet, volunteers, payload.volunteer);
  const refreshedRange = sheet.getDataRange();
  const refreshedValues = refreshedRange.getValues().slice(1);
  const refreshedRich = refreshedRange.getRichTextValues().slice(1);
  const refreshed = refreshedValues
    .map((row, index) => rowToVolunteer_(row, index + 2, refreshedRich[index]))
    .filter(Boolean);

  return buildResponse_({ volunteers: refreshed, updated: updated });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet not found: ' + SHEET_NAME);
  }

  return sheet;
}

function rowToVolunteer_(row, rowNumber, richRow) {
  if (!row || row.length === 0) {
    return null;
  }

  const volunteer = { _row: rowNumber };
  COLUMN_KEYS.forEach((key, index) => {
    volunteer[key] = row[index] !== undefined ? row[index] : '';
  });

  if (richRow && PHOTO_COLUMN_INDEX >= 0) {
    const richCell = richRow[PHOTO_COLUMN_INDEX];
    if (richCell && typeof richCell.getLinkUrl === 'function') {
      const linkUrl = richCell.getLinkUrl();
      if (linkUrl) {
        volunteer.photo = linkUrl;
      }
    }
  }

  return volunteer;
}

function upsertVolunteer_(sheet, volunteers, volunteer) {
  const normalized = Object.assign({}, volunteer);
  const targetRow = normalized._row ? parseInt(normalized._row, 10) : null;
  const rowValues = COLUMN_KEYS.map((key) => normalized[key] || '');

  if (targetRow) {
    sheet.getRange(targetRow, 1, 1, COLUMN_KEYS.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return normalized;
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
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions() {
  return buildResponse_({ ok: true });
}
