# FundSpirit

The project serves as a backend for the FundSpirit Crowdfunding Platform

## Manual Installation

Clone the repo:

```bash
git clone https://github.com/AimenEllahi/fundspirit-auth
cd fundspirit-auth
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env
# open .env and modify the environment variables
```



## Commands

Running in development:

```bash
npm start
# or
npm run dev
```

Running in production:

```bash
# build
npm run build
# start
npm run prod
```

## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash
CONNECTION_URL =
jwtPrivateKey = 
S3_BUCKET_NAME = 
S3_BUCKET_REGION =
AWS_ACCESS_KEY_ID =
AWS_SECRET_ACCESS_KEY  = 
GORELI_RPC_URL = 
HH_PRIVATE_KEY =
```


## License

[MIT](LICENSE)
