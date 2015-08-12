var ProjectsList = (function() {
    var
        _isInit = false,
        blocks = {
        };

    /**
     * Инициализация
     */
    function init() {
        var
            _this = this,
            _isInit = true;

        _addListeners();
    };

    /**
     * Обработчик событий
     */
    function _addListeners() {
        $(document)
            // Клик на "Проверить орфографию всех материалов"
            .on('click', '.ta_text-orthography-all-btn', function () {
                var me = $(this);
                _blocks.ortographyBtns.each(function() {
                    $(this).click();
                });
                me.hide();
            })

            // Кнопка "Проверить" на орфографию отдельный материал
            .on('click', '.ta_text-orthography-btn', function() {
                var
                    _this = $(this),
                    line = _this.parents('tr').first(),
                    full_text_element = line.find('.ta_full-text'),
                    full_text = full_text_element.html(),
                    full_text_speller = line.find('.ta_full-text-speller'),
                    cur_material_head = line.find('.material-head'),
                    ta_speller_material_to_work = line.find('.ta_speller-material-to-work');

                // Посылаем запрос yandex speller'у
                $.ajax({
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
                            var
                                error_word = data[i],
                                pos = error_word['pos'],
                                len = error_word['len'],
                                correct_word = '';

                            if(error_word['s'][0])
                                correct_word = '<span class="alert-success ta_correct-word">[' + error_word['s'][0] + ']</span>';
                            full_text = full_text.substr(0, pos) +
                                '<span class="alert-danger ta_incorrect-word">'+ full_text.substr(pos, len)+'</span>' +
                                correct_word + full_text.substr(pos + len);
                        }

                        full_text_speller.html(full_text);                                     // Сохраняем текст с тегами корректности
                        ta_speller_material_to_work.removeClass('ta_display-none');            // Показываем ссылку "Посмотреть орфографию"
                        Editor.blocks.main_block.attr('data-item', line.attr('data-item'));    // Переносим id в рабочую область
                        Editor.blocks.main_block.attr('data-mode', 'speller');                 // Меняем мод
                        Editor.blocks.head.text(cur_material_head.text());                     // Заголовок материала
                        Editor.blocks.main_block.html(full_text);                              // Результат выводим в рабочую область
                        Editor.blocks.speller_colors_info.show();                              // Показываем подсказки
                    }
                });
            })

            // Посмотреть оригинальный текст в рабочей области
            .on('click', '.ta_material-to-work', function () {
                var
                    _this = $(this),
                    line = _this.parents('tr').first(),
                    full_text = line.find('.ta_full-text').html(),
                    cur_material_head = line.find('.material-head');

                Editor.blocks.main_block.attr('data-item', line.attr('data-item'));
                Editor.blocks.main_block.attr('data-mode', 'simple');
                Editor.blocks.main_block.html(full_text);
                Editor.blocks.head.text(cur_material_head.text());
                Editor.blocks.speller_colors_info.hide();
            })

            // Посмотреть текст с орфографическими ошибками в рабочей области
            .on('click', '.ta_speller-material-to-work > a, .ta_ortography-error-count', function () {
                var
                    _this = $(this),
                    line = _this.parents('tr').first(),
                    full_text_speller = line.find('.ta_full-text-speller'),
                    cur_material_head = line.find('.material-head');

                Editor.blocks.main_block.attr('data-item', line.attr('data-item'));
                Editor.blocks.main_block.attr('data-mode', 'speller');
                Editor.blocks.main_block.html(full_text_speller.html());
                Editor.blocks.head.text(cur_material_head.text());
                Editor.blocks.speller_colors_info.show();
                scroll_to(Editor.blocks.main_block);
            });
    };


    return {
        init: init,
    }
})();
