#!/bin/bash

npm run database:migrate:up
npm run database:seed:up

npm start
