FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 5173

# Eğer static olarak serve edeceksen:
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "5173"]
