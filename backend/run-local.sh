#!/bin/zsh
set -a
source .env
set +a
exec ./mvnw spring-boot:run
