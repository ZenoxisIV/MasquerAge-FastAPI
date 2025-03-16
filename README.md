# This is a FastAPI-based backend designed to take advantage of the MOSIP ID Authentication SDK

## Requirements:
- `uv` as a Python package manager
- `keystore_sign.p12`, `keystore.p12`, `mosip_signed.pem`, and `ida_partner.pem` placed in a `env` folder under the project root
- `config.toml` properly configured, with path names set relative to the project root (or specifically, `auth.py`)

## To run:

In order to run this project, execute `uv sync`, then use `uv run fastapi dev ./main.py --port [PORT]` to run the webserver and export it to port `PORT`. 

You may refer to the endpoint `localhost:PORT/docs` for the API docs.