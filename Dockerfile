FROM node:10

MAINTAINER Trocafone Suricata TEAM "tech-suricata@trocafone.com"

ARG FURY_PUSH_TOKEN=token
ARG TROCA_APP_NAME=troca-validator
ARG TROCA_APP_PATH=/opt/${TROCA_APP_NAME}

ENV TROCA_APP_NAME=${TROCA_APP_NAME}
ENV TROCA_APP_PATH=${TROCA_APP_NAME}
ENV FURY_PUSH_TOKEN=${FURY_PUSH_TOKEN}

COPY . ${TROCA_APP_PATH}

WORKDIR ${TROCA_APP_PATH}

RUN npm install npm@latest -g && yarn install

ENTRYPOINT ["./entrypoint.sh"]
