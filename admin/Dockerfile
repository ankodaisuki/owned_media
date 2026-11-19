FROM node:22.23.5-alpine

WORKDIR /app
COPY package.json package-lock.json ./
# package-lock.json どおりのバージョンで入れる（composer install と同じ考え方）
RUN npm ci
COPY . ./

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
