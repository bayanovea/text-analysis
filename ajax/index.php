<?php

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

$time_start = microtime_float();

if(!$_POST)
    exit();

require_once('../uAPImodule.php');

/* Берем приватную информацию из формы, если в файле uAPImodule.php не заполнено */
if(!$consumer_key)
    $consumer_key = $_POST['consumer_key'];
if(!$consumer_secret)
    $consumer_secret = $_POST['consumer_secret'];
if(!$oauth_token)
    $oauth_token = $_POST['token'];
if(!$oauth_token_secret)
    $oauth_token_secret = $_POST['token_secret'];
if(!$main_url)
    $main_url = $_POST['main_url'];

/* Задаем параметры */
$parametrs = array(
    'oauth_consumer_key' => $consumer_key, //обязательный параметр
    'oauth_nonce' => $oauth_nonce, //обязательный параметр
    'oauth_signature_method' => $sig_method, //обязательный параметр
    'oauth_timestamp' => $timestamp, //обязательный параметр
    'oauth_token' => $oauth_token, //обязательный параметр
    'oauth_version' => $oauth_version, //обязательный параметр
);

/* Для каждого модуля обозначения для название/контента и т.д. разные, приводим к одинному формату */
switch($_POST['ta_select-module']) {
    case 'publ':
        $element_mark = 'publs';
        $total_mark = 'total_publs';
        $description_mark = 'description';
        $content_mark = 'message';
        $name_mark = 'title';
        break;
    case 'board':
        $element_mark = 'ads';
        $total_mark = 'total_ads';
        $description_mark = 'description';
        $content_mark = 'description';
        $name_mark = 'title';
        break;
    case 'gb':
        $element_mark = 'posts';
        $total_mark = 'total_posts';
        $description_mark = 'message';
        $content_mark = 'message';
        $name_mark = 'author';
        break;
    case 'faq':
        $element_mark = 'faqs';
        $total_mark = 'total_faqs';
        $description_mark = 'answer';
        $content_mark = 'answer';
        $name_mark = 'subject';
    default:
        break;
}

/* В зависимости от запроса, совершаем разные api-запросы */
switch($_POST['type']) {
    /* Получаем материалы */
    case 'get-materials':
        ksort($parametrs);
        // В зависимости от выбранного модуля, посылаем запросы в разные места
        $data = json_decode(uAPIModule('/'.$_POST['ta_select-module'], 'GET', $parametrs, ''));
        $data_m = $data->$element_mark;
        $return['all-materials-count'] = $data->$total_mark;

        // Если кол-во материалов больше, чем отображается на странице (настраивается в панеле), то
        // получаем все материалы и склеиваем в 1 массив.
        $pages_count = floor(($data->$total_mark - 1) / $data->per_page) + 1;
        if($pages_count > 1) {
            $i = 2;
            while ($i < $pages_count+1) {
                $oauth_nonce = md5(microtime() . mt_rand());
                $parametrs['oauth_nonce'] = $oauth_nonce;
                $parametrs['page'] = $i;
                $data_add = json_decode(uAPIModule('/'.$_POST['ta_select-module'], 'GET', $parametrs, ''));
                $data_add_m = $data_add->$element_mark;
                $data_m = array_merge($data_m, $data_add_m);
                $i++;
            }
        }

        // Работа с фильтрами. Т.к. в api нет возможности отсеять ненужные материалы, то делаем это
        // простым перебором
        $filter = array(
            'category' => $_POST['ta_filter-category'],
            'id-from' => $_POST['ta_filter-id-from'],
            'id-to' => $_POST['ta_filter-id-to'],
            'limit' => $_POST['ta_filter-limit'],
            'date-from' => $_POST['ta_filter-date-from'],
            'date-to' => $_POST['ta_filter-date-to']
        );

        if($filter) {
           foreach($data_m as $key => $material) {
               $id = $material->id;
               $category_id = $material->category->id;
               $date = substr($material->add_date, 0, 10);
               // Категория
               if(!empty($filter['category']) && ($category_id != $filter['category']))
                   unset($data_m[$key]);
               // id от
               if(!empty($filter['id-from']) && ($id < $filter['id-from']))
                   unset($data_m[$key]);
               // id до
               if(!empty($filter['id-to']) && ($id > $filter['id-to']))
                   unset($data_m[$key]);
               // Дата от
               if(!empty($filter['date-from']) && ($date < $filter['date-from']))
                   unset($data_m[$key]);
               // Дата до
               if(!empty($filter['date-to']) && ($date > $filter['date-to']))
                   unset($data_m[$key]);
           }
           // Лимит
           if(!empty($filter['limit']))
               $data_m = array_slice($data_m, 0, $filter['limit']);
        }

        $return['filter-materials-count'] = count($data_m);

        // Cобираем информацию для детальной информации и графиков
        $categories = array();
        $dates = array();
        $data_m_reverse = array_reverse($data_m);
        foreach($data_m_reverse as $key => $material) {
            $category_id = $material->category->id;
            $date = substr($material->add_date, 0, 10);
            $name = $material->category->name;
            $category = $categories[$category_id];

            // Информация по категориям
            if($categories[$category_id]) {
                if($categories[$category_id]['dates'][$date]) {
                    $categories[$category_id]['dates'][$date]['count'] = $categories[$category_id]['dates'][$date]['count'] + 1;
                } else {
                    $categories[$category_id]['dates'][$date]['count'] = $categories[$category_id]['count'];
                }
                $categories[$category_id]['count']++;
            } else {
                $categories[$category_id]['name'] = $name;
                $categories[$category_id]['dates'][$date]['count'] = 1;
                $categories[$category_id]['count'] = 1;
            }
        }

        $return['categories'] = $categories;

        if($data->error->msg)
            $return['error'] = $data->error->msg;           // Ошибка(любая)
        else {
            include '../templates/get-materials.php';
            $return['materials'] = $materials;              // Удача, выводим материалы по шаблону
        }
        $time_end = microtime_float();
        $time = $time_end - $time_start;
        $return['microtime'] = $time;
        echo json_encode($return);

        break;

    /* Получаем категории */
    case 'get-categories':
        ksort($parametrs);
        // В зависимости от выбранного модуля, посылаем запросы в разные места
        $data = uAPIModule('/'.$_POST['ta_select-module'].'/category', 'GET', $parametrs, '');
        echo $data;
        break;

    case 'update':
        $parametrs['id'] = $_POST['id'];
        $parametrs['message'] = $_POST['message'];
        ksort($parametrs);
        return $data = json_decode(uAPIModule('/publ', 'put', $parametrs, ''));
        break;

    default:
        break;
}

?>