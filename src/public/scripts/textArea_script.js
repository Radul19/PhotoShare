function removeWhiteSpace() {
    var myTxtArea = document.getElementById('TextArea');
    myTxtArea.value = myTxtArea.value.replace(/^\s*|\s*$/g,'');
}
removeWhiteSpace()