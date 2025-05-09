# Setup

Our project has multiple services and applications running. To setup everything correctly please follow the instructions below in the following order:
1. Supabase Setup
2. Running the Applications

# Supabase Setup
We use supabase for our authentication and postgres database service. You will need Docker installed to run Supabase locally. Checkout the [MacOS](https://docs.docker.com/desktop/setup/install/mac-install/) or [Windows](https://docs.docker.com/desktop/setup/install/windows-install/) to install on either OS.

After Docker is installed, start the docker engine.

> **_IMPORTANT:_** All supabase commands should be run in `/bank`.

Check your `package.json` file to see you installed `supabase` as a dependency.
If not installed, install it with:
```bash
npm install supabase
```

Init supabase locally:
```bash
npx supabase init
```
This command will create a `supabase/` directory. This is where your local supabase configurations will be stored.

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

In the root of `/bank`, create a `.env` following the `.env.example` file. From the provided credentials, the `API URL` will be the `NEXT_PUBLIC_SUPABASE_URL` and `anon key` will be the 
`NEXT_PUBLIC_SUPABASE_ANON_KEY` variables.

Once everything is running successfully, you can go to [http://localhost:54323/](http://localhost:54323/) to see the Supabase dashboard.

To stop the supabase containers, run:
```bash
npx supabase stop
```

### Supabase Failure/Unhealthy containers
If you encounter a failure or unhealthy container, we recommend that you stop the containers, delete all the volumes and images associated with supabase, and then start the containers again.

If the above solution does not work, then you can try starting the containers with the `--ignore-health-check` option.
```
npx supabase start --ignore-health-check
```
This will start the containers, but it will not check the health of the containers. We recommend this solution as a last resort, because it does not guarantee that the supabase setup was successful.

## Create Database Tables and Insert Data

Supabase runs any migration files that are found in the `supabase/migrations/` directory. Additionally, if you want to seed the database with data, then you can create a `seed.sql` file in the `supabase/` directory. Supabase will only execute these files if the container volume is empty. If not, then it will use the data in the existing volume. In the case where a volume exists and a change has been made to the migration files, you can use `npx supabase db reset` to reset the entire database with the new changes.

Unfortunately, we don't push our `supabase/` directory to github, so we will place all our `.sql` scripts in the `sql/` directory. This means that you will have to copy the `.sql` files into `supabase/`. We have two files: `sql/01_createdb.sql` and `sql/seed.sql`. `sql/01_createdb.sql` must be placed in `supabase/migrations/` and `sql/seed.sql` must be placed in `supabase/`.

I have found two ways of moving the `.sql` files into `supabase/`:

1. Copy the `.sql` files from `sql/` into `supabase/`. This requires that you manually copy the file every time there is an update to the `.sql` files.
2. Create a symbolic link in `supabase/` that points to the files in `sql/`. Symbolic links are just pointers to other files, so if the other files update, then the symbolic link will reflect that update. I prefer this method.

First, make sure to create a `supabase/migrations/` directory.

### Moving files - symbolic link
To create a symbolic link make sure that you are in the root directory of `/bank`. Then, run the following command on MacOS:
```
ln -s ../../sql/01_createdb.sql supabase/migrations/01_createdb.sql
ln -s ../sql/seed.sql supabase/seed.sql
```

If you have Windows, then you will have to search for how to create symbolic links.

### Moving files - copy
You can use the `cp` command to copy the files on MacOS. Assuming you are in the root directory of `/bank`, run the following command:
```
cp sql/01_createdb.sql supabase/migrations/01_createdb.sql
cp sql/seed.sql supabase/seed.sql
```

If you have Windows, then you will have to search for how to use copy.

### seed.sql vs migration files
The `seed.sql` shoud NOT be placed in `supabase/migrations/`, instead it should be placed in `supabase/`. The rest of the files in `sql/` should be put in `supabase/migrations`.

### Final directory structure
If you did everything correctly, then you should have a similar directory structure to the following:
```
bank/supabase/
├── ...
├── migrations
│   └── 01_createdb.sql
└── seed.sql
```

# Running the Applications

Before running the applications, ensure that your supabase is running. We don't use docker containers to run the applications, so ignore the `docker-compose.yml` file.

Install dependencies for both applications:

```bash
cd bank
npm install

cd atm
npm install
```

Run the bank development server:
```bash
cd bank
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run the atm development server:
```bash
cd atm
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## [DEVELOPERS ONLY] API Responses
API responses should follow a standard so that it's reusable. Furthermore, make sure that each route handler has proper response status codes.

For 2xx responses, the response body should be:
```
{ data: ... }
```
If you are returning a `204` response status code you should use:
```
return new Response(null, { status: 204 });
```

For 4xx or 5xx responses, the response body should be:
```
{ error: ... }
```
