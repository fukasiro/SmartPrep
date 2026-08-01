FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/backend

WORKDIR /app/backend

# backend フォルダ直下のファイルをそのまま指定
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# カレントディレクトリのファイルをコピー
COPY . ./

# ポート設定
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]