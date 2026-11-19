# オウンドメディア

読者向けサイト・管理画面・バックエンド API の 3 つを、Docker Compose で 1 コマンドで起動する開発環境です。

| サービス名 | 役割 | 技術 | URL |
|---|---|---|---|
| `web` | 読者向けサイト（ログインなし） | Next.js + TypeScript | <http://localhost:3000> |
| `admin` | 管理画面（今は空のページだけ） | Next.js + TypeScript | <http://localhost:3001> |
| `api` | バックエンド API | FastAPI（Python） | <http://localhost:8000> |

DB とデプロイ先はまだ決まっていません。今は DB なしで動きます。

## 必要なもの

- Git
- Docker Desktop（`docker compose` コマンドが使える状態）

Node.js と Python は Docker の中で動くので、Mac に直接インストールしなくても起動できます。

## 起動方法

### 1. リポジトリをクローン

```bash
git clone https://github.com/ankodaisuki/owned_media.git
cd owned_media
```

### 2. Docker Compose で起動

リポジトリのルート（`compose.yaml` がある場所）で実行します。

```bash
docker compose up --build
```

初回はイメージの取得とパッケージのインストールがあるため、数分かかります。ログが出続けるので、このターミナルは開いたままにしてください。

別のターミナルで、同じ場所から状態を確認します。

```bash
docker compose ps
```

`SERVICE` 列に `web`・`admin`・`api` の 3 行があり、`STATUS` がすべて `Up` なら起動しています。

### 3. ブラウザで確認

| URL | 表示されれば OK |
|---|---|
| <http://localhost:3000> | 「オウンドメディア（読者向け）」と `{"status":"ok"}` |
| <http://localhost:3001> | 「管理画面（準備中）」 |
| <http://localhost:8000/health> | `{"status":"ok"}` |
| <http://localhost:8000/docs> | FastAPI の API ドキュメント（Swagger UI） |

<http://localhost:3000> に「backend（FastAPI）に接続できませんでした。」と出る場合は、`api` が起動しているかを `docker compose ps` とログで確認してください。

## 停止方法

起動中のターミナルで `Ctrl+C` を押します。コンテナを削除するときは次を実行します。

```bash
docker compose down
```

## 開発中の注意

- `frontend/`・`admin/`・`backend/` のコードは、保存すると自動で反映されます（再起動は不要です）。
- `package.json` や `requirements.txt` を変えたときは、イメージを作り直してください。`-V` を付けると、古い `node_modules` が残りません。

```bash
docker compose up --build -V
```

## ディレクトリ構成

```text
.
├── compose.yaml          # 3 つのコンテナをまとめて起動する設定
├── .env.example          # 環境変数の見本（.env 本体はコミットしない）
├── .gitignore
├── .nvmrc                # Node.js のバージョン（22.23.5）
├── .python-version       # Python のバージョン（3.12.14）
├── frontend/             # 読者向けサイト（Next.js）
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json # 依存パッケージのバージョンを固定
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── app/
│       ├── layout.tsx
│       └── page.tsx      # backend の /health を呼んで結果を表示
├── admin/                # 管理画面（Next.js）。構成は frontend と同じ
│   └── app/page.tsx      # 「管理画面（準備中）」だけ
└── backend/              # バックエンド API（FastAPI）
    ├── Dockerfile
    ├── requirements.txt  # バージョンを == で固定
    └── main.py           # GET /health だけ（記事 API はまだ作らない）
```

## 接続の流れ

1. `compose.yaml` が `api`・`web`・`admin` の 3 つのコンテナを起動します。
2. `web` は、サーバー側で `API_BASE_URL=http://api:8000` の `/health` を呼び、結果を表示します。
3. `api` は、Docker Compose の中で FastAPI コンテナを指す名前です。Mac のブラウザからは `localhost` でアクセスします。

## バージョン固定とパッケージ（セキュリティ方針）

| 種類 | 固定しているバージョン | 書いている場所 |
|---|---|---|
| Node.js | 22.23.5 | `.nvmrc`、`frontend/Dockerfile`、`admin/Dockerfile` |
| Python | 3.12.14 | `.python-version`、`backend/Dockerfile` |
| Next.js / React | 16.4.6 / 19.3.1 | `package.json` と `package-lock.json` |
| TypeScript | 5.9.3 | `package.json` と `package-lock.json` |
| FastAPI / Uvicorn | 0.165.0 / 0.54.0 | `backend/requirements.txt` |

入れているパッケージは最低限です。

- `next`・`react`・`react-dom`：Next.js アプリの本体
- `typescript`・`@types/*`：TypeScript の型チェック用
- `fastapi`：API の本体
- `uvicorn[standard]`：FastAPI を動かすサーバー（`--reload` による自動反映を含む）

## 秘密情報の扱い

- API キーやパスワードはリポジトリに入れません。
- 必要になったら `.env.example` に変数名だけを書き、値は各自の `.env`（`.gitignore` 済み）に書きます。
