FROM mongo
LABEL author="matthew_j_bentley@hotmail.com"

ENV MONGO_INITDB_ROOT_USERNAME=admin \
    MONGO_INITDB_ROOT_PASSWORD=password \
    MONGO_INITDB_DATABASE=dev

# add init scripts
COPY /CQSGateway.Database/Scripts/ /docker-entrypoint-initdb.d/

EXPOSE 27107

# use entrypoint.sh from base image