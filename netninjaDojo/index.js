// access DOM elements
const btns=document.querySelectorAll('button') ; // select all buttons from UI
const form=document.querySelector('form')
const formAct=document.querySelector('form span')
const input=document.querySelector('input')
const error=document.querySelector('.error')

// add event Listener to each button 
let    activity="cycling"
btns.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        // get activity
     activity=e.target.dataset.activity; // find out value in data-actvitity variable of button => can be done via e.target.dataset.activity 
                                                 // for data-xoxo => e.target.dataset.xoxo
        // remove "active" class from elm classlist
        btns.forEach(btn=>btn.classList.remove('active'))
        // add "active" class to clickled button
        e.target.classList.add('active');

        // set id of input tag to current activity
        input.setAttribute('id',activity)
        // chnage span text
        formAct.textContent=activity


    })
})


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const distance = parseInt(input.value);// input we hv already query selected
    if (distance) {
        const doc = {
            distance,
            date: new Date().toString(),
            activity
        }
        db.collection('activities').add(doc).then(() => {
            input.value = "";
            error.textContent = "";
        })

    } else {
        error.textContent = "please Enter valid value !!"
    }

})







