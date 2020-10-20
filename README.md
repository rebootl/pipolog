# pipolog

A simple logging aggregator. Server and Web-Interface (svelte).

- clients send data via agent/API (see [pipolog-agent](https://github.com/rebootl/pipolog-agent), separate repo.)
- mongodb instance for storage required

## Screenshots

![screenshot logging](screen-1a.png)
![screenshot dbstats](screen-2.png)

## Todo

- add license
- add info on dbstats collection (hourly)
- data preparation for dbstats graphs on client could be performance optimized
- test session expiry server-side

### Done

- deploy / test on server/production => DONE
- systemd service for agent => DONE (in agent)
- user auth. (Login/Logout etc.) => DONE
