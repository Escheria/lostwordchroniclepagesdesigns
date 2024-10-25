$.extend($.fn.dataTable.ext.type.order, {
    "ranking-asc": function (a, b) {
        if (a < 0) return 1;
        if (b < 0) return -1;
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "ranking-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

$(document).ready(function () {
    const lwChroniclePage = "http://lostwordchronicle.com/attacks/";
    const initial_query = (new URLSearchParams()).get('q');
    let custom_sort = {type: '', value: ''};

    if(initial_query) {
        let query = atob(initial_query);
        let json = JSON.parse(query);
        for(let i of json.attack_filter) document.querySelector('.filter-by-attack[name="' + i + '"]').checked = true;
        for(let i of json.tao_filter) document.querySelector('.filter-by-tao[name="' + i + '"]').checked = true;
        for(let i of json.element_filter) document.querySelector('.filter-by-element[name="' + i + '"]').checked = true;
        for(let i of json.bullet_filter) document.querySelector('.filter-by-bullet[name="' + i + '"]').checked = true;
        $('#filter-by-killer').val(json.killer_filter.map(i => i.toString()));
        $('#filter-by-killer').trigger('change');
    }

    let attack_filter = [2, 3, 4];
    let killer_filter = [];
    let tao_filter = [];
    let element_filter = [];
    let bullet_filter = [];

    function buildQuery() {
        let filters = {
            attack_filter,
            tao_filter,
            element_filter,
            bullet_filter,
            killer_filter,
        }
        let query = JSON.stringify(filters);
        return btoa(query);
    }

    function updateFilters() {
        attack_filter = [...document.querySelectorAll('.filter-by-attack:checked')].map(e => parseInt(e.name));
        tao_filter = [...document.querySelectorAll('.filter-by-tao:checked')].map(e => parseInt(e.name));
        element_filter = [...document.querySelectorAll('.filter-by-element:checked')].map(e => parseInt(e.name));
        bullet_filter = [...document.querySelectorAll('.filter-by-bullet:checked')].map(e => parseInt(e.name));
        killer_filter = $('#filter-by-killer').select2('data').map(e => parseInt(e.element.value));
    }

    var table = $('table').DataTable({
        fixedHeader: true,
        //fixedColumns: { left: 3 },
        ajax: lwChroniclePage + "ajax?query=" + buildQuery(),
        type: "GET",
        order: initial_query ? [[7, 'desc']] : [[0, 'asc']],
        columns: [
            {
                data: 'index',
                title: '#',
                footer: '#'
            },
            {
                data: 'character',
                title: 'Character',
                render: function (data, type, row) {
                    if (type === 'sort' || type === 'type') {
                        return row.name;
                    }

                    if (type === 'display') {
                        let html = '';
                        html += '<a href="http://lostwordchronicle.com/characters/' + data + '" class="d-flex gap-2 align-items-center">';
                        html += '<img src="http://lostwordchronicle.com' + row.character_image + '" class="row-portrait"/>';
                        html += '<span>' + row.name + '</span></a>';
                        return html;
                    }

                    return data;
                },
            },
            {
                data: 'universe',
                title: 'Universe',
                visible: false,
            },
            {
                data: 'which_attack',
                title: 'Attack',
                render: function (data, type) {
                    if (type === 'sort') {
                        return data;
                    }

                    return ['Spr', 'Fcs', 'SC1', 'SC2', 'LW'][data];
                }
            },
            {
                data: 'target',
                title: 'Range',
                render: function (data, type) {
                    if (type === 'sort') {
                        return data;
                    }

                    return ['Solo', 'All'][data - 1];
                }
            },
            {
                data: 'scale',
                title: 'Power Scale',
                visible: false,
            },
            {
                data: 'timing_rank',
                title: 'Timing Rank',
                type: 'ranking',
                render: function (data, type, row) {
                    if (type === 'sort') {
                        if (!data || isNaN(data)) return -1;
                        return data;
                    }
                    if (type === 'display') {
                        if (!data || isNaN(data)) return 'N/A';
                        return row.duration.toString() + "s (" + data + ")";
                    }

                    return data;
                }
            },
            {
                data: 'filtered_relevance',
                title: 'Relevance',
                visible: !!initial_query,
                orderSequence: ["desc", "asc"],
            },
            {
                data: 'filtered_power',
                title: 'Filtered Power',
                visible: !!initial_query,
                orderSequence: ["desc", "asc"],
                render: function (data, type, row) {
                    if (type === 'display') {
                        return row.filtered_power_display;
                    }
                    return data;
                }
            },
            {
                data: 'total_power',
                title: 'Total Power',
                orderSequence: ["desc", "asc"],
                render: function (data, type, row) {
                    if (type === 'display') {
                        return row.total_power_display.replace(/\\resources/g, 'http://lostwordchronicle.com/resources');
                    }
                    return data;
                }
            },
            {
                data: 'tao_power_display',
                title: 'Yin/Yang',
                orderSequence: ["desc", "asc"],
                render: function (data, type, row) {
                    if (type === 'sort' || type === 'type') {
                        if(custom_sort.type == 'tao'){
                            if(row.tao_power[custom_sort.value]) {
                                return row.tao_power[custom_sort.value].reduce((acc, cur) => acc + cur, 0);
                            } else {
                                return 0;
                            }
                        }
                        return row.total_power;
                    }
                    return data;
                }
            },
            {
                data: 'elemental_power_display',
                title: 'Attributes',
                orderSequence: ["desc", "asc"],
                render: function (data, type, row) {
                    if (type === 'sort' || type === 'type') {
                        var newRow = row.elemental_power.replace(/\\resources/g, 'http://lostwordchronicle.com/resources')
                        if(custom_sort.type == 'element'){
                            if(newRow.elemental_power[custom_sort.value]) {
                                return newRow.elemental_power[custom_sort.value].reduce((acc, cur) => acc + cur, 0)
                            } else {
                                return 0;
                            }
                        }
                        return row.total_power;
                    }
                    return data;
                }
            },
            {
                data: 'bullet_power_display',
                title: 'Bullet Tag',
                orderSequence: ["desc", "asc"],
                render: function (data, type, row) {
                    if (type === 'sort' || type === 'type') {
                        var newRow - row.bullet_power.replace(/\\resources/g, 'http://lostwordchronicle.com/resources')
                        if(custom_sort.type == 'bullet'){
                            if(row.bullet_power[custom_sort.value]) {
                                return row.bullet_power[custom_sort.value].reduce((acc, cur) => acc + cur, 0)
                            } else {
                                return 0;
                            }
                        }
                        return row.total_power;
                    }
                    return data;
                }
            },
            {
                data: 'killer_power_display',
                title: 'Killers',
                orderSequence: ["desc", "asc"],
                render: function (data, type, row) {
                    if (type === 'sort' || type === 'type') {
                        if(custom_sort.type == 'killer'){
                            if(row.killer_power[custom_sort.value]) {
                                return row.killer_power[custom_sort.value].reduce((acc, cur) => acc + cur, 0);
                            } else {
                                return 0;
                            }
                        }
                        return row.total_power;
                    }
                    return data;
                }
            },
        ],
        columnDefs: [
            { className: 'align-middle', targets: '_all' },
        ],
        scrollX: true,
        dom: "<'d-flex justify-content-between'<'card p-1'l><'card p-1'f>>" +
            "<tr>" +
            "<'d-flex justify-content-between'<'card p-1'i><p>>",
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    let column = this;
    
                    // Create input element
                    let input = document.createElement('input');
                    input.placeholder = "Filter";
                    input.classList.add("w-100")
                    column.footer().replaceChildren(input);
    
                    // Event listener for user input
                    input.addEventListener('keyup', () => {
                        if (column.search() !== this.value) {
                            column.search(input.value).draw();
                        }
                    });
                });
        }
    });

    const toggleLowKillers = (toggle) => {
        document.documentElement.style.setProperty('--low-killer-display', toggle ? 'unset' : 'none');
    }

    toggleLowKillers(false);

    $('.toggle-vis').on('change', function (e) {
        e.preventDefault();

        // Get the column API object
        var column = table.column($(this).data('column'));

        // Toggle the visibility
        column.visible(!column.visible());
    });

    $('.sort-by-tao').on('change', function (e) {
        custom_sort.type = 'tao';
        custom_sort.value = parseInt(this.value);
        table.order([10, 'desc']).rows().invalidate().draw();
    });

    $('.sort-by-element').on('change', function (e) {
        custom_sort.type = 'element';
        custom_sort.value = parseInt(this.value);
        table.order([11, 'desc']).rows().invalidate().draw();
    });

    $('.sort-by-bullet').on('change', function (e) {
        custom_sort.type = 'bullet';
        custom_sort.value = parseInt(this.value);
        table.order([12, 'desc']).rows().invalidate().draw();
    });

    $('.sort-by-killer').on('change', function (e) {
        custom_sort.type = 'killer';
        custom_sort.value = parseInt(this.value);
        table.order([13, 'desc']).rows().invalidate().draw();
    });

    $('.apply-bullet-filters').on('click', function (e) {
        updateFilters();
        let query = buildQuery();
        table.ajax.url("ajax?query=" + buildQuery()).load();
        table.columns([7, 8]).visible(true);
        table.order([7, 'desc']);
        window.history.pushState(query, "", "/attacks/?q=" + query);
    });

    $('.clear-bullet-filters').on('click', function (e) {
        [...document.querySelectorAll('.filter-by-attack')].forEach(e => e.checked = false);
        [...document.querySelectorAll('.filter-by-tao')].forEach(e => e.checked = false);
        [...document.querySelectorAll('.filter-by-element')].forEach(e => e.checked = false);
        [...document.querySelectorAll('.filter-by-bullet')].forEach(e => e.checked = false);
        $('#filter-by-killer').val([]);
        $('#filter-by-killer').trigger('change');
    });

    $('.select-bullet-filters').on('click', function (e) {
        [...document.querySelectorAll('.filter-by-attack')].forEach(e => e.checked = true);
        [...document.querySelectorAll('.filter-by-tao')].forEach(e => e.checked = true);
        [...document.querySelectorAll('.filter-by-element')].forEach(e => e.checked = true);
        [...document.querySelectorAll('.filter-by-bullet')].forEach(e => e.checked = true);
    });
    
    $('#filter-by-killer').select2({
        placeholder: 'Killer Filter',
        multiple: true
    });

    $('#killer-template').on('change', function () {
        let tags = $(this).val().split(',');
        $('#filter-by-killer').val(tags);
        $('#filter-by-killer').trigger('change');
    });
});

$(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
});