
# CDN Configuration Information and Copy Commands

## Configuratiom

Need to setup AWS S3 on your computer.

* [Installing, updating, and uninstalling the AWS CLI version 2](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

## Copy Command

To copy files to the disability CDN and clear the caches use the following commands:

```
aws s3 cp skipto.min.js s3://cdn.disability.illinois.edu/content/
aws cloudfront create-invalidation --distribution-id E2WVDTDW1T9JCL --paths "/*"
```
