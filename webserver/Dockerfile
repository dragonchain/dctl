FROM python:3.8-alpine as base

WORKDIR /usr/src/core

FROM base AS builder
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt

FROM base AS release
# Copy the installed python dependencies from the builder
COPY --from=builder /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
# Copy our actual application
COPY --chown=1000:1000 . .

CMD [ "python","-m", "webserver.dragonchain.start" ]
