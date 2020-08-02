///En desarrollo
const editData = document.getElementById('editData')
const profileImg = document.getElementById('profile-img')

profileImg.addEventListener('click', () => { editData.click() })

const flash_msg = document.getElementById('flash-msg')
const cross = document.getElementById('flash-X')

cross.addEventListener('click',()=>{
    flash_msg.classList.add('dsp-none')
})
