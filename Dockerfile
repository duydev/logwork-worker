FROM node:8.16-alpine

# Install base packages
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && update-ca-certificates

# Change TimeZone
RUN apk add --update tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Clean APK cache
RUN rm -rf /var/cache/apk/*

RUN mkdir /root/source

ADD . /root/source

WORKDIR /root/source 

RUN yarn 

CMD [ "yarn", "start" ]

