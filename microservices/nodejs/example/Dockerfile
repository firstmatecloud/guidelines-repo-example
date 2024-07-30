FROM node:20-alpine
ENV PORT 8080
EXPOSE 8080
WORKDIR /usr/src/app
RUN apk add --no-cache git
COPY . .
CMD ["npm", "start", "--no-update-notifier"]