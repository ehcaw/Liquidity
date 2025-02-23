## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Install Supabase
You will need Docker installed to run Supabase locally. Checkout the [MacOS](https://docs.docker.com/desktop/setup/install/mac-install/) or [Windows](https://docs.docker.com/desktop/setup/install/windows-install/) to install on either OS.

After Docker is installed, start the docker engine.

Check your `package.json` file to see you installed `supabase` as a dependency.
If not installed, install it with:
```bash
npm install supabase
```

Init supabase locally:
```bash
npx supabase init
```
This command will create a `supabase/` directory in the root of your project. This is where your local supabase configurations will be stored.

Then, run:
```bash
npx supabase start
```
This will create the supabase containers. Once all containers are running successfully, you will see the following output provided by supabase:
```
API URL: <API_URL>
GraphQL URL: <GRAPHQL_URL>
S3 Storage URL: <S3_URL>
DB URL: <DB_URL>
Studio URL: <STUDIO_URL>
Inbucket URL: <INBUCKET_URL>
JWT secret: <JWT_SECRET>
anon key: <ANON_KEY>
service_role key: <SERVICE_ROLE_KEY>
S3 Access Key: <S3_ACCESS_KEY>
S3 Secret Key: <S3_SECRET_KEY>
S3 Region: <S3_REGION>
```
These are you local supabase credentials.

In the root folder of the project, create a `.env` following the `.env.example` file. From the provided credentials, the `API URL` will be the `NEXT_PUBLIC_SUPABASE_URL` and `anon key` will be the 
`NEXT_PUBLIC_SUPABASE_ANON_KEY` variables.

If you go to [http://localhost:54323/](http://localhost:54323/), you will see the Supabase dashboard.

To stop the supabase containers, run:
```bash
npx supabase stop
```
