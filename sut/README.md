## About The Project

The application gives an overview of road conditions using GeoJSON data.

Features in the application:

- Road is colored based on eemi grades (1-1.49 = blue, 1.5-2.49 = light-green, 2.5-3.49 = dark-green, 3.5-4.49 = yellow, 4.5-5.00 = red)
- Options can be chosen in a dropdown to choose different evaluations and changes are reflected in the map
- Legend information is provided to have a quick overview of different grades on the road
- Hovering on the road gives an overview of the road conditions
- Road sections can be clicked to add details such as title, description, status and author
- Attributes comparison can be seen as a bar graph on the landing page
- Navbar provides access to different sections such as overview, statistics and todos
- Overview section gives a tabular overview of the road information and can be navigated via pagination for clean access to the large data source
- Statistic section extends the graphical overview on the landing page with a tabular representation of different metrics of the data such as min, max and total of different attributes
- Todos section gives an overview of the saved road information which can be deleted or edited as needed

### Built With

- [![React][React.js]][React-url]
- [![Leaflet][Leaflet.js]][Leaflet-url]
- Tailwind

## Getting Started

### Option A: Docker (recommended)

**Prerequisites:** Docker Desktop (or Docker Engine + Compose)

1. Clone or unzip this repository
2. From the repository root, run:
   ```
   docker compose up --build
   ```
3. Open the app: **http://localhost:5173/**
   The API is reachable directly under http://localhost:3000/

Stop the stack with `Ctrl+C`, or `docker compose down` if you started it detached (`docker compose up --build -d`).

### Option B: Without Docker (Node.js)

**Prerequisites:** Node.js 18+ and npm

1. Start the API first (in one terminal):
   ```
   cd api
   npm ci
   npm start
   ```
   API is now reachable under http://localhost:3000/
2. In a second terminal, start the frontend:
   ```
   cd edgital_road_overview
   npm install
   npm run dev
   ```
3. Open the app: **http://localhost:5173/** (Vite will print the exact URL/port in the terminal - it auto-increments if 5173 is already taken)

### Troubleshooting

- **Port already in use:** stop whatever is already listening on 3000/5173, or change the port mapping in `docker-compose.yaml` (and the corresponding Dockerfile `EXPOSE`/`CMD` port).
- **Map appears empty/grey:** the map tiles are loaded live from OpenStreetMap - this requires outbound internet access from the browser.
- **Data not showing up:** make sure the API container/process is running and reachable under http://localhost:3000/roads before loading the frontend.

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Leaflet.js]: https://img.shields.io/badge/Leaflet-fbfbfb?style=for-the-badge&logo=leaflet&logoColor=b8e365
[Leaflet-url]: https://leafletjs.com/
