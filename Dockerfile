
### STAGE 1:BUILD ###
FROM node:18.16.0 AS build

# Create a Virtual directory inside the docker image
WORKDIR /app
# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory
RUN npm cache clean --force

# Copy files from local machine to virtual directory in docker image
COPY . .

RUN rm package-lock.json

RUN npm install
RUN echo "END INSTALL"
RUN  npm run build:ci

### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:latest
#FROM nginxinc/nginx-unprivileged:stable-alpine

# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder 
COPY --from=build /app/dist/Drunk-mf /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/
#COPY --from=build /app/nginx/confDockerOpenshift.conf /etc/nginx/conf.d/

# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
# users are not allowed to listen on priviliged ports
RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

EXPOSE 8080

# # comment user directive as master process is run as user in OpenShift anyhow
RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

#RUN addgroup nginx root
#USER nginx

# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running

CMD ["nginx", "-g", "daemon off;"]