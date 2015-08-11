function plotCategoriesPie(series) {
    jQuery('.ta_categories-graphics-pie').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Процент',
            data: series
        }]
    });
}

function plotMaterialsLine(series) {
    $('.ta_categories-graphics-line').highcharts({
        chart: {
            type: 'spline'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Дата'
            }
        },
        yAxis: {
            title: {
                text: 'Количество'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },

        series:  series
    });
}

jQuery(document).ready(function(){

    /* Определяем часто используемые блоки  */
    var ta_editor = jQuery('#ta_editor');
    var ta_editor_head = jQuery('.ta_editor-head');
    var ta_speller_colors_info = jQuery('.ta_speller-colors-info');
    var ta_materials = jQuery('.ta_materials');
    var ta_alerts = jQuery('.ta_alerts');
    var private_info_form = jQuery('.ta_private-info-form');
    var module_form = jQuery('.ta_select-modules-form');
    var filter_form = jQuery('.ta_filter-form');
    var ta_tabs = jQuery('.ta_tabs');

    /* Cкроллы  */
    function scroll_to(element) {
        $('html, body').animate({
            scrollTop: element.offset().top - 100
        }, 500);
    }

    /* Инициализируем bootstrap WYSIWYG-редактор */
    ta_editor.wysiwyg();
    /* Инициализируем datepicker */
    $('.ta_datepicker-from, .ta_datepicker-to').datepicker({
        dateFormat: "yy-mm-dd 00:00"
    });

    /* Настройка графиков */
    Highcharts.theme = {
        colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: null,
            style: { fontFamily: "Signika, serif" }
        },
        title: {
            style: {
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            style: { color: 'black' }
        },
        tooltip: { borderWidth: 0 },
        legend: {
            itemStyle: {
                fontWeight: 'bold',
                fontSize: '13px'
            }
        },
        xAxis: {
            labels: {
                style: { color: '#6e6e70' }
            }
        },
        yAxis: {
            labels: {
                style: { color: '#6e6e70' }
            }
        },
        plotOptions: {
            series: { shadow: true },
            candlestick: { lineColor: '#404048' },
            map: { shadow: false }
        },
        // Highstock specific
        navigator: {
            xAxis: {  gridLineColor: '#D0D0D8' }
        },
        rangeSelector: {
            buttonTheme: {
                fill: 'white',
                stroke: '#C0C0C8',
                'stroke-width': 1,
                states: {
                    select: { fill: '#D0D0D8' }
                }
            }
        },
        scrollbar: { trackBorderColor: '#C0C0C8' },
        // General
        background2: '#E0E0E8'
    };
    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);


    /* Клик на кнопку после заполнения приватной информации */
    jQuery('.ta_private-info-btn').on('click', function() {
        jQuery(this).fadeOut(400);
        jQuery('.ta_arrow-1, .ta_select-modules-form').fadeIn(700);
    });

    /* Клик на кнопку после выбора модуля */
    jQuery('.ta_select-module-btn').on('click', function() {
        // Не выбран модуль
        if(module_form.find('select[name="ta_select-module"]').val() == 0) {
            ta_alerts.removeClass('alert-success').addClass('alert-danger').text('Не выбран модуль!').fadeIn().delay(500).fadeOut(2000);
            scroll_to(ta_alerts);
            return false;
        }

        jQuery(this).fadeOut(400);
        jQuery('.ta_arrow-2, .ta_filter-form').fadeIn(700);
    });

    /* Изменение выбора модуля */
    jQuery(module_form.find('select[name="ta_select-module"]')).on('change', function() {
        var _this = jQuery(this);
        var ta_filter_category = filter_form.find('select[name="ta_filter-category"]');

        // Делаем запрос, чтобы получить категории и вывести их в фильтре
        jQuery.ajax({
            type: 'POST',
            url: 'ajax/index.php',
            data: private_info_form.serialize() + '&' +  module_form.serialize() + '&' + filter_form.serialize() + "&type=get-categories",
            success: function(data){
                var data = JSON.parse(data);
                ta_filter_category.html('<option value="0">Любая</option>');
                for(var i=0; i < data.length; i++) {
                    ta_filter_category.append('<option value="' + data[i]['id'] + '">' + data[i]['name'] + '</option>');
                }
            }
        });
    });

    /* Получение всех материалов по данному модулю, с заданными фильтрами */
    $('.ta_filter-btn').on('click', function() {
        var _this = jQuery(this);

        // Не выбран модуль
        if(module_form.find('select[name="ta_select-module"]').val() == 0) {
            ta_alerts.removeClass('alert-success').addClass('alert-danger').text('Не выбран модуль!').fadeIn().delay(500).fadeOut(2000);
            scroll_to(ta_alerts);
            return false;
        }

        _this.button('loading');

        jQuery.ajax({
            type: 'POST',
            url: 'ajax/index.php',
            dataType: 'json',
            data: private_info_form.serialize() + '&' +  module_form.serialize() + '&' + filter_form.serialize() + "&type=get-materials",
            success: function(data){
                _this.button('reset');

                if(data['error']) {
                    ta_alerts.removeClass('alert-success').addClass('alert-danger').text(data['error']).fadeIn().delay(500).fadeOut(2000);
                    scroll_to_ta_alerts();
                    jQuery('.ta_result-div').hide();
                }

                // Информация по кол-ву материалов
                jQuery('.ta_detail-info-materials-count').text(data['all-materials-count']);
                jQuery('.ta_detail-info-filter-materials-count').text(data['filter-materials-count']);
                var categories = data['categories'];

                // Данные для кругового графика с процентным содержанием категорий
                var series_categories = [];
                Object.keys(categories).forEach(function (key) {
                    series_categories.push([categories[key].name, categories[key].count]);
                });

                // Данные для линейного графика по кол-ву материалов по датам и категориям
                var series_dates = [];
                Object.keys(categories).forEach(function (key) {
                    var cur_dates = [];
                    Object.keys(categories[key].dates).forEach(function (key2) {
                        var date_split = key2.split('-');
                        var cur_year = date_split[0];
                        var cur_month = date_split[1];
                        var cur_day = date_split[2];
                        cur_dates.push([Date.UTC(cur_year, cur_month, cur_day), categories[key].dates[key2].count ]);
                    });

                    series_dates.push({
                        name: categories[key].name,
                        data: cur_dates
                    });
                });

                // Строим круговой график по категориям
                if(series_categories.length > 1) {
                    plotCategoriesPie(series_categories);
                } else {
                    jQuery('.ta_categories-graphics-pie').html('<p class="alert alert-warning">Всего одна категория</p>');
                }


                // Строим линейный график
                if(series_dates.length) {
                    if(series_dates[0]['data'][0][0])
                        plotMaterialsLine(series_dates);
                }
                else
                    jQuery('.ta_categories-graphics-line').html('<p class="alert alert-warning">Информация недоступна</p>');


                // Помещаем таблицу с материалам в соответсвующую область
                ta_materials.html(data['materials']);

                scroll_to( ta_tabs );
                ta_tabs.fadeIn(400);
            }
        });
    });

    /* Кнопка "Проверить" на орфографию отдельный материал */
    ta_materials.on('click', '.ta_text-orthography-btn', function() {
        var _this = jQuery(this);
        var line = _this.parents('tr').first();
        var full_text_element = line.find('.ta_full-text');
        var full_text = full_text_element.html();
        var full_text_speller = line.find('.ta_full-text-speller');
        var cur_material_head = line.find('.material-head');
        var ta_speller_material_to_work = line.find('.ta_speller-material-to-work');

        // Посылаем запрос yandex speller'у
        jQuery.ajax({
            type: 'POST',
            url: 'http://speller.yandex.net/services/spellservice.json/checkText',
            data: {
                lang: 'ru',
                options: '2061',
                format: 'html',
                text : full_text
            },
            success: function(data) {
                // Выводим общее количество ошибок
                _this.replaceWith('<p>Кол-во ошибок: <b><span class="ta_ortography-error-count text-danger">' + data.length + '</span></b></p>');

                // Неправильные слова подсвечиваем красным, рядом выводим правильные с зелёной подсветкой
                for(var i = data.length - 1; i >= 0; i--) {
                    var error_word = data[i];
                    var pos = error_word['pos'];
                    var len = error_word['len'];
                    var correct_word = '';
                    if(error_word['s'][0])
                        correct_word = '<span class="alert-success ta_correct-word">[' + error_word['s'][0] + ']</span>';
                    full_text = full_text.substr(0, pos) +
                    '<span class="alert-danger ta_incorrect-word">'+ full_text.substr(pos, len)+'</span>' +
                    correct_word + full_text.substr(pos + len);
                }

                full_text_speller.html(full_text);                                  // Сохраняем текст с тегами корректности
                ta_speller_material_to_work.removeClass('ta_display-none');         // Показываем ссылку "Посмотреть орфографию"
                ta_editor.attr('data-item', line.attr('data-item'));                // Переносим id в рабочую область
                ta_editor.attr('data-mode', 'speller');                             // Меняем мод
                ta_editor_head.text(cur_material_head.text());                      // Заголовок материала
                ta_editor.html(full_text);                                          // Результат выводим в рабочую область
                ta_speller_colors_info.show();                                      // Показываем подсказки
            }
        });
    });

    /* Клик на "Проверить орфографию всех материалов" */
    ta_materials.on('click', '.ta_text-orthography-all-btn', function() {
        var _this = jQuery(this);
        jQuery('.ta_text-orthography-btn').each(function() {
            jQuery(this).click();
        });
        _this.hide();
    });

    /* Клик на правильное слово, исправление неправильного */
    ta_editor.on('click', '.ta_correct-word', function () {
        var _this = jQuery(this);
        var cur_id = ta_editor.attr('data-item');
        var cur_line = jQuery('.ta_work-table tr[data-item="'+cur_id+'"]');
        var cur_full_text_speller = cur_line.find('.ta_full-text-speller');
        var correct_text = _this.text();
        var incorrect_word = _this.prev('span.ta_incorrect-word');
        incorrect_word.text( correct_text.substr(1, correct_text.length - 2) );
        _this.remove();
        incorrect_word.replaceWith('<span class="alert-info ta_fixed">' + incorrect_word.html() + '</span>');
        cur_full_text_speller.html(ta_editor.html());
    });

    /* Клик на неправильное слово, оставляем неправильное слово */
    ta_editor.on('click', '.ta_incorrect-word', function () {
        var _this = jQuery(this);
        var cur_id = ta_editor.attr('data-item');
        var cur_line = jQuery('.ta_work-table tr[data-item="'+cur_id+'"]');
        var cur_full_text_speller = cur_line.find('.ta_full-text-speller');
        var correct_text = _this.text();
        var correct_word = _this.next('span.ta_correct-word');
        correct_word.remove();
        _this.replaceWith('<span class="alert-info ta_fixed">' + _this.html() + '</span>');
        cur_full_text_speller.html(ta_editor.html());
    });

    /* Посмотреть оригинальный текст в рабочей области */
    ta_materials.on('click', '.ta_material-to-work', function() {
        var _this = jQuery(this);
        var line = _this.parents('tr').first();
        var full_text = line.find('.ta_full-text').html();
        var cur_material_head = line.find('.material-head');
        ta_editor.attr('data-item', line.attr('data-item'));
        ta_editor.attr('data-mode', 'simple');
        ta_editor.html(full_text);
        ta_editor_head.text(cur_material_head.text());
        ta_speller_colors_info.hide();
    });

    /* Посмотреть текст с орфографическими ошибками в рабочей области */
    ta_materials.on('click', '.ta_speller-material-to-work > a, .ta_ortography-error-count', function() {
        var _this = jQuery(this);
        var line = _this.parents('tr').first();
        var full_text_speller = line.find('.ta_full-text-speller');
        var cur_material_head = line.find('.material-head');
        ta_editor.attr('data-item', line.attr('data-item'));
        ta_editor.attr('data-mode', 'speller');
        ta_editor.html(full_text_speller.html());
        ta_editor_head.text(cur_material_head.text());
        ta_speller_colors_info.show();
        scroll_to(ta_editor);
    });

    /* Сохранить материал на сайте */
    jQuery('.ta_save-material').on('click', function() {
        var _this = jQuery(this);

        // Если в режиме исправления орфографических ошибок, то удаляем лишние <span>
        if(ta_editor.attr('data-mode') == 'speller') {
            ta_editor.find('.ta_fixed').each( function() {
                jQuery(this).replaceWith( jQuery(this).html() );
            });
            ta_editor.find('.ta_correct-word').each( function() {
                jQuery(this).remove()
            });
            ta_editor.find('.ta_incorrect-word').each( function() {
                jQuery(this).replaceWith( jQuery(this).html() );
            });
        }

        html = ta_editor.html();
    });

})
