const uploadImage = document.getElementById('uploadImage')
const divImage = document.getElementById('divImage')
divImage.addEventListener('click', () => uploadImage.click())

uploadImage.addEventListener('change', (e) => {
    if (divImage.childNodes.length >= 1) {
        divImage.removeChild(divImage.childNodes[0])
    }
    const files = e.target.files
    const fragment = document.createDocumentFragment()
    for (const file of files) {
        const fileReader = new FileReader()
        const img = document.createElement('IMG')
        fileReader.readAsDataURL(file)
        fileReader.addEventListener('load', (e) => {
            img.setAttribute('src', e.target.result)
            img.classList.add('edit-loadImage')
            // divImage.classList.remove('edit-img-divHvr')
        })
        fragment.appendChild(img)
    }
    divImage.appendChild(fragment)
})


function removeWhiteSpace() {
    var myTxtArea = document.getElementById('TextArea');
    myTxtArea.value = myTxtArea.value.replace(/^\s*|\s*$/g,'');
}
removeWhiteSpace()

const flash_msg = document.getElementById('flash-msg')
const cross = document.getElementById('flash-X')

cross.addEventListener('click',()=>{
    flash_msg.classList.add('dsp-none')
})

