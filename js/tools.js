const $ = id => document.getElementById(id);
const copyText = async text => { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } };
const notify = (id, text) => { const el = $(id); if (el) el.textContent = text; };

function formatJson() {
  const input = $('json-input').value.trim();
  try { $('json-output').value = JSON.stringify(JSON.parse(input), null, 2); notify('json-message', 'Valid JSON formatted successfully.'); }
  catch (error) { $('json-output').value = ''; notify('json-message', `Invalid JSON: ${error.message}`); }
}
function minifyJson() {
  try { $('json-output').value = JSON.stringify(JSON.parse($('json-input').value)); notify('json-message', 'JSON minified successfully.'); }
  catch (error) { notify('json-message', `Invalid JSON: ${error.message}`); }
}
function formatSql() {
  let sql = $('sql-input').value.trim().replace(/\s+/g, ' ');
  const keywords = ['SELECT','FROM','WHERE','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN','JOIN','GROUP BY','ORDER BY','HAVING','LIMIT','UNION','SET','VALUES'];
  keywords.forEach(k => { sql = sql.replace(new RegExp(`\\s+${k}\\s+`, 'gi'), `\n${k} `); });
  sql = sql.replace(/\s+(AND|OR)\s+/gi, '\n  $1 ');
  $('sql-output').value = sql.trim(); notify('sql-message', 'SQL formatted successfully.');
}
function generateUuid() {
  const count = Math.min(Math.max(parseInt($('uuid-count').value, 10) || 1, 1), 100);
  const values = Array.from({length: count}, () => crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8); return v.toString(16); }));
  $('uuid-output').value = values.join('\n'); notify('uuid-message', `${count} UUID${count === 1 ? '' : 's'} generated.`);
}
function encodeBase64() { try { $('base64-output').value = btoa(unescape(encodeURIComponent($('base64-input').value))); notify('base64-message', 'Text encoded to Base64.'); } catch { notify('base64-message', 'Could not encode this text.'); } }
function decodeBase64() { try { $('base64-output').value = decodeURIComponent(escape(atob($('base64-input').value.trim()))); notify('base64-message', 'Base64 decoded to text.'); } catch { notify('base64-message', 'Invalid Base64 input.'); } }
function bindCopy(buttonId, outputId, messageId) { $(buttonId).addEventListener('click', async () => { const ok = await copyText($(outputId).value); notify(messageId, ok ? 'Copied to clipboard.' : 'Copy failed — select the text to copy it.'); }); }

window.addEventListener('DOMContentLoaded', () => {
  if ($('json-input')) { $('json-format').onclick = formatJson; $('json-minify').onclick = minifyJson; bindCopy('json-copy','json-output','json-message'); }
  if ($('sql-input')) { $('sql-format').onclick = formatSql; bindCopy('sql-copy','sql-output','sql-message'); }
  if ($('uuid-count')) { $('uuid-generate').onclick = generateUuid; bindCopy('uuid-copy','uuid-output','uuid-message'); generateUuid(); }
  if ($('base64-input')) { $('base64-encode').onclick = encodeBase64; $('base64-decode').onclick = decodeBase64; bindCopy('base64-copy','base64-output','base64-message'); }
});
