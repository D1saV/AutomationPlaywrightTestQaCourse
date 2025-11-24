FROM mcr.microsoft.com/playwright:v1.50.0-noble

WORKDIR /DockerPlaywright

COPY package*.json ./
RUN npm ci
RUN npx playwright install --with-deps

COPY .env .env  
COPY . .

CMD ["npx", "playwright", "test", "--grep-invert=registration|garage"]
