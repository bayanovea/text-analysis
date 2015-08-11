<html>
<head>
    <!-- jQuery, jQuery UI-->
    <link rel="stylesheet" href="js/jquery-ui-1.11.3/jquery-ui.min.css" />
    <script src="js/jquery-2.1.3.min.js"></script>
    <script src="js/jquery.hotkeys.js"></script>
    <script src="js/jquery-ui-1.11.3/jquery-ui.min.js"></script>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css" />
    <link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap-theme.min.css" />
    <script src="bootstrap-3.3.2/js/bootstrap.min.js"></script>
    <script src="bootstrap-3.3.2/bootstrap-wysiwyg/bootstrap-wysiwyg.js"></script>

    <!-- Графики -->
    <script src="http://code.highcharts.com/highcharts.js"></script>

    <!-- Custom -->
    <link rel="stylesheet" href="css/ta_main.css" />
    <script src="js/ta_main.js"></script>
</head>
<body>
<section class="main">

    <form class="ta_private-info-form">
        <h4>1. Заполните информацию</h4>
        <div class="form-group">
            <label for="consumer_key">consumer_key</label>
            <input name="consumer_key" class="form-control" value="fsdfsdfsf4rsefsf" />

            <label for="consumer_secret">consumer_secret</label>
            <input name="consumer_secret" class="form-control" value="HyaFKPO2ZrwYciSboO.CnKbFoRrgsi" />

            <label for="token">token</label>
            <input name="token" class="form-control" value="90BZg1MJOC4M2xvbtQaxWexw.WuJjoNw4B6eHkZ8" />

            <label for="token_secret">oauth_token_secret</label>
            <input name="token_secret" class="form-control" value="nV5Q1Ld1vps7REvqvzlUkNjHGOjRVH5JLeu.VHm6" />

            <label for="main_url">main_url</label>
            <input name="main_url" class="form-control" value="http://alphatest-6347.ucoz.ru/uapi" />
        </div>
        <div class="btn btn-success btn-block ta_private-info-btn">Дальше</div>
    </form>

    <img src="img/ta_arrow.png" class="ta_arrow ta_arrow-1" />

    <form class="ta_select-modules-form">
        <h4>2. Выберите модуль</h4>
        <div class="form-group">
            <label for="ta_select-module">Модуль</label>
            <select name="ta_select-module" class="form-control">
                <option value="0">Модуль не выбран</option>
                <option value="publ">Каталог статей</option>
                <option value="board">Доска объявлений</option>
                <option value="gb">Гостевая книга</option>
                <option value="faq">FAQ (вопросы/ответы)</option>
            </select>
        </div>
        <div class="btn btn-success btn-block ta_select-module-btn">Дальше</div>
    </form>

    <img src="img/ta_arrow.png" class="ta_arrow ta_arrow-2" />

    <form class="ta_filter-form">
        <h4>3. Настройте фильтры</h4>

        <div class="form-group">
            <label for="ta_filter-category">Категория</label>
            <select name="ta_filter-category" class="form-control input-sm">
                <option value="0">Любая</option>
            </select>
        </div>

        <label>Идентификатор</label>
        <div class="form-group form-inline">
            <label for="ta_filter-id-from">От</label>
            <input name="ta_filter-id-from" class="form-control input-sm" />

            <div class="pull-right">
                <label for="ta_filter-id-to">До</label>
                <input name="ta_filter-id-to" class="form-control input-sm" />
            </div>
        </div>

        <div class="form-group">
            <label for="ta_filter-limit">Ограничение по количеству</label>
            <input name="ta_filter-limit" class="form-control input-sm" />
        </div>

        <label>Дата</label>
        <div class="form-group form-inline">
            <label for="ta_filter-date-from">От</label>
            <input name="ta_filter-date-from" class="form-control input-sm ta_datepicker-from" />

            <div class="pull-right">
                <label for="ta_filter-date-to">До</label>
                <input name="ta_filter-date-to" class="form-control input-sm ta_datepicker-to" />
            </div>
        </div>

        <div class="form-group">
            <label>
                <input type="checkbox" name="ta_plot-graphics" checked="checked">
                Собрать подробную информацию
            </label>
        </div>

        <div class="btn btn-primary btn-block ta_filter-btn">Поехали!</div>

    </form>

    <div class="ta_clear"></div>

    <div class="ta_tabs">
        <ul id="myTab" class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#ta_tab-materials" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">Материалы модуля</a></li>
            <li role="presentation" class=""><a href="#ta_tab-module" role="tab" data-toggle="tab" aria-controls="profile" aria-expanded="false">Подробная информация</a></li>
        </ul>

        <div id="myTabContent" class="tab-content">

            <div role="tabpanel" class="tab-pane fade active in" id="ta_tab-materials" aria-labelledby="home-tab">
                <div class="ta_materials"></div>

                <div class="ta_result-div">
                    <h3>Редактор</h3>

                    <div class="btn-toolbar" data-role="editor-toolbar" data-target="#ta_editor">
                        <div class="btn-group">
                            <a class="btn btn-default" data-edit="bold" title="" data-original-title="Bold (Ctrl/Cmd+B)"><i class="glyphicon glyphicon-bold"></i></a>
                            <a class="btn btn-default" data-edit="italic" title="" data-original-title="Italic (Ctrl/Cmd+I)"><i class="glyphicon glyphicon-italic"></i></a>
                        </div>

                        <div class="btn-group">
                            <a class="btn btn-default" data-edit="justifyleft" title="" data-original-title="Align Left (Ctrl/Cmd+L)"><i class="glyphicon glyphicon-align-left"></i></a>
                            <a class="btn btn-default" data-edit="justifycenter" title="" data-original-title="Center (Ctrl/Cmd+E)"><i class="glyphicon glyphicon-align-center"></i></a>
                            <a class="btn btn-default" data-edit="justifyright" title="" data-original-title="Align Right (Ctrl/Cmd+R)"><i class="glyphicon glyphicon-align-right"></i></a>
                            <a class="btn btn-default" data-edit="justifyfull" title="" data-original-title="Justify (Ctrl/Cmd+J)"><i class="glyphicon glyphicon-align-justify"></i></a>
                        </div>
                    </div>

                    <h4 class="ta_editor-head"></h4>

                    <div id="ta_editor" data-item="" data-mode="simple"></div>

                    <div class="ta_speller-colors-info">
                        <p><span class="alert-danger"></span>  &mdash;  ошибочное слово (<b>клик</b> - оставить слово)</p>
                        <p><span class="alert-success"></span>  &mdash;  правильное слово (<b>клик</b> - заменить ошибочное слово)</p>
                        <p><span class="alert-info"></span>  &mdash;  слово уже заменено</p>
                        <br/>
                        <p>Проверка правописания: <a target="_blank" href="http://api.yandex.ru/speller/">Яндекс.Спеллер</a></p>
                    </div>

                    <div class="btn btn-success ta_save-material">Cохранить изменения на сайте</div>
                    <div class="ta_clear"></div>
                </div>

            </div>

            <div role="tabpanel" class="tab-pane fade" id="ta_tab-module" aria-labelledby="profile-tab">
                <h3>Подробная информация</h3>
                <p class="alert alert-success">
                    Всего материалов в модуле: <strong><span class="ta_detail-info-materials-count"></span></strong><br/>
                    Материалов с применением фильтров: <strong><span class="ta_detail-info-filter-materials-count"></span></strong>
                </p>

                <h3>Графическое представление</h3>
                <div class="ta_module-detail-info">
                    <p class="alert alert-warning"><b>* Информация отображается с учетом фильтров</b></p>
                </div>
                <div class="ta_module-graphics">
                    <h4 class="text-center">Категории</h4>
                    <div class="ta_categories-graphics-pie"></div><br/><br/>

                    <h4 class="text-center">Количество материалов по категориям</h4>
                    <div class="ta_categories-graphics-line"></div><br/><br/>
                </div>
            </div>

        </div>
    </div>

    <div class="ta_alerts alert"></div>

</section>

</body>
</html>