 $(document).ready(function(){
    $("#menu").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });
});

let closeForm = document.querySelector('#cross');
closeForm.addEventListener("click", function(){
    let cover = document.querySelector('.formCover');
    cover.classList.remove('formCover');

    let form = document.querySelector('#userNameForm');
    form.style.display = "none";
});

