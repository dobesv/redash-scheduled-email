'use strict';

module.exports.sendReportByEmail = async (event, context, callback) => {
    const fetch = require('node-fetch');
    const csv = await (await fetch(process.env.CSV_URL)).text();
    console.log({csv});
    const lines = csv.trim().split('\n').map(line => line.split(/ *, */));
    const headers = lines[0];
    const rows = lines.slice(1);
    const totals = rows.reduce((r1, r2) => r1.map((v, n) => n === 0 ? 'Total' : (Number(v) + Number(r2[n]))));
    const html = `
<html>
<body>
<table colspacing=0 colpadding=0>
  <thead>
    <tr>
      ${headers.map(h => `<th style="text-align: right; padding: 4px;">${h}</th>`).join('\n    ')}
    </tr>
  </thead>
  <tbody>
      ${rows.map(
        (row, n) => `<tr>\n${row.map(
            (v, i) => `<td 
  style="text-align: right; padding: 2px; background-color:${n & 1 ? '#f2f2f2' : 'white'}"
>${headers[i].includes('%') ? `${Number(v).toFixed(1)}%` : v}</td>`).join('\n')}</tr>`).join('\n')}
</tbody>
<tfoot>
  <tr>
${totals.map((v, i) => `<td 
  style="text-align: right; padding: 4px 2px; font-weight:bold">
${headers[i].includes('%') ? `${(v / rows.length).toFixed(1)}%` : v}</td>`).join('\n')}
</tr>
</tfoot>
</table>
</body>
</html>
`;

    const mandrill_response = await (await
            fetch(
                'https://mandrillapp.com/api/1.0/messages/send.json',
                {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        key: process.env.MANDRILL_API_KEY,
                        message: {
                            html: html,
                            subject: process.env.EMAIL_SUBJECT,
                            from_email: process.env.EMAIL_FROM_EMAIL,
                            from_name: process.env.EMAIL_FROM_NAME,
                            to: process.env.EMAIL_RECIPIENTS.split(/ *, */).filter(Boolean).map(email => ({
                                email, type: 'to'
                            })),
                        }
                    })
                }
            )
    ).json();

    const response = {
        mandrill_response
    };

    callback(null, response);
};
