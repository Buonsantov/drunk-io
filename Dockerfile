ARG NODE_IMAGE=node:18
ARG NGINX_IMAGE=nginx
### STAGE 1:BUILD ###
FROM $NODE_IMAGE AS build

# Create a Virtual directory inside the docker image
WORKDIR /app
# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory
RUN npm cache clean --force

# Copy files from local machine to virtual directory in docker image
COPY . .

RUN rm package-lock.json

# set registry Drunk
#ARG NPM_REGISTRY_URL
#ARG NPM_REGISTRY_PASSWORD
#RUN echo "REGISTRY URL:  $NPM_REGISTRY_URL"
#RUN npm config set registry $NPM_REGISTRY_URL
#RUN npm config set _auth=$NPM_REGISTRY_PASSWORD
#RUN npm config set always-auth=true

# chromium dependencies
ENV CHROME_BIN /usr/bin/chromium-browser
# chromium dependencies
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    dumb-init \
    udev \
    ttf-freefont \
    chromium \
    && npm install puppeteer-core \
      \
      # Cleanup
      && apk del --no-cache make gcc g++ python binutils-gold gnupg libstdc++ \
      && rm -rf /usr/include \
      && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
      && echo

# install && build && Test
RUN npm install
RUN echo "END INSTALL"
RUN npm run test:ci &&  npm run build:single-spa:ci

### STAGE 2:RUN ###
# Defining nginx image to be used
FROM $NGINX_IMAGE
#FROM nginxinc/nginx-unprivileged:stable-alpine

# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder 
COPY --from=build /app/dist/Drunk-mf /usr/share/nginx/html



# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
# users are not allowed to listen on priviliged ports
RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080

# # comment user directive as master process is run as user in OpenShift anyhow
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

RUN addgroup nginx root
USER nginx

# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running

CMD ["nginx", "-g", "daemon off;"]