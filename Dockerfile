FROM node:8.16-alpine

RUN mkdir /root/source

ADD . /root/source

WORKDIR /root/source 

RUN yarn 

CMD [ "yarn", "start" ]

