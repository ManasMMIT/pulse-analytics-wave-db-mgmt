#!/bin/bash

set -e

echo "Setting AWS Access Key ID"
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID

echo "Setting AWS Secret Access Key"
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY

echo "Pulling .env file"
aws s3 cp $S3_BUCKET_URL /home/deploy/