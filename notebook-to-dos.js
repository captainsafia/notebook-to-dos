define(['base/js/namespace'], function(Jupyter) {
    function place_to_dos_cell() {
        var to_dos_cell = Jupyter.notebook.insert_cell_at_index('markdown', 0);
    }

    function place_to_dos_button() {
        if (!Jupyter.toolbar) {
            $([Jupyter.events]).on("app_initialized.NotebookApp", place_to_dos_button);
        }

        if ($("#create-to-dos-button").length == 0) {
            Jupyter.toolbar.add_buttons_group([
                'label': 'Add To-do List Cell',
                'icon': 'check-square-o',
                'callback': place_to_dos_cell,
                'id': 'create-to-dos-button'
            ]);
        }
    }

    function load_ipython_extension() {
        console.lob('Loading notebook-to-dos extension');
        place_to_dos_button();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
