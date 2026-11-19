import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Owned Media API")

# 読者向けサイトと管理画面の両方からのアクセスを許可する
origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """動作確認用のヘルスチェック（記事 API はまだ作らない）"""
    return {"status": "ok"}
