FROM node:21-alpine3.17

EXPOSE 3000

COPY db.json /opt/db.json

# Pin the json-server version: "yarn global add json-server" without a
# version previously pulled whatever was newest, which can silently change
# the CLI's flags between major versions.
RUN yarn global add json-server@0.17.4

# NOTE: json-server's HOST flag is "-H" (uppercase), not "-h" ("-h" is
# --help). With the old lowercase flag the process just printed the help
# text and exited immediately, so the API never actually started.
CMD ["json-server", "-H", "0.0.0.0", "-p", "3000", "/opt/db.json"]
