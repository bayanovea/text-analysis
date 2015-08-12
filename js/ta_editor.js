var Editor = (function() {
    var
        _isInit = false,
        blocks = {
            main_block: $('#ta_editor'),
            head: $('.ta_editor-head'),
            speller_colors_info: $('.ta_speller-colors-info'),
            materials: $('.ta_materials')
        };

    /**
     * Инициализация
     */
    function init() {
        var
            _this = this,
            _isInit = true;

        // Иницилазиация WYSIWYG-редактора
        _this.blocks.main_block.wysiwyg();

        _addListeners();
    };

    /**
     * Обработчик событий
     */
    function _addListeners() {
        $(document)

            // Клик на правильное слово, исправление неправильного
            .on('click', '.ta_correct-word', function () {
                var
                    _this = $(this),
                    cur_id = Editor.main_block.attr('data-item'),
                    cur_line = $('.ta_work-table tr[data-item="' + cur_id + '"]'),
                    cur_full_text_speller = cur_line.find('.ta_full-text-speller'),
                    correct_text = _this.text(),
                    incorrect_word = _this.prev('span.ta_incorrect-word');

                incorrect_word.text(correct_text.substr(1, correct_text.length - 2));
                _this.remove();
                incorrect_word.replaceWith('<span class="alert-info ta_fixed">' + incorrect_word.html() + '</span>');
                cur_full_text_speller.html(Editor.blocks.main_block.html());
            })

            // Клик на неправильное слово, оставляем неправильное слово
            .on('click', '.ta_incorrect-word', function () {
                var
                    _this = $(this),
                    cur_id = Editor.main_block.attr('data-item'),
                    cur_line = $('.ta_work-table tr[data-item="' + cur_id + '"]'),
                    cur_full_text_speller = cur_line.find('.ta_full-text-speller'),
                    correct_text = _this.text(),
                    correct_word = _this.next('span.ta_correct-word');

                correct_word.remove();
                _this.replaceWith('<span class="alert-info ta_fixed">' + _this.html() + '</span>');
                cur_full_text_speller.html(Editor.blocks.main_block.html());
            })

            // Сохранить материал на сайте
            .on('click', '.ta_save-material', function () {
                var
                    _this = $(this);

                // Если в режиме исправления орфографических ошибок, то удаляем лишние <span>
                if (Editor.blocks.main_block.attr('data-mode') == 'speller') {
                    Editor.blocks.main_block.find('.ta_fixed').each(function () {
                        $(this).replaceWith($(this).html());
                    });
                    Editor.blocks.main_block.find('.ta_correct-word').each(function () {
                        $(this).remove()
                    });
                    Editor.blocks.main_block.find('.ta_incorrect-word').each(function () {
                        $(this).replaceWith($(this).html());
                    });
                }

                html = Editor.blocks.main_block.html();
        });
    }

    return {
        init: init,
        blocks: blocks
    }
})();