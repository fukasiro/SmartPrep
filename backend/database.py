import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - optional dependency fallback
    def load_dotenv() -> bool:
        return False


load_dotenv()


def _read_database_url() -> str:
    env_url = os.getenv("DATABASE_URL", "").strip()
    if env_url:
        return env_url

    backend = os.getenv("DB_BACKEND", "sqlite").lower()
    if backend == "sqlite":
        db_path = os.getenv("DB_PATH", "test.db")
        if not os.path.isabs(db_path):
            db_path = str((Path(__file__).resolve().parent / db_path).resolve())
        return f"sqlite:///{db_path}"

    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "smartprep")
    user = os.getenv("DB_USER", "smartprep")
    password = os.getenv("DB_PASSWORD", "")

    return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}"


def build_engine():
    database_url = _read_database_url()
    engine_kwargs = {"pool_pre_ping": True}

    if database_url.startswith("sqlite"):
        engine_kwargs["connect_args"] = {"check_same_thread": False}

    return create_engine(database_url, **engine_kwargs)


SQLALCHEMY_DATABASE_URL = _read_database_url()
engine = build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
