# Koa API

## Flexible Koa API

### Development

```bash
git clone git@github.com:xskytech/koa-api.git
cd koa-api
```

### Installation

**npm version >= 5.2.0**

```bash
npx @xskytech/create-koa-api koa-api
```

**npm version < 5.2.0**

```bash
npm install --global @xskytech/create-koa-api
@xskytech/create-koa-api koa-api
```

### Configuration

**Change directory**

```bash
cd koa-api
```

**Copy .env.example to .env and change data**

```bash
cp .env.example .env
```

### Linting

**Check lint issues**

```bash
npm run lint
```

**Fix lint issues**

```bash
npm run lint:fix
```

### Validate

**Validate application**

```bash
npm run validate
```

### Migrate

**Create DB**

```bash
npm run database:create
```

**Run migrations**

```bash
npm run database:migrate:up
```

**Undo migrations**

```bash
npm run database:migrate:down
```

**Run seeds**

```bash
npm run database:seed:up
```

**Undo seeds**

```bash
npm run database:seed:down
```

**Drop DB**

```bash
npm run database:drop
```

### Run

**Run in development**

```bash
npm run develop
```

**Run in production**

```bash
npm start
```

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
