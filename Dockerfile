###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --omit=optional

COPY --chown=node:node . .

RUN npm run prisma:generate

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm install --omit=dev

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
