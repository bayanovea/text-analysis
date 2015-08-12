var Application = (function() {
    var
        _isInit = false,
        blocks = {
            ta_alerts: $('.ta_alerts'),
            private_info_form: $('.ta_private-info-form'),
            module_form: $('.ta_select-modules-form'),
            filter_form: $('.ta_filter-form'),
            ta_tabs: $('.ta_tabs')
        };

    /**
     * Инициализация
     */
    function init() {
        var
            _this = this,
            _isInit = true;

        // Инициализируем datepicker
        $('.ta_datepicker-from, .ta_datepicker-to').datepicker({ dateFormat: "yy-mm-dd 00:00" });

        _addListeners();
    };

    /**
     * Обработчик событий
     */
    function _addListeners() {
        $(document)

            // Клик на кнопку после заполнения приватной информации
            .on('click', '.ta_private-info-btn', function () {
                $(this).fadeOut(400);
                $('.ta_arrow-1, .ta_select-modules-form').fadeIn(700);
            })

            // Клик на кнопку после выбора модуля
            .on('click', '.ta_select-module-btn', function () {
                // Не выбран модуль
                if (module_form.find('select[name="ta_select-module"]').val() == 0) {
                    ta_alerts.removeClass('alert-success').addClass('alert-danger').text('Не выбран модуль!').fadeIn().delay(500).fadeOut(2000);
                    scroll_to(ta_alerts);
                    return false;
                }

                $(this).fadeOut(400);
                $('.ta_arrow-2, .ta_filter-form').fadeIn(700);
            })

            // Изменение выбора модуля
            .on('change', blocks.module_form.find('select[name="ta_select-module"]'), function () {
                var
                    _this = $(this),
                    ta_filter_category = blocks.filter_form.find('select[name="ta_filter-category"]');

                // Делаем запрос, чтобы получить категории и вывести их в фильтре
                $.ajax({
                    type: 'POST',
                    url: 'ajax/index.php',
                    data: blocks.private_info_form.serialize() + '&' + blocks.module_form.serialize() + '&' +
                        blocks.filter_form.serialize() + "&type=get-categories",
                    success: function (data) {
                        var data = JSON.parse(data);
                        ta_filter_category.html('<option value="0">Любая</option>');
                        for (var i = 0; i < data.length; i++) {
                            ta_filter_category.append('<option value="' + data[i]['id'] + '">' + data[i]['name'] + '</option>');
                        }
                    }
                });
            })

            // Получение всех материалов по данному модулю, с заданными фильтрами
            .on('click', '.ta_filter-btn', function() {
                var _this = $(this);

                // Не выбран модуль
                if (module_form.find('select[name="ta_select-module"]').val() == 0) {
                    ta_alerts.removeClass('alert-success').addClass('alert-danger').text('Не выбран модуль!').fadeIn().delay(500).fadeOut(2000);
                    scroll_to(ta_alerts);
                    return false;
                }

                _this.button('loading');

                $.ajax({
                    type: 'POST',
                    url: 'ajax/index.php',
                    dataType: 'json',
                    data: private_info_form.serialize() + '&' + module_form.serialize() + '&' + filter_form.serialize() + "&type=get-materials",
                    success: function (data) {
                        _this.button('reset');

                        if (data['error']) {
                            ta_alerts.removeClass('alert-success').addClass('alert-danger').text(data['error']).fadeIn().delay(500).fadeOut(2000);
                            scroll_to_ta_alerts();
                            $('.ta_result-div').hide();
                        }

                        // Информация по кол-ву материалов
                        $('.ta_detail-info-materials-count').text(data['all-materials-count']);
                        $('.ta_detail-info-filter-materials-count').text(data['filter-materials-count']);
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
                                var date_split = key2.split('-'),
                                    cur_year = date_split[0],
                                    cur_month = date_split[1],
                                    cur_day = date_split[2];

                                cur_dates.push([Date.UTC(cur_year, cur_month, cur_day), categories[key].dates[key2].count]);
                            });

                            series_dates.push({
                                name: categories[key].name,
                                data: cur_dates
                            });
                        });

                        // Строим круговой график по категориям
                        if (series_categories.length > 1) {
                            Graphics.plotCategoriesPie($('.ta_categories-graphics-pie'), series_categories);
                        } else {
                            $('.ta_categories-graphics-pie').html('<p class="alert alert-warning">Всего одна категория</p>');
                        }

                        // Строим линейный график по принадлежности материалов к категории
                        if (series_dates.length) {
                            if (series_dates[0]['data'][0][0])
                                Graphics.plotMaterialsLine($('.ta_categories-graphics-line'), series_dates);
                        }
                        else
                            $('.ta_categories-graphics-line').html('<p class="alert alert-warning">Информация недоступна</p>');

                        // Помещаем таблицу с материалам в соответсвующую область
                        Editor.blocks.materials.html(data['materials']);

                        scroll_to(ta_tabs);
                        ta_tabs.fadeIn(400);
                    }
                });
            });
    }

    return {
        init: init,
        blocks: blocks
    }
})();
