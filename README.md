# Documentation on the project

## Prerequisites
- 📖 Install [Remix](https://remix.run/docs)
- Install [Docker](https://www.docker.com/)

## Development

### Create Database of choice

Type: PostgresSQL.

```sh
cd docker
docker compose up -d
```

After this commands, a database container will be created.
For any issue regarding this part, please follow the official document: [Docker Compose](https://docs.docker.com/compose/)

### Database migration
Assume we are in **/docker** folder. This will be optional:
```sh
cd ../blog
```

First, install packages from package.json:

```sh
yarn // I used yarn
```

Set this on **.env** file:
I will set this based on the information provided by the docker compose. We can change the information here according to your requirements.
```sh
DATABASE_URL="postgresql://postgres:postgres@localhost:5600/{test-remix}"
```

Run the migration with Prisma
```sh
npx prisma init
npx prisma migrate dev --name create-post-table
```

### Run application
First, install packages from package.json (assume we are in blog folder):

```sh
yarn // I used yarn
```

Then run the app:
```sh
yarn run dev
```

