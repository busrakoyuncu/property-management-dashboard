FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma Client
RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
