The source code of https://johnbraun.blog.

## JohnBraun's weblog
JohnBraun.blog is built using Pelican.

#### Contributing
If you'd like to contribute, clone the default branch of this repo.
Then, install the required dependencies within a virtual environment:
1. `python3 -m venv venv`
1. `source venv/bin/activate`
1. `pip install -r requirements.txt`

Run a dev server: `make devserver`, which spins up a local webserver and hot reloads on made changes.
To compile the website run `make html`, which can be served through `make serve`.

Run `make clean` to delete temporary generated files, like `output/`.
