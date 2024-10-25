function effective_stat(row_stat) {
    return row_stat[0] + row_stat[1];
}

function stat_render(data, type) {
    if (type === 'display') {
        if(data[1] > 0) return `${data[0]} + ${data[1]}`;
        else return data[0];
    }
    return data[0] + data[1];
}

$(document).ready(function () {
    let table = $('table').DataTable({
        fixedHeader: true,
        //fixedColumns: { left: 2 },
        ajax: 'http://lostwordchronicle.com/story_cards/ajax',
        type: "GET",
        responsive: true,
        columns: [
            {
                data: 'story_card',
                title: 'Story Card',
                render: function (data, type, row) {
                    if (type === 'display') {
                        return '<a href="http://lostwordchronicle.com/story_cards/' + data + '"><img src="http://lostwordchronicle.com/' + row.story_card_image + '"/></a>';
                    }

                    return data;
                },
            },
            {
                data: 'name',
                title: 'Name',
                footer: '#',
            },
            {
                data: 'rarity',
                title: 'Rarity',
            },
            {
                data: 'tile_type',
                title: 'Tile',
                render: function (data, type, row) {
                    if (type === 'display') {
                        return '<img src="http://lostwordchronicle.com' + row.tile_image + '" class="row-prayer"/>';
                    }

                    return data;
                },
            },
            {
                data: function (row, type) {
                    const hp = effective_stat(row.hp);
                    const agi = effective_stat(row.agi);
                    const yang_atk = effective_stat(row.yang_atk);
                    const yang_def = effective_stat(row.yang_def);
                    const yin_atk = effective_stat(row.yin_atk);
                    const yin_def = effective_stat(row.yin_def);
                    if (type === 'display') {
                        let str = [];
                        if (hp > 0) str.push("HP: " + stat_render(row.hp, type));
                        if (agi > 0) str.push("Agility: " + stat_render(row.agi, type));
                        if (yang_atk > 0) str.push("Yang ATK: " + stat_render(row.yang_atk, type));
                        if (yang_def > 0) str.push("Yang DEF: " + stat_render(row.yang_def, type));
                        if (yin_atk > 0) str.push("Yin ATK: " + stat_render(row.yin_atk, type));
                        if (yin_def > 0) str.push("Yin DEF: " + stat_render(row.yin_def, type));
                        return str.join("</br>");
                    }

                    return (hp / 5) + agi + yang_atk + yang_def + yin_atk + yin_def;
                },
                title: 'Stats',
            },
            {
                data: function (row, type) {
                    const agi = effective_stat(row.agi);
                    const yang_atk = effective_stat(row.yang_atk);
                    if (type === 'display') {
                        let str = [];
                        if (agi > 0) str.push("Agility: " + stat_render(row.agi, type));
                        if (yang_atk > 0) str.push("Yang ATK: " + stat_render(row.yang_atk, type));
                        return str.join("</br>");
                    }

                    return agi + yang_atk;
                },
                visible: false,
                title: 'Yang Slice',
            },
            {
                data: function (row, type) {
                    const agi = effective_stat(row.agi);
                    const yin_atk = effective_stat(row.yin_atk);
                    if (type === 'display') {
                        let str = [];
                        if (agi > 0) str.push("Agility: " + stat_render(row.agi, type));
                        if (yin_atk > 0) str.push("Yin ATK: " + stat_render(row.yin_atk, type));
                        return str.join("</br>");
                    }

                    return agi + yin_atk;
                },
                visible: false,
                title: 'Yin Slice',
            },
            {
                data: function (row, type) {
                    const yang_atk = effective_stat(row.yang_atk);
                    const yang_def = effective_stat(row.yang_def);
                    if (type === 'display') {
                        let str = [];
                        if (yang_atk > 0) str.push("Yang ATK: " + stat_render(row.yang_atk, type));
                        if (yang_def > 0) str.push("Yang DEF: " + stat_render(row.yang_def, type));
                        return str.join("</br>");
                    }

                    return yang_atk + yang_def;
                },
                visible: false,
                title: 'Yang Hard',
            },
            {
                data: function (row, type) {
                    const yin_atk = effective_stat(row.yin_atk);
                    const yin_def = effective_stat(row.yin_def);
                    if (type === 'display') {
                        let str = [];
                        if (yin_atk > 0) str.push("Yin ATK: " + stat_render(row.yin_atk, type));
                        if (yin_def > 0) str.push("Yin DEF: " + stat_render(row.yin_def, type));
                        return str.join("</br>");
                    }

                    return yin_atk + yin_def;
                },
                visible: false,
                title: 'Yin Hard',
            },
            {
                data: function (row, type) {
                    const yang_atk = effective_stat(row.yang_atk);
                    const yin_atk = effective_stat(row.yin_atk);
                    if (type === 'display') {
                        let str = [];
                        if (yang_atk > 0) str.push("Yang ATK: " + stat_render(row.yang_atk, type));
                        if (yin_atk > 0) str.push("Yin ATK: " + stat_render(row.yin_atk, type));
                        return str.join("</br>");
                    }

                    return yang_atk + yin_atk;
                },
                visible: false,
                title: 'Mixed',
            },
            { data: 'hp', visible: false, render: stat_render, title: 'HP' },
            { data: 'agi', visible: false, render: stat_render, title: 'Agility' },
            { data: 'yang_atk', visible: false, render: stat_render, title: 'Yang ATK' },
            { data: 'yang_def', visible: false, render: stat_render, title: 'Yang DEF' },
            { data: 'yin_atk', visible: false, render: stat_render, title: 'Yin ATK' },
            { data: 'yin_def', visible: false, render: stat_render, title: 'Yin DEF' },
            {
                data: 'effects',
                title: 'Effect',
                render: function (data, type, row) {
                    if (type === 'display') {
                        return data.join("</br>");
                    }

                    if (type === 'sort' || type === 'type') {
                        let filter = parseInt($('.type-filter').val());
                        if (!isNaN(filter)) {
                            let group_information = '';
                            if (filter == 1 || filter == 2) group_information = parseInt($('.type-filter').find(':selected').data('st'));
                            if (isNaN(group_information)) group_information = parseInt($('.attribute-filter').val());
                            if (isNaN(group_information)) group_information = parseInt($('.bullet-filter').val());
                            if (isNaN(group_information)) group_information = parseInt($('.character-filter').val());
                            if (!isNaN(group_information)) {
                                return row.effect_information
                                    .filter(a => a.type == filter && a.subtype == group_information)
                                    .map(a => parseInt(a.power))
                                    .reduce((a, b) => Math.max(a, b), 0)
                                    .replace(/\\resources/g, 'http://lostwordchronicle.com/resources')
                                    ;
                            } else {
                                return row.effect_information
                                    .filter(a => a.type == filter)
                                    .map(a => parseInt(a.power))
                                    .reduce((a, b) => Math.max(a, b), 0)
                                    .replace(/\\resources/g, 'http://lostwordchronicle.com/resources')
                                    ;
                            }
                        }
                        return 0;
                    }

                    return data;
                },
            },
        ],
        order: [[1, 'asc']],
        columnDefs: [
            { className: 'align-middle', targets: '_all' },
            { orderSequence: ["asc", "desc"], targets: [0, 1, 3] },
            { orderSequence: ["desc", "asc"], targets: '_all' },
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

    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex, rowData, searchCounter) {
        let filter = parseInt($('.type-filter').val());
        let selected_effects = [];
        if (!isNaN(filter)) {
            selected_effects = rowData.effect_information.filter(a => a.type == filter).replace(/\\resources/g, 'http://lostwordchronicle.com/resources')
            if (selected_effects.length < 1) return;
            if (filter == 1 || filter == 2) {
                let group_information = parseInt($('.type-filter').find(':selected').data('st'));
                if (!selected_effects.some(a => a.subtype == group_information)) return false;
            }
            for (let group_info of ['.attribute-filter', '.bullet-filter', '.character-filter']) {
                let parsed = parseInt($(group_info).val());
                if (!isNaN(parsed) && !selected_effects.some(a => a.subtype == parsed)) return false;
            }
            filter = parseInt($('.target-filter').val());
            if (!isNaN(filter) && !selected_effects.some(a => a.range == filter)) return false;
            filter = parseInt($('.unit-class-filter').val());
            if (!isNaN(filter)) {
                if (filter == -1) {
                    if (rowData.effect_information.some(a => a.unit_class != 0)) return false;
                }
                else {
                    if (!rowData.effect_information.some(a => a.unit_class == filter)) return false;
                }
            }
        } else {
            filter = parseInt($('.target-filter').val());
            if (!isNaN(filter) && !rowData.effect_information.some(a => a.range == filter)) return false;
            filter = parseInt($('.unit-class-filter').val());
            if (!isNaN(filter)) {
                if (filter == -1) {
                    if (rowData.effect_information.some(a => a.unit_class != 0)) return false;
                }
                else {
                    if (!rowData.effect_information.some(a => a.unit_class == filter)) return false;
                }
            }
        }

        return true;
    });

    $('.type-filter').on('change', function () {
        let filter = parseInt($('.type-filter').val());
        table.rows().invalidate();
        if (!isNaN(filter)) table.order([16, 'desc']);
        else table.order([1, 'asc']);
        switch (filter) {
            // Bullet filter
            case 12:
            case 15:
                $('.attribute-filter').addClass('d-none');
                $('.attribute-filter').val('');
                $('.bullet-filter').removeClass('d-none');
                $('.character-filter').addClass('d-none');
                $('.character-filter').val('');
                break;
            // Attribute filter
            case 13:
            case 16:
                $('.attribute-filter').removeClass('d-none');
                $('.bullet-filter').addClass('d-none');
                $('.bullet-filter').val('');
                $('.character-filter').addClass('d-none');
                $('.character-filter').val('');
                break;
            // Character filter
            case 14:
                $('.attribute-filter').addClass('d-none');
                $('.attribute-filter').val('');
                $('.bullet-filter').addClass('d-none');
                $('.bullet-filter').val('');
                $('.character-filter').removeClass('d-none');
                break;
            default:
                $('.attribute-filter').addClass('d-none');
                $('.attribute-filter').val('');
                $('.bullet-filter').addClass('d-none');
                $('.bullet-filter').val('');
                $('.character-filter').addClass('d-none');
                $('.character-filter').val('');
                break;
        }
        table.draw();
    });
    $('.target-filter').on('change', function () { table.draw(); });
    $('.unit-class-filter').on('change', function () { table.draw(); });

    $('.attribute-filter').on('change', function () {
        let filter = parseInt($('.attribute-filter').val());
        if (!isNaN(filter)) {
            table.rows().invalidate();
            table.order([16, 'desc']);
        }
        table.draw();
    });

    $('.bullet-filter').on('change', function () {
        let filter = parseInt($('.bullet-filter').val());
        if (!isNaN(filter)) {
            table.rows().invalidate();
            table.order([16, 'desc']);
        }
        table.draw();
    });

    $('.character-filter').on('change', function () {
        let filter = parseInt($('.character-filter').val());
        if (!isNaN(filter)) {
            table.rows().invalidate();
            table.order([16, 'desc']);
        }
        table.draw();
    });

    $('.stat-row-select').on('change', function () {
        var filter = $(this).val();
        switch (filter) {
            case "compact":
                table.column(4).visible(true, false);
                table.columns([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).visible(false, true);
                table.draw();
                break;
            case "yang_slice":
                table.order([5, 'desc']);
                table.column(5).visible(true, false);
                table.columns([4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).visible(false, false);
                table.draw();
                break;
            case "yin_slice":
                table.order([6, 'desc']);
                table.column(6).visible(true, false);
                table.columns([4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15]).visible(false, false);
                table.draw();
                break;
            case "yang_hard":
                table.order([7, 'desc']);
                table.column(7).visible(true, false);
                table.columns([4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15]).visible(false, false);
                table.draw();
                break;
            case "yin_hard":
                table.order([8, 'desc']);
                table.column(8).visible(true, false);
                table.columns([4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]).visible(false, false);
                table.draw();
                break;
            case "mixed":
                table.order([9, 'desc']);
                table.column(9).visible(true, false);
                table.columns([4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15]).visible(false, false);
                table.draw();
                break;
            case "extended":
                table.columns([4, 5, 6, 7, 8, 9]).visible(false, false);
                table.columns([10, 11, 12, 13, 14, 15]).visible(true, true);
                break;
        }
    });
});