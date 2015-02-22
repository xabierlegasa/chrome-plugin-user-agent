

$(function() {
    $('[data-i18n]').each(function() {
        var me = $(this);
        var key = me.data('i18n');
        me.html(chrome.i18n.getMessage(key));
    });
    // copy text of first <h1> if any to document title
    document.title = $('h1').first().text();
});