
/**
 * JEJAK LANGKAH ADVENTURE - CLOUD SYNC ENGINE
 * Versi: 4.6 (Support Alamat, Email, Merbabu Code, and Identity Upload)
 */

function doGet(e) {
  return createResponse({ 
    status: 'success', 
    message: 'Cloud Sync Engine is Online',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return createResponse({ status: 'error', message: 'No payload provided' });
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch(action) {
      case 'NEW_REGISTRATION':
        return handleNewRegistration(data);
      case 'UPDATE_STATUS':
        return handleUpdateStatus(data);
      case 'UPDATE_REGISTRATION':
        return handleUpdateRegistration(data);
      case 'FETCH_ALL':
        return handleFetchAll(data);
      default:
        return createResponse({ status: 'error', message: 'Action unknown: ' + action });
    }
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleFetchAll(payload) {
  const ssId = payload.spreadsheetId;
  if (!ssId) return createResponse({ status: 'error', message: 'Spreadsheet ID Kosong' });

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = getOrCreateSheet(ss, "Pendaftaran");
    const values = sheet.getDataRange().getValues();
    const results = [];

    // Header index map:
    // 0: ID, 1: Waktu, 2: Nama, 3: Email, 4: WhatsApp, 5: Alamat, 6: Gunung, 7: Mulai, 8: Kode Merbabu, 9: Identitas, 10: Tipe, 11: Paket, 12: Status, 13: Kode Tiket
    for (let i = 1; i < values.length; i++) {
      let row = values[i];
      results.push({
        id: row[0],
        timestamp: row[1],
        fullName: row[2],
        email: row[3],
        whatsapp: row[4],
        address: row[5],
        mountain: row[6],
        startDate: row[7],
        climberCode: row[8],
        identityImage: row[9],
        packageCategory: row[10],
        tripPackage: row[11],
        status: row[12] || "Menunggu Verifikasi"
      });
    }

    return createResponse({ status: 'success', data: results });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleNewRegistration(payload) {
  const reg = payload.registration;
  const ssId = payload.spreadsheetId;

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = getOrCreateSheet(ss, "Pendaftaran");

    sheet.appendRow([
      reg.id,
      reg.timestamp,
      reg.fullName,
      reg.email,
      reg.whatsapp,
      reg.address,
      reg.mountain,
      reg.startDate,
      reg.climberCode || "-",
      reg.identityImage || "-", // Base64
      reg.packageCategory,
      reg.tripPackage,
      reg.status || "Menunggu Verifikasi",
      reg.id.toString().slice(-6)
    ]);

    return createResponse({ status: 'success', message: 'Terdaftar' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleUpdateStatus(payload) {
  const ssId = payload.spreadsheetId;
  const regId = payload.id;
  const newStatus = payload.status;

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName("Pendaftaran");
    const dataRows = sheet.getDataRange().getValues();
    
    for (let i = 1; i < dataRows.length; i++) {
      if (dataRows[i][0].toString() === regId.toString()) {
        sheet.getRange(i + 1, 13).setValue(newStatus); // Kolom M (13) adalah Status
        return createResponse({ status: 'success', message: 'Status Terupdate' });
      }
    }
    return createResponse({ status: 'error', message: 'ID Tidak Ditemukan' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function handleUpdateRegistration(payload) {
  const ssId = payload.spreadsheetId;
  const reg = payload.registration;

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName("Pendaftaran");
    const dataRows = sheet.getDataRange().getValues();
    
    for (let i = 1; i < dataRows.length; i++) {
      if (dataRows[i][0].toString() === reg.id.toString()) {
        const rowIndex = i + 1;
        sheet.getRange(rowIndex, 3).setValue(reg.fullName);
        sheet.getRange(rowIndex, 4).setValue(reg.email);
        sheet.getRange(rowIndex, 5).setValue(reg.whatsapp);
        sheet.getRange(rowIndex, 6).setValue(reg.address);
        sheet.getRange(rowIndex, 7).setValue(reg.mountain);
        sheet.getRange(rowIndex, 9).setValue(reg.climberCode || "-");
        sheet.getRange(rowIndex, 13).setValue(reg.status);
        return createResponse({ status: 'success', message: 'Data Terupdate' });
      }
    }
    return createResponse({ status: 'error', message: 'ID Tidak Ditemukan' });
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() });
  }
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = ["ID", "Waktu Daftar", "Nama", "Email", "WhatsApp", "Alamat", "Gunung", "Mulai", "Kode Merbabu", "Identitas", "Tipe", "Paket", "Status", "Kode Tiket"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e11d48").setFontColor("#ffffff");
  }
  return sheet;
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
