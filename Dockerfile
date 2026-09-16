FROM node:20-slim
WORKDIR /app

# Prisma's query engine needs OpenSSL at runtime. node:20-alpine (musl +
# OpenSSL 3.x by default) caused "libssl.so.1.1: No such file or
# directory" in production — switching to a Debian-based image (glibc)
# avoids that whole class of musl/OpenSSL-version mismatch, which is
# more reliable across hosts than pinning an Alpine OpenSSL package.
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "start"]
