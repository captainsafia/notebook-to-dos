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
        cell_text += '<br>';
        cell_text += '<div class="input-group">';
        cell_text += '<input type="text" class="to-dos-new-task form-control"></input>';
        cell_text += '<span class="input-group-btn">';
        cell_text += '<button class="to-dos-add-task btn btn-primary">Add Task</button>';
        cell_text += '</span>';
        cell_text += '</div>';
        cell_text += '<div class="existing-to-dos"></div>';
        to_dos_cell.set_text(cell_text);
        to_dos_cell.render();
        to_dos_cell.metadata.id = 'to_dos_cell';
        to_dos_cell.metadata.tasks = [];
        load_to_dos_cell_events();
        return to_dos_cell;
    }

    function get_to_dos_cell() {
        var existing_cell = does_to_dos_cell_exist();
        if (existing_cell) {
            var to_dos_cell = existing_cell;
        } else {
            var to_dos_cell = place_to_dos_cell();
        }
        render_tasks(to_dos_cell);
        return to_dos_cell;
    }

    function render_tasks(to_dos_cell) {
        var tasks = to_dos_cell.metadata.tasks;
        var num_tasks = tasks.length;
        for (var i = 0; i < num_tasks; i++) {
            render_task(to_dos_cell, tasks[i], i);
        }
    }

    function render_task(to_dos_cell, task, id) {
        if (task.status == 'open') {
            var to_dos_list = to_dos_cell.element.find('div.existing-to-dos');
            var task_content = '<div class="input-group">';
            task_content += '<span class="input-group-addon">';
            task_content += '<input type="checkbox" class="to-dos-complete" id="' + id +'"/>';
            task_content += '</span>';
            task_content += '<input type="text" readonly="readonly"';
            task_content += 'class="form-control"';
            task_content += 'placeholder="' + task.task + '">';
            task_content += '</div>';
            to_dos_list.append(task_content);
        }
    }

    function load_to_dos_cell_events() {
        console.log('Loading notebook-to-dos events...');
        var to_dos_cell = get_to_dos_cell();

        var task_input = $(to_dos_cell.element.find('input.to-dos-new-task'));
        Jupyter.keyboard_manager.register_events(task_input);

        to_dos_cell.element.find("button.to-dos-add-task").bind('click', function() {
            var task = {
                'task': $(this).parent().prev().val(),
                'status': 'open'
            };
            to_dos_cell.metadata.tasks.push(task);
            render_task(to_dos_cell, task, to_dos_cell.metadata.tasks.length);
        });

        to_dos_cell.element.on('click', 'input.to-dos-complete', function() {
            if (this.checked) {
                var id = parseInt($(this).attr('id')) - 1;
                to_dos_cell.metadata.tasks[id].status = 'complete';
                $(this).closest('.input-group').remove();
            }
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
                    'callback': place_to_dos_cell,
                    'id': 'create-to-dos-button',
                }
            ]);
        }

        load_to_dos_cell_events();
    }

    function load_css() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = './notebook-to-dos.css';
        $("head").append(link);
    }

    function load_ipython_extension() {
        console.log('Loading notebook-to-dos extension');
        load_css();
        place_to_dos_button();
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
