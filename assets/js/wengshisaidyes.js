var rsvp = $( "#link-rsvp" );
var scrolling = {
    behavior: "smooth"
};
var $form = $('form#rsvp'),
  url = 'https://script.google.com/macros/s/AKfycbxriZbi9EzPKoKhFI2wzsQDS93Jn7CqIIiNMFhQ1Y8dbrLl-o4/exec'

rsvp.click(function() {
    $( "#navigation-bar" ).toggleClass( "slide" );
    $( "#parallax-container" ).toggleClass( "slide" );
    pane = $( "#rsvp-pane" ).toggleClass( "slide-pane" );
    $( "#submit-form" ).val('✉ Send');
    if ($( "#form-wrapper").hasClass( "fieldset-hidden-in-the-html" ) && !pane.hasClass( "slide-pane" ))  {
        //im too lazy to do the right logic
    } else {
        $( ".field-wrapper" ).toggleClass( "fieldset-hidden-in-the-html" );
    }
    rsvp.toggleClass( "rolled-over" );
});

//Link scroll-to effects

$( "#link-when" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-when").scrollIntoView(scrolling);
});

$( "#link-where" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-where").scrollIntoView(scrolling);
});

$( "#link-accommodations" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-hotel").scrollIntoView(scrolling);
});

$( "#link-faq" ).click(function() {
    if (rsvp.hasClass( "rolled-over" )) {
        rsvp.click();
    }
    document.querySelector("#snap-faq").scrollIntoView(scrolling);
});

// Form handling
// -----------------

// Span input handling
$( "span[contenteditable='true']" ).keyup(function(e) {
    input = $( this );
    input.prop("edited", true);
    if (input.text().length < 1) {
        input.addClass( "empty" );
    } else {
        input.removeClass( "empty" );
    }
});

$( "span[contenteditable='true']" ).keydown(function(e) {
    if (e.which == 13) {
        e.preventDefault();
        $( this ).blur();
    }
});

$( "span[contenteditable='true']" ).click(function() {
    input = $( this );
    if (!input.prop("edited")) {
        input.text("");
        input.keyup();
    }
});

// Select resizing and decision text handling
$( "select" ).change(function() {
    select = $( this );
    option = select.children( "option:selected" );
    select.width( option.outerWidth() );
    if ( select.is( "#guest-sur" ) ) {
        if ( option.val() == "Yes" ) {
            $( "#guest-field" ).removeClass( "fieldset-hidden-in-the-html" );
        } else {
            $( "#guest-field" ).addClass( "fieldset-hidden-in-the-html" );
        }
    }

    // Decision handling, we are assuming binary decisions
    decision = select.next().filter( ".decision" );
    if (decision.length > 0) {
        choices = decision.children().filter( ".choice" );
        if (!choices.hasClass( "chosen" )) {
            choices.first().addClass( "chosen" );
        } else {
            choices.toggleClass( "chosen" );
        }
    }
});

// Trigger change at least once on each to set width and initial decision
$( "select" ).each(function() {
    $( this ).change();
    $( this ).keyup();
});

// Form event
$( "#submit-form" ).on('click', function(e) {
    e.preventDefault();

    $( "#submit-form" ).val('...');
    $( "#rsvp fieldset" ).prop("disabled", true);
    $( "#form-wrapper" ).toggleClass( "fieldset-lurking" );

    $( "#name" ).val( $( "#name-sur" ).text() );
    $( "#entree" ).val( $( "#entree-sur" ).val() );
    $( "#diet" ).val( $( "#diet-sur" ).val());
    $( "#restrictions" ).val( $( "#restrictions-sur" ).text() );
    $( "#guest" ).val( $( "#guest-sur" ).val() );
    $( "#guest-name" ).val( $( "#guest-name-sur" ).text() );
    $( "#guest-entree" ).val( $( "#guest-entree-sur" ).val() );
    $( "#guest-diet" ).val( $( "#guest-diet-sur" ).val() + $( "#guest-diet-sur-details" ).text() );
    $( "#guest-restrictions" ).val( $( "#guest-restrictions-sur" ).text() );

    $( "input[type='text']" ).each(function() {
      console.log($( this ).val());
    });

    var jqxhr = $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        data: $form.serializeObject()
    }).done( function() {
        // this does not validate success!
        $( ".field-wrapper" ).toggleClass( "fieldset-hidden-in-the-html" );
        $( "#form-wrapper" ).toggleClass( "fieldset-lurking" );
        $( "#rsvp fieldset" ).prop("disabled", false);
        $( "#submit-form" ).val('✔');
    });
});

$( '.close' ).click(function(e) {
    rsvp.click();
});
