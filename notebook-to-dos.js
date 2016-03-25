define(['base/js/namespace','jquery'], function(Jupyter, $) {
    function does_to_dos_cell_exist() {
        var notebook_cells = Jupyter.notebook.get_cells();
        for (var i = 0; i < notebook_cells.length; i++) {
            var cell = notebook_cells[i];
            if (cell.metadata.id == 'to_dos_cell') {
                return cell;
            }
        }
        return false;
    }

    function place_to_dos_cell() {
        var to_dos_cell = Jupyter.notebook.insert_cell_at_index('markdown', 0);
        var cell_text = '# To Dos\n';
        cell_text += '<button class="to-dos-add-task">Add Task</button>';
        cell_text += '<button class="to-dos-complete-task">Complete Task</button>';
        cell_text += '<br><br>';
        to_dos_cell.set_text(cell_text);
        to_dos_cell.render();
        to_dos_cell.metadata.id = 'to_dos_cell';
        return to_dos_cell;
    }

    function get_to_dos_cell() {
        var existing_cell = does_to_dos_cell_exist();
        if (existing_cell) {
            var to_dos_cell = existing_cell;
        } else {
            var to_dos_cell = place_to_dos_cell();
        }
        return to_dos_cell;
    }

    function load_to_dos_cell_events() {
        var to_dos_cell = get_to_dos_cell();
        console.log(to_dos_cell.element);
        console.log(to_dos_cell.element.find("button.to-dos-add-task"));
        
        to_dos_cell.element.find("button.to-dos-add-task").bind('click', function() {
            var current_content = to_dos_cell.get_text();
            current_content += "<input type='checkbox' class='to-do-item-check'></input>";
            current_content += "<input type='text' class='to-do-item'></input><br>";
            to_dos_cell.set_text(current_content);
            to_dos_cell.render();
        });

        to_dos_cell.element.find("input.to-do-item").bind('focusin', function() {
            Jupyter.notebook.keyboard_manager.disable();
        });
        to_dos_cell.element.find("input.to-do-item").bind('focusout', function() {
            Jupyter.notebook.keyboard_manager.enable();
        });
    }

    function place_to_dos_button() {
        if (!Jupyter.toolbar) {
            $([Jupyter.events]).on("app_initialized.NotebookApp", place_to_dos_button);
        }

        if ($("#create-to-dos-button").length == 0) {
            Jupyter.toolbar.add_buttons_group([
                {
                    'label': 'Add To-do List Cell',
                    'icon': 'fa-list',
                    'callback': load_to_dos_cell_events,
                    'id': 'create-to-dos-button',
                }
            ]);
        }

        load_to_dos_cell_events();
    }

    function load_ipython_extension() {
        console.log('Loading notebook-to-dos extension');
        place_to_dos_button();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
