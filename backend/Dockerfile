FROM python:3.11.9-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

# Instala pip y herramientas de construcción
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copia solo pyproject.toml y requirements primero para cache
COPY pyproject.toml ./

# Instala dependencias
RUN pip install --no-cache-dir -e .

# Copia el resto del proyecto
COPY . .

EXPOSE 8000
RUN pip install uv
RUN uv sync
CMD ["uv","run","main.py"]
