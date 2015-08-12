/** 
 * Скроллинг
 */

function scroll_to(element) {
    $('html, body').animate({
        scrollTop: element.offset().top - 100
    }, 500);
}


Application.init();
ProjectsList.init();
Editor.init();
Graphics.init();