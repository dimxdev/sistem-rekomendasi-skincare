FROM node:22-slim

# Prisma membutuhkan openssl pada image debian-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies (termasuk devDependencies karena tsx dipakai untuk seed)
COPY package*.json ./
RUN npm ci

# Generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Copy sisa source code
COPY . .

# Pastikan entrypoint pakai line ending LF & executable (aman dari Windows CRLF)
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
