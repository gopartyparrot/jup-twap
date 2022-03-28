FROM node:16 as ts-compiler

WORKDIR /usr/app
COPY package*.json ./
COPY yarn*.lock ./
COPY tsconfig*.json ./
RUN yarn
COPY . ./
RUN yarn build


FROM gcr.io/distroless/nodejs:16
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app ./
USER 1000
CMD [ "lib/index.js" ]