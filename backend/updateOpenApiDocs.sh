#!/bin/bash

curl http://localhost:8080/v3/api-docs > ./openapidocs/api_specs_synergia_backend.json
prettier -w ./openapidocs/*.json