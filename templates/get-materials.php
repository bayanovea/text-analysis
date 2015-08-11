<?php
    $materials = '<h3>Результат</h3>';
    if(!empty($data_m)) {
        $materials .= '<table class="table table-hover ta_work-table">
            <thead>
            <tr>
                <th>&nbsp;#</th>
                <th>Название</th>
                <th>Содержимое</th>
                <th class="text-center ta_work-area-th">Рабочая область</th>
                <th class="text-center">Уникальность</th>
                <th class="text-center">Орфография</th>
            </tr>
            </thead>
            <tbody>';
            foreach($data_m as $material) {
                $materials .= '<tr data-item="'.$material->id.'">
                    <td>
                        <input type="checkbox" name="ta_choose-material">
                    <td>';
                       if($element_mark == 'publs')
                           $materials .= '<a class="material-head" target="_blank" href="'.$material->entry_url.'">';
                       elseif($element_mark == 'ads')
                           $materials .= '<a class="material-head" target="_blank" href="'.$material->entry_url.'">';
                       elseif($element_mark == 'faqs')
                           $materials .= '<a class="material-head" target="_blank" href="'.$material->category->url.'">';

                        $materials .= $material->$name_mark.'
                                </a>
                    </td>
                    <td>
                        '.$material->$description_mark.'
                        <div class="ta_display-none ta_full-text">'.$material->$content_mark.'</div>
                        <div class="ta_display-none ta_full-text-speller"></div>
                    </td>
                    <td class="text-center">
                        <a class="ta_material-to-work" href="#ta_editor"><b>Посмотреть оригинал</b></a>
                        <div class="ta_display-none ta_speller-material-to-work">
                            <hr class="ta_hr-show-links"/>
                            <a href="#ta_editor">
                                <b>Посмотреть орфографию</b>
                            </a>
                        </div>

                    </td>
                    <td class="text-center">
                        <div disabled="disabled" class="btn btn-sm btn-primary ta_text-unique-btn">Проверить</div>
                    </td>
                    <td class="text-center">
                        <div class="btn btn-sm btn-info ta_text-orthography-btn">Проверить</div>
                    </td>
                </tr>';
            }
            $materials .= '<tr>
                <td colspan="4"></td>
                <td class="text-center">
                    <div disabled="disabled" class="btn btn-sm btn-primary ta_text-unique-all-btn">Проверить все</div>
                </td>
                <td class="text-center">
                    <div class="btn btn-sm btn-info ta_text-orthography-all-btn">Проверить все</div>
                </td>
            </tr>
            </tbody>
        </table>
        <script>
            jQuery(".ta_result-div").show();
        </script>';
    } else {
        $materials .= '<div class="alert alert-warning"><b>Wazzup!!! Подходящих материалов не найдено.</b></div>
        <script>
            jQuery(".ta_result-div").hide();
        </script>';
    }



