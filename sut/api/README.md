# About this repository
This repository contains a basic json-server (https://github.com/typicode/json-server) based on the db.json file. The server can be runned in a docker container. The server provides two endpoints. The first endpoint returns a GeoJSON FeatureCollection with roads. The second endpoint returns a JSON array with todos. The server is reachable under http://localhost:3000.

## Requirements
- Docker

## How to run
1. Clone/Unzip this repository
2. Run `docker build -t edgital-json-server -f Dockerfile .` in the root directory to create a Docker image called edgital-json-server
3. Run `docker container run -d -p 3000:3000 edgital-json-server` in the root directory to start the container and expose the port 3000

Hint: Using the `-d` flag runs the container in the background. If you want to run the container in the foreground, you can omit the `-d` flag.	If you have already a container running on port 3000, you can change the port mapping to e.g. `-p 3001:3000`. Make sure to change the port in the Dockerfile as well.

## Endpoints
Server is reachable under http://localhost:3000

- GET /roads - returns a GeoJSON FeatureCollection with roads and their evaluations
- GET /todos - returns a JSON array with todos
- POST /todos - adds a todo to the database

Hint: Check https://github.com/typicode/json-server for more information about the json-server and its endpoints (e.g. filtering, sorting, ...)

### API rules
json-server is started as a module (`server.js`, `npm start`) with a few rules on top:
- `POST /todos` requires `title` (non-empty string) and `road_fid` (integer), otherwise `400`; a `road_fid` without a matching road returns `422`; an `id` that is already taken returns `409`
- `PUT /todos/:id` applies the same rules to the replacing body; `PATCH /todos/:id` checks `title` and `road_fid` only if it sends them. A todo that does not exist still returns `404`
- Write requests (`POST`/`PUT`/`PATCH`) must send `Content-Type: application/json`, otherwise `415`
- Errors (e.g. a malformed JSON body) are returned as JSON: `{ "error": "..." }`
- `/roads` is read-only: `POST`/`PUT`/`PATCH` return `405`
- CORS is only granted to the web app origins (env `CORS_ORIGINS`, default `http://localhost:5173,http://127.0.0.1:5173`)

# Your task
1. Create a react app with a map component (e.g. leaflet)
2. Fetch the GeoJSON FeatureCollection from the server and display it on the map
3. Color the roads according to their eemi grades (1-1.49 = blue, 1.5-2.49 = light-green, 2.5-3.49 = dark-green, 3.5-4.49 = yellow, 4.5-5.00 = red; as different grades exist, add a dropdown to the map that allows to select the evaluation to be displayed e.g. GW, TWRIO, RISS, ...).
4. Add a legend to the map
5. Create hover effects for the roads (e.g. highlight the road and show attributes and coarse grained evaluations in a tooltip)
6. Create a sidebar with a table and diagrams that shows average statistics over all roads (e.g. average GW) - Find other interesting statistics and display them in useful diagrams and tables
7. Add functionality to add TODOs (title, description, status, author, road_fid) to the roads (e.g. on road click open a modal with a form to add a new TODO, update existing TODO) - The TODOs should be saved in the json-server database using the POST /todos endpoint
8. Add a navigation bar with links to the different pages (e.g. map, roads overview table (showing only the attributes), evaluations overview table, todos overview table)
9. Design the app with a CSS framework (e.g. bootstrap) and style it nicely using color palettes and icons
10. Containerize the app and add a README.md with instructions on how to run the app

Note: In case you feel unsure about the requirements, feel free to make assumptions and document them in the README.md!

