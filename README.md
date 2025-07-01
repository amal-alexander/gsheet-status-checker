# 🔍 Google Sheets URL Status Code Checker

A fast, no-dependency Google Apps Script to check HTTP status codes and redirect URLs for bulk URLs directly in Google Sheets.

Built using `UrlFetchApp.fetchAll()` for performance. Ideal for SEOs, developers, and QA engineers who need to audit links at scale.

---

## ⚡ Features

- ✅ Bulk-check any number of URLs from Column A
- 🟢 Column B = HTTP Status Code (200, 301, 404, etc.)
- 🔁 Column C = Redirect URL (if applicable)
- 🚀 Uses `fetchAll()` for parallel HTTP requests
- 📋 Auto-adds headers: `"Status Code"` and `"Redirect URL"`
- 🛡️ Handles unreachable links with `"Error"` fallback

---

## 🛠️ How It Works

1. Open your Google Sheet
2. Paste URLs in **Column A**, starting at `A2` (no header required)
3. Click `Extensions → Apps Script`
4. Paste the code below into the editor
5. Save and click ▶️ `Run` → `checkAllStatusCodes()`  
6. Done! Results will appear in Columns B and C

---

## 💻 Full Script (Paste into Apps Script Editor)

```javascript
function checkAllStatusCodes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const urls = sheet.getRange("A2:A").getValues().flat().filter(url => url);

  if (urls.length === 0) {
    SpreadsheetApp.getUi().alert("No URLs found in Column A.");
    return;
  }

  // Set headers
  sheet.getRange("B1").setValue("Status Code");
  sheet.getRange("C1").setValue("Redirect URL");

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

  // Output to B2 and C2
  sheet.getRange(2, 2, results.length, 2).setValues(results);
}
```
## 📊 Example Output

| URL                 | Status Code | Redirect URL              |
|---------------------|--------------|---------------------------|
| https://google.com  | 200          |                           |
| http://youtube.com  | 301          | https://www.youtube.com/  |
| https://notfound.test | 404        |                           |

---

## 🔐 Permissions Required

This Google Apps Script requires:
- ✅ Access to edit the current spreadsheet  
- ✅ Access to external URLs using `UrlFetchApp`  

Google will prompt you to authorize these permissions when running the script for the first time.

---

## 🔧 Use Cases

- SEO redirect audits  
- Detect 4xx/5xx issues at scale  
- Validate affiliate or outbound links  
- Track site migration issues  
- Monitor redirect loops or broken URLs  

---

## 👨‍💻 Author

**Amal Alexander**  
[LinkedIn Profile](https://www.linkedin.com/in/amal-alexander-305780131/)  
SEO Professional | Automation Builder  
📩 Open to feedback and contributions!

---

## 📘 License

MIT License — Free to use, fork, and modify. Attribution appreciated but not required.

---

⭐ **Like this tool?** Drop a ⭐ on the GitHub repo, or share it with your SEO or dev teams!
