## Need to run this so that servlerless framework can programmatically manage you AWS account
## Uncomment the relevant command and execute this shell script e.g. './scripts/export-AWS-credentials.sh'

## via environment variables

#export AWS_ACCESS_KEY_ID=<your-key-here>
#export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>

## or via serverless config (adds credentials under AWS 'default' profile in ~/.aws/credentials)

#serverless config credentials --provider aws --key <your-key-here> --secret <your-secret-key-here>
