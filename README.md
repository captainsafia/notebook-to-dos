# notebook-to-dos
notebook-to-dos is a Jupyter Notebook extension for adding a to-do list to the
Notebook. The to-do list is saved along with the Notebook so you can interact with
it after saving and will be rendered appropriately in the notebook if the Notebook
is shared.

### Installation Instructions
1. Run `jupyter --config-dir` to determine the location of your Jupyter Notebook configuration
2. Download `notebook-to-dos.js` and copy it to `$(jupyter --config-dir)/nbextensions`.
3. Run `jupyter nbextension enable notebook-to-dos`.

### Usage Screencast
![Usage Screencast](notebook-to-dos-screencast.gif)
