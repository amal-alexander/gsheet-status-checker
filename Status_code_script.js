function checkAllStatusCodes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const urls = sheet.getRange("A2:A").getValues().flat().filter(url => url);

  const requests = urls.map(url => ({
    url: url,
    muteHttpExceptions: true,
    followRedirects: false,
  }));

  let results = [];

  try {
    const responses = UrlFetchApp.fetchAll(requests);

    results = responses.map((response, index) => {
      const statusCode = response.getResponseCode();
      const headers = response.getAllHeaders();
      const location = headers['Location'] || headers['location'] || '';
      return [statusCode, location];
    });
  } catch (e) {
    results = urls.map(() => ["Error", ""]);
  }

  // Paste status + redirect info into columns B and C
  sheet.getRange(2, 2, results.length, 2).setValues(results);
}
