# S3 Folder Uploader

A TypeScript utility for uploading folders and their contents to Amazon S3.

## Features

- Recursively uploads all files from a folder to S3
- Maintains folder structure in S3
- Shows upload progress
- Detailed error reporting
- TypeScript support with type safety

## Prerequisites

- Node.js (v14 or higher)
- AWS credentials configured (via environment variables or AWS credentials file)
- TypeScript installed globally (optional)

## Environment Configuration

Create a `.env` file in the `deploy` directory with the following variables:

```bash
aws_access_key_id=your_access_key_id
aws_secret_access_key=your_secret_access_key
bucket_name=your_bucket_name
```

Replace the values with your actual AWS credentials and bucket name. Make sure to:

- Keep your `.env` file secure and never commit it to version control
- Use valid AWS credentials with appropriate S3 permissions
- Use a valid S3 bucket name that you have access to

## Installation

1. Navigate to the deploy folder:

```bash
cd deploy
```

2. Install dependencies:

```bash
npm install
```

3. Build the TypeScript code:

```bash
pnpm run build
```

## Usage

Run the script with the following arguments:

```bash
pnpm start /path/to/your/folder your-bucket-name [optional-prefix]
```

Example:

```bash
pnpm start ../out my-bucket-name
```

### Arguments:

- `folder_path`: Path to the local folder you want to upload
- `bucket_name`: Name of the S3 bucket to upload to
- `prefix` (optional): Prefix for the S3 path (default: '')

## AWS Credentials

Make sure you have your AWS credentials configured in one of these ways:

1. Environment variables:

   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_REGION=ap-southeast-1
   ```

2. AWS credentials file (`~/.aws/credentials`):

   ```
   [default]
   aws_access_key_id = your_access_key
   aws_secret_access_key = your_secret_key
   region = ap-southeast-1
   ```

3. IAM role (if running on AWS infrastructure)

## Output

The script will show:

- Upload progress with percentage and file count
- Success/failure status
- Detailed error messages if any files fail to upload
- Summary of uploaded files

## Error Handling

The script handles various error cases:

- Invalid folder paths
- Missing AWS credentials
- Network issues
- Permission problems
- Invalid bucket names

All errors are logged with detailed information about the failed operation.
