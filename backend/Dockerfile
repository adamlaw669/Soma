FROM python:3.10-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    git \
    libgomp1 \
    libssl-dev \
    libffi-dev \
    python3-dev \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app


COPY requirements.txt .


RUN pip install --upgrade pip setuptools wheel


RUN pip install --no-cache-dir --prefer-binary -r requirements.txt

COPY . .


EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
