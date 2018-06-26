# Redash report emailer

This was created to send a redash report on a weekly basis.

## Setup

Make sure you have serverless installed, instructions here:

https://serverless.com/framework/docs/getting-started/

Create env.yaml following this template:

      # e.g. https://redash.vaultdrop.com/api/queries/<number>/results.csv?api_key=<api_key>
      CSV_URL: ....
      # API key from Mandrill dashboard
      MANDRILL_API_KEY: ...
      # Comma-seperated list of email addresses
      EMAIL_RECIPIENTS: ...
      # Sender name
      EMAIL_FROM_NAME: ...
      # Sender email
      EMAIL_FROM_EMAIL: ...
      # Subject
      EMAIL_SUBJECT: ...

To test your settings, run

    serverless invoke local -f sendReportByEmail

If you're happy with the email, deploy it:

    serverless deploy

And test the deployed version:

    serverless invoice -f sendReportByEmail

## Multiple reports

You can copy the `sendReportByEmail` function multiple times with different
values / filenames if you need multiple emails to run with different
reports or on different schedules.
