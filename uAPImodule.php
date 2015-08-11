<?php
/* 
        Версия 1.0 
        Дата создания: 9 февраля 02:00
        Информация о модуле: http://api.ucoz.net/ru/manual/module
        По всем вопросам вы можете обратиться на api@ucoz.net
*/

//setup для работы с uApi
 $oauth_nonce = md5(microtime().mt_rand()); //не изменять
 //$oauth_nonce2 = md5(microtime().mt_rand()); //не изменять
 $timestamp = time(); //не изменять
 $sig_method = 'HMAC-SHA1'; //не изменять
 $oauth_version = '1.0'; //не изменять

 /* $consumer_key = 'Nvw3Wm7v1bN8';
 $consumer_secret = 'Tu.yUtCw9ygRQPJFrDpgHurMeWn7q7';
 $oauth_token = 'Ugqe53bimpieTA4wZoSPPfWgakL.v5zjRREXl4RJ';
 $oauth_token_secret = 'yRylogtLxZ4a0.gSdGRhRhn443ZVH422cqEVuGTx';
 $main_url = 'http://alphatest-6347.ucoz.ru/uapi'; //нужно указать с http:// и с uapi. Например: http://alphatest-0027.ucoz.ru/uapi */

 /*$consumer_key = '';
 $consumer_secret = '';
 $oauth_token = '';
 $oauth_token_secret = '';
 $main_url = '';*/

//формирование setup закончено



/*
функция для генерация подписанного запроса. 
$method может принимать вид POST, GET, DELETE, PUT. 
$request_url указывает куда делать запрос
$parametrs параметры к запросу
$format в каком виде получить данные (xml/json/)
*/

function uAPIModule ($request_url, $method, $parametrs, $format) {
    global $basestring, $consumer_key, $oauth_nonce, $sig_method, $timestamp, $oauth_token, $oauth_version, $hash_key, $oauth_signature, $consumer_secret, $oauth_token_secret, $main_url;

    //начинается формирование подписи для правильного запроса
$request_url = $main_url.mb_strtolower(trim($request_url));
$method = mb_strtoupper($method);
$basestring = str_replace('+', '%20', http_build_query($parametrs));
$basestring = $method.'&'.urlencode($request_url).'&'.urlencode($basestring);
$hash_key = $consumer_secret.'&'.$oauth_token_secret;
$oauth_signature = urlencode(trim(base64_encode(hash_hmac('sha1', $basestring, $hash_key, true))));
$parametrs_forurl = http_build_query($parametrs);
$url = $request_url.'?oauth_signature='.$oauth_signature;
$url_for = $request_url.'?'.$parametrs_forurl.'&oauth_signature='.$oauth_signature;

$curl = curl_init();
switch ($method) {

  case 'GET':
  $parametrs = http_build_query($parametrs);
    curl_setopt($curl, CURLOPT_URL, $url_for);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    $uAPIcurlresult = curl_exec($curl);
   return $uAPIcurlresult;
   break;
  
  case 'POST':
  $parametrs = http_build_query($parametrs);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $parametrs);
    $uAPIcurlresult = curl_exec($curl);
    return $uAPIcurlresult;

    break;

    case 'PUT':
      $curl = curl_init($url);
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
      curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
      curl_setopt($curl, CURLOPT_POSTFIELDS, $parametrs_forurl);
      $uAPIcurlresult = curl_exec($curl);
      return $uAPIcurlresult;
    break;

    case 'DELETE':

curl_setopt($curl, CURLOPT_URL, $url_for);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'DELETE');
    $uAPIcurlresult = curl_exec($curl);
  return $uAPIcurlresult;

    break;


  default:
    echo 'Неизвестный метод передачи данных!';
    break;

    
}
    curl_close($curl);
}
?>